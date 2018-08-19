import * as React from 'react';
import { noop } from 'lodash';
import WebComponent from '../../webcomponent';
import '../../../gen-js/ECMSManager_types';
import { IP, subNetMask, isLetterOrNumber } from '../../../util/validators/validators'
import { ECMSManagerClient } from '../../../core/thrift2/thrift2';
import '../../../gen-js/EACPLog_types';
import { manageLog } from '../../../core/log2/log2';
import __ from './locale';

/**
 * 网络类型
 */
enum Type {

    /**
     * 系统
     */
    System = 1,

    /**
     * 应用
     */
    Application = 2,

    /**
     * 存储
     */
    Storage = 3
}

/**
 * 不合法输入
 */
enum ValidateStatus {

    /**
     * 正常状态
     */
    OK,

    /**
     * IP或网卡验证不通过
     */
    IPValidate,

    /**
     * 网卡错误
     */
    NicValidate
}



export default class NetworkOverViewBase extends WebComponent<Console.NetworkOverView.Props, Console.NetworkOverView.State> {
    static type = Type

    static ValidateStatus = ValidateStatus

    static defaultProps = {
        doServerRedirect: noop
    }

    state = {
        vipInfos: [],
        editingVipInfo: null,
        progressStatus: null,
        IPValidateResult: ValidateStatus.OK,
        maskValidateResult: ValidateStatus.OK,
        nicValidateResult: ValidateStatus.OK,
        warning: false,
        errorInfo: null,
        keepaLivedStatus: false
    }

    editVipInfo = null;

    async componentWillMount() {
        const keepaLivedStatus = await ECMSManagerClient.get_keepalived_status()
        if (!keepaLivedStatus) {
            this.setState({
                keepaLivedStatus
            })
        } else {
            this.setState({
                vipInfos: await ECMSManagerClient.get_vip_info(),
            })
        }

    }

    /**
     * 打开编辑弹窗
     * @param vipInfo 
     * @param type 
     */
    protected setVipInfo(vipInfo: Core.ECMSManager.ncTVipInfo, type: number) {
        this.setState({
            editingVipInfo: {
                type,
                vipInfo
            },
        })

    }

    /**
     * 更改IP
     * @param value 文本框数据 
     */
    protected editVip(value: string) {
        this.editedVipInfo(value, 'vip');
        if (this.state.IPValidateResult !== ValidateStatus.OK) {
            if (IP(value)) {
                this.setState({
                    IPValidateResult: ValidateStatus.OK
                })
            }
        }
    }

    /**
     * 更改子网掩码
     * @param value 文本框数据 
     */
    protected editMask(value: string) {
        this.editedVipInfo(value, 'mask');
        if (this.state.maskValidateResult !== ValidateStatus.OK) {
            if (subNetMask(value)) {
                this.setState({
                    maskValidateResult: ValidateStatus.OK
                })
            }
        }
    }

    /**
     * 更改网卡
     * @param value 文本框数据 
     */
    protected editNic(value: string) {
        this.editedVipInfo(value, 'nic');
        if (this.state.nicValidateResult !== ValidateStatus.OK) {
            if (isLetterOrNumber(value)) {
                this.setState({
                    nicValidateResult: ValidateStatus.OK
                })
            }
        }

    }

    /**
     * 更改表单数据
     * @param value 文本框数据 
     * @param key  更改的字段
     */
    protected editedVipInfo(value: string, key: string) {
        this.setState({
            editingVipInfo: {
                type: this.state.editingVipInfo.type,
                vipInfo: {
                    ...this.state.editingVipInfo.vipInfo,
                    [key]: value
                }
            }
        })

    }



    /**
     * 保存高可用节点
     */
    protected confirmEditVipInfo() {
        const { vipInfo, type } = this.state.editingVipInfo
        this.setState({
            IPValidateResult: IP(vipInfo.vip) ? ValidateStatus.OK : ValidateStatus.IPValidate,
            maskValidateResult: subNetMask(vipInfo.mask) ? ValidateStatus.OK : ValidateStatus.IPValidate,
            nicValidateResult: isLetterOrNumber(vipInfo.nic) ? ValidateStatus.OK : ValidateStatus.NicValidate
        })
        if (IP(vipInfo.vip) && subNetMask(vipInfo.mask) && isLetterOrNumber(vipInfo.nic)) {
            this.editVipInfo = this.state.editingVipInfo
            this.setState({
                editingVipInfo: null,
                warning: true
            })
        }
    }

    /**
     * 取消编辑
     */
    protected cancelEditVipInfo() {
        this.setState({
            editingVipInfo: null,
            IPValidateResult: ValidateStatus.OK,
            maskValidateResult: ValidateStatus.OK,
            nicValidateResult: ValidateStatus.OK
        })
    }

    /**
     * 关闭错误弹窗
     */
    protected closeErrorDialog() {
        this.setState({
            errorCode: 0
        })
    }

    /**
     * 设置网络概况
     * @param vipInfo 网络信息
     * @param type 网络类型
     */
    private async setNetwork(vipInfo, type) {
        const message = {
            [NetworkOverViewBase.type.System]: __('修改 系统访问IP 成功'),
            [NetworkOverViewBase.type.Application]: __('修改 应用服务访问IP 成功'),
            [NetworkOverViewBase.type.Storage]: __('修改 存储服务访问IP 成功')
        }
        const { vip, mask, nic } = vipInfo;

        try {

            await ECMSManagerClient.set_vip_info(
                new ncTVipInfo(vipInfo)
            )
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_SET'],
                msg: message[type],
                exMsg: __('IP地址：${vip}，子网掩码：${mask}，网卡：${nic}', { 'vip': vip, 'mask': mask, 'nic': nic })
            })
            this.setState({
                vipInfos: this.state.vipInfos.map(value => {
                    if (value.sys === vipInfo.sys) {
                        return vipInfo
                    } else {
                        return value
                    }
                }),
                progressStatus: null,
                editingVipInfo: null
            })
        }
        catch (ex) {
            this.setState({
                progressStatus: null,
                editingVipInfo: null,
                errorInfo: ex
            })
        }

    }

    /**
     * 确认编辑网络的节点
     */
    protected confirmWarningDialog() {
        this.setState({
            progressStatus: this.editVipInfo.type,
            warning: false
        }, () => {
            this.setNetwork(this.editVipInfo.vipInfo, this.editVipInfo.type)
        })
    }

    /**
     * 取消编辑网络节点
     */
    protected cancelWarningDialog() {
        this.setState({
            editingVipInfo: this.editVipInfo,
            warning: false
        })
    }

    /**
     * 关闭错误弹窗
     */
    protected confirmErrorDialog() {
        this.setState({
            errorInfo: null
        })
    }

}