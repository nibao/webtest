import * as React from 'react';
import { hashHistory } from 'react-router';
import { reduce } from 'lodash';
import '../../../gen-js/ECMSManager_types';
import { ECMSManagerClient, createShareMgntClient } from '../../../core/thrift2/thrift2'
import { manageLog } from '../../../core/log2/log2';
import WebComponent from '../../webcomponent';
import { Type, ModelOpitions } from './helper';
import __ from './locale';


export default class LicenseConfigBase extends WebComponent<Components.LicenseConfig.Props, Components.LicenseConfig.State> {
    static contextTypes = {
        toast: React.PropTypes.any
    }

    static defaultProps = {

    }

    state = {
        devinfo: {},
        data: [],
        isLoading: true,
        selection: null,
        selectIndex: -1,
        addConfig: false,
        deleteLicense: null,
        nodeIp: '',
        viewQR: false,
        deleteErrorID: null,
        activeLicense: null,
        addThirdOpitionConfig: false,
        errorMsg: null
    }

    componentDidMount() {
        this.load()
    }

    /**
     * 初始化获取数据
     */
    async load() {
        try {
            //获取应用节点ip
            const nodeIp = await ECMSManagerClient.get_app_master_node_ip()
            const devinfo = await createShareMgntClient({ ip: nodeIp }).Licensem_GetDeviceInfo()
            const data = await createShareMgntClient({ ip: nodeIp }).Licensem_GetAllLicenses()
            const thirdPartyOptions = await createShareMgntClient({ ip: nodeIp }).NLPIRAuthm_GetAllAuthInfos()
            this.setState({
                devinfo,
                data: [...data, ...reduce(thirdPartyOptions, (pre, option) => {
                    return [...pre, {
                        value: null,
                        model: option.authType === 1 ? option.fileName + '.invalid' : option.authType == 2 ? option.fileName + '.test' : option.fileName,
                        type: 'thirdpartyoption',
                        authUserNum: null,
                        authNodeNum: null,
                        authCapacity: null,
                        expiredDay: option.expiredDay,
                        status: option.status,
                        endTime: option.endTime,
                        activeTime: option.activeTime
                    }]
                }, [])],
                nodeIp,
                isLoading: false,
                selection: []
            })
        } catch (ex) {
            this.setState({
                errorMsg: ex.expMsg,
                isLoading: false
            })
        }
    }

    /**
     * 选中设备列表文件
     */
    protected handleSelectedList({ detail }) {
        this.setState({
            selectIndex: this.state.data.indexOf(detail),
            selection: detail
        })
    }

    /**
     * 添加授权码
     */
    protected addAuthorizationCode() {
        this.setState({
            addConfig: true
        })
    }

    /**
     * 添加授权成功返回
     */
    protected onAddLicenseSuccess() {
        this.setState({
            addConfig: false,
            isLoading: true
        }, () => this.load())
    }

    /** 
     * 添加授权窗口关闭
    */
    protected oAddCancel() {
        this.setState({
            addConfig: false
        })
    }

    /**
     * 激活授权码
     */
    protected activeAuthorizationCode(selection) {
        this.setState({
            activeLicense: selection
        })
    }

    /**
     * 删除授权码
     */
    protected deleteAuthorizationCode(selection) {
        if (selection.status === ncTLicenseStatus.NCT_LS_HASACTIVE) {
            this.setState({
                deleteLicense: selection
            })
        } else {
            this.deleteLicense(selection)
        }
    }

    /**
     * 删除弹窗提示确认
     */
    protected onDeleteConfirm(deleteLicense) {
        this.deleteLicense(deleteLicense)
        this.setState({
            deleteLicense: null
        })
    }

    /**
     * 删除弹窗提示取消
     */
    protected onDeleteCancel() {
        this.setState({
            deleteLicense: null
        })
    }

    /**
     * 删除授权方法
     */
    private async deleteLicense(deleteLicense) {
        try {
            this.setState({
                isLoading: true
            })
            await createShareMgntClient(this.state.nodeIp).Licensem_DeleteLicense(deleteLicense.value)
            manageLog({
                level: ncTLogLevel['NCT_LL_WARN'],
                opType: ncTManagementType['NCT_MNT_DELETE'],
                msg: __('删除 ${licenseName} ${licenseCode} 成功', { 'licenseName': ModelOpitions[deleteLicense.model], licenseCode: deleteLicense.value })
            })
            this.load()

        } catch (exc) {
            manageLog({
                level: ncTLogLevel['NCT_LL_WARN'],
                opType: ncTManagementType['NCT_MNT_DELETE'],
                msg: __('删除 ${licenseName} ${licenseCode} 失败', { 'licenseName': ModelOpitions[deleteLicense.model], licenseCode: deleteLicense.value })
            })
            this.setState({
                isLoading: false,
                deleteErrorID: exc.errID
            })
        }

    }

    /**
     * 删除错误提示框确认
     */
    protected onDeleteErrorConfirm() {
        this.setState({
            deleteErrorID: null
        })
    }

    /**
     * 查看机器码
     */
    protected viewMachineCode() {
        this.setState({
            viewQR: true
        })
    }

    /** 
     * 查看机器码窗口关闭
    */
    protected onViewQRCancel() {
        this.setState({
            viewQR: false
        })
    }

    /**
     * 激活成功后回调
     */
    protected onActiveSuccess() {
        this.setState({
            activeLicense: null,
            isLoading: true
        })
        this.load()
    }

    /**
     * 激活窗口关闭
     */
    protected onActiveCancel() {
        this.setState({
            activeLicense: null
        })
    }

    /** 
     * 第三方选件
     */
    protected viewThirdPartyOption() {
        this.setState({
            addThirdOpitionConfig: true
        })
    }

    /**
     * 第三方选件添加成功后回调
     */
    protected oAddThirdOpitionSuccess() {
        this.setState({
            addThirdOpitionConfig: false,
            isLoading: true
        })
        this.load()
    }

    /**
     * 第三方选件窗口关闭
     */
    protected oAddThirdOpitionCancel() {
        this.setState({
            addThirdOpitionConfig: false
        })
    }

    protected onErrorConfirm() {
        this.setState({
            errorMsg: null
        }, () => hashHistory.goBack())
    }
}
