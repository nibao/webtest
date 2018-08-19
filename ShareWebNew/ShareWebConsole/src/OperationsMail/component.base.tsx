import * as React from 'react';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { SMTPAlarmGetConfig, SMTPAlarmSetConfig, getActiveReportNotifyStatus, setActiveReportNotifyStatus, SMTPReceiverTest } from '../../core/thrift/sharemgnt/sharemgnt';
import WebComponent from '../webcomponent';
import __ from './locale';


export default class OperationsMailBase extends WebComponent<Console.OperationsMail.Props, Console.OperationsMail.State> {
    static defaultProps = {

    }

    state = {

        /**
         * 运营邮箱数据
         */
        mails: [],

        /**
         * 运维助手开关状态
         */
        operationsHelperStatus: false,
        showOperationsProtocol: false,
        isMailsChanged: false,
        isOperationsSwitchChanged: false,
        isMailTestedSuccess: false,
        errorStatus: undefined,
        isSavedSuccess: false
    }
    /**
     * 源数据：邮箱地址
     */
    originalMails: any
    /**
     * 源运维助手状态
     */
    originalOperationsProtocol: boolean

    async componentWillMount() {
        [this.originalMails, this.originalOperationsProtocol] = await Promise.all([SMTPAlarmGetConfig(), getActiveReportNotifyStatus()])
        this.setState({
            mails: this.originalMails,
            operationsHelperStatus: this.originalOperationsProtocol
        })

    }

    /**
     * 测试邮箱
     */
    protected async testMail() {
        try {
            await SMTPReceiverTest([this.state.mails])
            this.setState({
                isMailTestedSuccess: true
            })
        } catch (ex) {
            if (ex && ex.error && ex.error.errID) {
                this.setState({
                    errorStatus: ex.error.errID
                })
            }
        }

    }

    /**
     * 更改邮箱地址
     */
    protected changeMails = (mails: Array<string>) => {
        this.setState({
            mails,
            isMailsChanged: true
        })
    }

    /**
     * 保存邮箱
     */
    protected async saveMails() {
        try {
            await SMTPAlarmSetConfig([this.state.mails])
            this.originalMails = this.state.mails
            this.setState({
                isSavedSuccess: true,
                isMailsChanged: false
            })
            manageLog(ManagementOps.SET, __('设置 运维邮箱地址 成功'), this.state.mails.join('、'), Level.INFO)
        } catch (ex) {
            if (ex && ex.error && ex.error.errID) {
                this.setState({
                    errorStatus: ex.error.errID
                })
            }

        }
    }

    /**
     * 取消设置邮箱
     */
    protected cancelMails() {
        this.setState({
            mails: this.originalMails,
            isMailsChanged: false
        })
    }

    /**
     * 开启或关闭运维助手
     */
    protected setOperationsStatus(value: boolean) {
        this.setState({
            operationsHelperStatus: value,
            isOperationsSwitchChanged: true
        })
    }

    /**
     * 展示运维服务条款
     */
    protected showOperationsProtocol() {
        this.setState({
            showOperationsProtocol: true
        })
    }

    /**
     * 保存运维服务设置
     */
    protected async saveOperationConfig() {
        try {
            await setActiveReportNotifyStatus([this.state.operationsHelperStatus]);
            this.originalOperationsProtocol = this.state.operationsHelperStatus;
            this.setState({
                isSavedSuccess: true,
                isOperationsSwitchChanged: false
            })
            if (this.state.operationsHelperStatus) {
                manageLog(ManagementOps.SET, __('开启 AnyShare运维助手 成功'), null, Level.INFO)
            } else {
                manageLog(ManagementOps.SET, __('关闭 AnyShare运维助手 成功'), null, Level.INFO)
            }

        } catch (ex) {
            if (ex && ex.error && ex.error.errID) {
                this.setState({
                    errorStatus: ex.error.errID
                })
            }
        }
    }

    /**
     * 取消运维服务设置
     */
    protected cancelOperationsConfig() {
        this.setState({
            operationsHelperStatus: this.originalOperationsProtocol,
            isOperationsSwitchChanged: false
        })
    }

    /**
     * 关闭测试邮箱成功的提示弹窗
     */
    protected closeisMailTestedSuccess() {
        this.setState({
            isMailTestedSuccess: false
        })
    }

    /**
     * 关闭错误弹窗
     */
    protected closeErrorTip() {
        this.setState({
            errorStatus: undefined
        })
    }

    /**
     * 关闭保存成功的提示
     */
    protected closeisSavedSuccess() {
        this.setState({
            isSavedSuccess: false
        })
    }

    /**
     * 关闭服务条款
     */
    protected closeOperations() {
        this.setState({
            showOperationsProtocol: false
        })
    }

}