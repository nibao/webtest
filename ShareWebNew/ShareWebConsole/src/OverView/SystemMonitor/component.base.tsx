import * as React from 'react';
import { noop } from 'lodash';
import WebComponent from '../../webcomponent';
import { ECMSManagerClient, ShareMgntClient, createShareMgntClient } from '../../../core/thrift2/thrift2';
import '../../../gen-js/EACPLog_types';
import { manageLog } from '../../../core/log2/log2';
import { appStatusReady } from '../../../core/cluster/cluster';
import __ from './locale';

enum ErrorReason {
    /**
     * 获取告警状态失败
     */
    GetAlertStatusFail,

    /**
     * 获取告警详细状态失败
     */
    GetAlertTriggerStatusFail,

    /**
     * 获取邮箱失败
     */
    GetMailsFail,

    /**
     * 测试邮箱失败
     */
    TestMailFail,

    /**
     * 设置邮箱失败
     */
    SetMailsFail,

    /**
     * 开启告警状态失败
     */
    OpenAlertFail,

    /**
     * 关闭告警状态失败
     */
    CloseAlertFail

}
export default class SystemMonitorBase extends WebComponent<Console.SystemMonitor.Props, Console.SystemMonitor.State> {
    static defaultProps = {
        doSystemDetailRedirect: noop
    }

    state = {
        alertStatus: false,
        alertInfo: {
            Cache_volume_status: -1,
            Database_sync_status: -1,
            RAID_device_status: -1,
            SSD_device_status: -1,
            Server_status: -1,
            Storage_pool_available_space: -1,
            Storage_pool_device_status: -1,
            System_service_status: -1,
            System_volume_status: -1
        },
        mails: null,
        testMailSuccess: false,
        error: null,
        zabbixStatus: true
    }

    static ErrorReason = ErrorReason;

    appIp = '';

    async componentWillMount() {
        const zabbixStatus = await ECMSManagerClient.get_zabbix_status()
        if (!zabbixStatus) {
            this.setState({
                zabbixStatus: await ECMSManagerClient.get_zabbix_status()
            })
        } else {
            try {
                this.setState({
                    zabbixStatus: await ECMSManagerClient.get_zabbix_status(),
                    alertStatus: await ECMSManagerClient.is_alert_enable()

                })
            } catch (ex) {
                this.setState({
                    error: {
                        errorReason: ErrorReason.GetAlertStatusFail,
                        errorInfo: ex
                    }
                })
            }
            try {
                this.setState({

                    alertInfo: { ...this.state.alertInfo, ...(await ECMSManagerClient.get_alert_trigger_status()) }
                })
            } catch (ex) {
                this.setState({
                    error: {
                        errorReason: ErrorReason.GetAlertTriggerStatusFail,
                        errorInfo: ex
                    }
                })
            }
        }
    }

    /**
     * 设置邮箱
     */
    protected async setAlertMail() {
        this.appIp = await appStatusReady();
        try {
            if (this.appIp) {
                this.setState({
                    mails: await createShareMgntClient({ ip: this.appIp }).SMTP_Alarm_GetConfig()
                })
            }

        } catch (ex) {
            this.setState({
                error: {
                    errorReason: ErrorReason.GetMailsFail,
                    errorInfo: ex
                }
            })
        }

    }


    /**
     * 更改邮箱地址
     */
    protected changeMails(value) {
        this.setState({
            mails: value
        })
    }

    /**
     * 测试邮箱
     */
    protected async testMails() {
        try {
            await createShareMgntClient({ ip: this.appIp }).SMTP_ReceiverTest(this.state.mails)
            this.setState({
                testMailSuccess: true
            })
        } catch (ex) {
            this.setState({
                error: {
                    errorReason: ErrorReason.TestMailFail,
                    errorInfo: ex
                }
            })
        }

    }

    /**
     * 关闭测试成功的弹窗
     */
    protected closeTestSuccess() {
        this.setState({
            testMailSuccess: false
        })
    }


    /**
     * 保存邮箱
     */
    protected async confirmMails() {
        try {
            await createShareMgntClient({ ip: this.appIp }).SMTP_Alarm_SetConfig(this.state.mails)
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_SET'],
                msg: __('设置 邮箱 成功'),
                exMsg: ''
            })
            this.setState({
                mails: null
            })

        } catch (ex) {
            this.setState({
                error: {
                    errorReason: ErrorReason.SetMailsFail,
                    errorInfo: ex
                }
            })
        }
    }

    /**
     * 取消设置邮箱
     */
    protected async cancelMails() {
        this.setState({
            mails: null
        })
    }

    /**
     * 切换告警状态
     */
    protected async switchStatus(value, active) {
        try {
            if (active) {
                await ECMSManagerClient.enable_alert();
                this.setState({
                    alertStatus: active
                })
                manageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_SET'],
                    msg: __('开启 系统告警 成功'),
                    exMsg: ''
                })
            } else {
                await ECMSManagerClient.disable_alert();
                this.setState({
                    alertStatus: active
                })
                manageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_SET'],
                    msg: __('关闭 系统告警 成功'),
                    exMsg: ''
                })
            }

        } catch (ex) {
            this.setState({
                error: {
                    errorReason: active ? ErrorReason.OpenAlertFail : ErrorReason.CloseAlertFail,
                    errorInfo: ex
                }
            })
        }

    }


    /**
     * 关闭错误弹窗
     */
    closeErrorDialog() {
        this.setState({
            error: null
        })
    }

}