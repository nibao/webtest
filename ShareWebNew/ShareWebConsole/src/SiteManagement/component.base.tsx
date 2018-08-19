///<reference path="./index.d.ts" />

import * as React from 'react';
import { createShareSiteClient, createEVFSClient, createShareMgntClient, ECMSManagerClient } from '../../core/thrift2/thrift2';
import '../../gen-js/EACPLog_types';
import { manageLog } from '../../core/log2/log2';
import WebComponent from '../webcomponent';
import __ from './locale';

export default class SiteManagementBase extends WebComponent<Components.SiteManagement.Props, Components.SiteManagement.State>{

    state = {
        sites: [],
        localSite: null,
        multisiteEnabled: false,
        addingSite: false,
        editingSite: null,
        showToggleSiteDialog: false,
        removingSite: null,
        dbNodeInfos: null,
        appIp: '',
        OSSInfo: null,
        isClosing: false,
        isLoading: true,
        removing: false,
        selection: null,
        devinfo: null,
        errorHardwareType: false
    }

    async componentWillMount() {
        let appIp = await ECMSManagerClient.get_app_master_node_ip();
        let dbNodeInfos = await ECMSManagerClient.get_app_node_info();
        if (dbNodeInfos.length === 0) {
            this.setState({
                dbNodeInfos,
                isLoading: false
            })
        } else {
            this.setState({
                multisiteEnabled: await createShareSiteClient({ ip: appIp }).GetMultSiteStatus(),
                dbNodeInfos,
                appIp,
                OSSInfo: await createEVFSClient({ ip: appIp }).GetThirdPartyOSSInfo(),
                devinfo: await createShareMgntClient({ ip: appIp }).Licensem_GetDeviceInfo()
            })
            this.sitesLoader(appIp);
        }
    }

    /**
      * 站点初始化数据
      */
    private async sitesLoader(ip) {
        const siteInfo = await createShareSiteClient({ ip }).GetLocalSiteInfo();
        this.setState({
            localSite: siteInfo,
            isLoading: false
        })
        if (siteInfo.type == 1) {
            //站点类型为总站点
            this.setState({
                sites: await createShareSiteClient({ ip }).GetSiteInfo()
            })
        } else {
            this.setState({
                sites: [siteInfo]
            })
        }
    }

    protected onAddClick() {
        if (this.state.devinfo.hardwareType === 'S6020' || this.state.devinfo.hardwareType === 'S6020-ND1') {
            this.setState({
                errorHardwareType: true
            })
            return
        }
        this.setState({
            addingSite: true
        })
    }

    protected onEditeClick(e, editingSite) {
        this.setState({
            editingSite
        })
        if (this.state.selection && this.state.selection === editingSite) {
            e.stopPropagation()
        }

    }

    protected onDeleteClick(e, removingSite) {
        this.setState({
            removingSite
        })
        if (this.state.selection && this.state.selection === removingSite) {
            e.stopPropagation()
        }
    }

    protected handleSelectedList({ detail }) {
        this.setState({
            selection: detail
        })
    }

    /**
     * 设置多站点状态
     */
    protected setMultipleSite(multisiteEnabled) {
        if (this.state.localSite.type === ncTSiteType.NCT_SITE_TYPE_SLAVE) {
            return
        }
        if (multisiteEnabled && this.state.sites.length === 1) {
            this.setMultipleSiteStatus(multisiteEnabled);
        } else {
            this.setState({
                showToggleSiteDialog: true
            })
        }
    }

    /**
     * 设置站点
     * @param multisiteEnabled 多站点模式开启状态
     * @param branchSites 站点
     */
    protected async setMultipleSiteStatus(multisiteEnabled, branchSites = []) {
        if (multisiteEnabled && this.state.sites.length > 1) {
            this.setState({
                showToggleSiteDialog: false,
                isClosing: true
            })
        }
        await createShareSiteClient({ ip: this.state.appIp }).SetMultSiteStatus(!multisiteEnabled);
        this.props.onSiteConfigSuccess()
        if (multisiteEnabled) {
            manageLog({
                level: ncTLogLevel['NCT_LL_WARN'],
                opType: ncTManagementType['NCT_MNT_SET'],
                msg: __('关闭 多站点模式 成功，站点 “${address}” 已恢复为普通站点。', { 'address': this.state.localSite.ip })
            })
        } else {
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_SET'],
                msg: __('开启 多站点模式 成功，站点 “${address}”已变更为总站点。', { 'address': this.state.localSite.ip })
            })
        }
        this.setState({
            showToggleSiteDialog: false,
            multisiteEnabled: !multisiteEnabled,
            isClosing: false
        })

        this.sitesLoader(this.state.appIp);

        if (!branchSites || branchSites.length == 0) { return }

        branchSites.forEach(item => {
            if (item.type !== 1) {
                manageLog({
                    level: ncTLogLevel['NCT_LL_WARN'],
                    opType: ncTManagementType['NCT_MNT_DELETE'],
                    msg: __('移除分站点 “${siteName}” 成功', { 'siteName': item.name }),
                    exMsg: __('站点地址 “${siteAddress}”', { 'siteAddress': item.ip })
                })
            }
        });

    }

    protected async deleteSite(item) {
        this.setState({
            removingSite: null,
            removing: true
        })
        await createShareSiteClient({ ip: this.state.appIp }).DeleteSite(item.id);
        this.setState({
            removing: false
        })
        this.sitesLoader(this.state.appIp);
        manageLog({
            level: ncTLogLevel['NCT_LL_WARN'],
            opType: ncTManagementType['NCT_MNT_DELETE'],
            msg: __('移除分站点 “${siteName}” 成功', { 'siteName': item.name }),
            exMsg: __('站点地址 “${siteAddress}”', { 'siteAddress': item.ip })
        })
    }

    protected closeSiteDialog() {
        this.setState({
            showToggleSiteDialog: false
        })
    }

    protected closeDeleteDialog() {
        this.setState({
            removingSite: null
        })
    }

    /**
     *添加或编辑站点成功回调函数
     */
    protected onSiteConfigSuccess() {
        this.setState({
            addingSite: false,
            editingSite: null
        })
        this.sitesLoader(this.state.appIp);
        this.props.onSiteConfigSuccess()
    }

    protected onSiteConfigCancel() {
        this.setState({
            addingSite: false,
            editingSite: null
        })
    }

    protected onErrorHardwareTypeConfirm() {
        this.setState({
            errorHardwareType: false
        })
    }
}