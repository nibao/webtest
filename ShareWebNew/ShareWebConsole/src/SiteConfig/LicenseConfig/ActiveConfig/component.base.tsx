import * as React from 'react';
import { noop, includes } from 'lodash';
import { ECMSManagerClient, createShareMgntClient } from '../../../../core/thrift2/thrift2'
import { manageLog } from '../../../../core/log2/log2';
import { getErrorMessage } from '../../../../core/exception/exception';
import { validActiveCode } from '../../../../util/validators/validators'
import WebComponent from '../../../webcomponent';
import { ModelOpitions } from '../helper';
import __ from './locale';

interface Props {

    /**
     * 激活授权信息
     */
    activeLicense: ncTLicenseInfo

    /**
     * 机器码
     */
    machineCode: string;


    /** 
     * 激活授权码窗口成功回调
    */
    onActiveSuccess: () => void;

    /**
     * 添加授权码窗口关闭
     */
    onActiveCancel: () => void;
}

interface State {
    /** 
     * 激活码
     */
    activeCode: string,

    /** 
     * 默认的激活码校验状态
     */
    defaultValState: null | number,

    /**
     * 正在加载
     */
    loading: boolean,

    /** 
     * 错误码
     */
    errorID: null | number,

    /** 
     * 系统返回的错误信息
     */
    errorMessage: null | string,

    /**
     * 激活成功但节点数或用户数不足的提示
     */
    message: null | string
}

const ValidError = 0

export default class ActiveConfigBase extends WebComponent<Props, State>{

    state = {
        activeCode: '',
        defaultValState: null,
        loading: false,
        errorID: null,
        errorMessage: null,
        message: ''
    }

    setActiveCode(value) {
        this.setState({
            activeCode: value,
            defaultValState: null
        })
    }

    async onConfirm(activeCode) {
        if (!validActiveCode(activeCode)) {
            this.setState({
                defaultValState: ValidError
            })
            return
        }
        try {
            this.setState({
                loading: true
            })
            const nodeIp = await ECMSManagerClient.get_app_master_node_ip()
            await createShareMgntClient({ ip: nodeIp }).Licensem_ActivateLicense(this.props.activeLicense.value, activeCode)
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_SET'],
                msg: __('激活 ${licenseName} ${licenseCode} 成功', { 'licenseName': ModelOpitions[this.props.activeLicense.model], licenseCode: this.props.activeLicense.value })
            })
            const devinfo = await createShareMgntClient({ ip: nodeIp }).Licensem_GetDeviceInfo()
            if (devinfo.authNodeNum > -1 && devinfo.usedNodeNum > -1 && devinfo.authNodeNum < devinfo.usedNodeNum) {
                this.setState({
                    loading: false,
                    message: __('激活成功，但由于节点授权数小于实际节点数，此授权码失效，请激活足够数量的节点代理。')
                })
                return
            } else if (devinfo.authUserNum > -1 && devinfo.usedUserNum > -1 && devinfo.authUserNum < devinfo.usedUserNum) {
                this.setState({
                    loading: false,
                    message: __('激活成功，但由于用户授权数小于已启用的用户数，此授权码失效，请激活足够数量的用户代理。')
                })
                return
            }
            this.props.onActiveSuccess()
            this.setState({
                errorID: null,
                loading: false
            })
        } catch (ex) {
            this.setState({
                errorID: ex.errID,
                errorMessage: ex.errMsg,
                loading: false
            })
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_SET'],
                msg: __('激活 ${licenseName} ${licenseCode} 失败', { 'licenseName': ModelOpitions[this.props.activeLicense.model], licenseCode: this.props.activeLicense.value }),
                exMsg: this.getErrorMsg(this.state.errorID, this.state.errorMessage)
            })
        }
    }

    getErrorMsg(errorID, errorMessage) {
        return includes([20512, 20513, 20514], errorID) ? getErrorMessage(errorID) :
            errorMessage
    }


    onErrorConfim() {
        this.setState({ errorID: null })
    }

    onMessageConfim() {
        this.setState({ message: null })
        this.props.onActiveSuccess()
    }
}