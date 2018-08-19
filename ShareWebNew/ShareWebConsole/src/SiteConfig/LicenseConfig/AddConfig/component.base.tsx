import * as React from 'react';
import { ECMSManagerClient, createShareMgntClient } from '../../../../core/thrift2/thrift2'
import { manageLog } from '../../../../core/log2/log2';
import { validLicense } from '../../../../util/validators/validators'
import WebComponent from '../../../webcomponent';
import { ModelOpitions } from '../helper';
import __ from './locale';

interface Props {

    /**
     * 添加授权码成功后回调
     */
    onAddLicenseSuccess: () => void;
    /**
     * 添加窗口关闭回调
     */
    oAddCancel: () => void;
}

interface State {
    /**
     * 授权码数组
     */
    licenses: Array<string>,

    /** 
     * 错误码
    */
    errorID: number | null

    /**
     * 正在加载
     */
    loading: boolean,

    /**
     * 报异常时的授权码
     */
    licenseCode: string
}

export default class AddConfig extends WebComponent<Props, State> {

    state: State = {
        licenses: [],
        errorID: null,
        loading: false,
        licenseCode: ''
    }

    changeLicenses(value) {
        this.setState({
            licenses: value
        })
    }

    async onConfirm(licenses) {
        let temp = ''
        try {
            this.setState({
                loading: true
            })
            const nodeIp = await ECMSManagerClient.get_app_master_node_ip()
            for (let license of licenses) {
                temp = license
                const ncTLicenseInfo = await createShareMgntClient({ ip: nodeIp }).Licensem_AddLicense(license)
                manageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_SET'],
                    msg: __('添加 ${licenseName} ${licenseCode} 成功', { 'licenseName': ModelOpitions[ncTLicenseInfo.model], licenseCode: license })
                })
            }
            this.props.onAddLicenseSuccess()
            this.setState({
                errorID: null,
                loading: false
            })
        } catch (ex) {
            this.setState({
                errorID: ex.errID,
                loading: false,
                licenseCode: temp
            })
        }
    }

    isLicense(value) {
        return validLicense(value)
    }

    onErrorConfim() {
        this.props.oAddCancel()
    }

}