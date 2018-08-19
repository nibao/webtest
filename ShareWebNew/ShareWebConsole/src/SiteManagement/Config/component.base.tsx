///<reference path="./index.d.ts" />

import * as React from 'react';
import { noop } from 'lodash';
import '../../../gen-js/ShareSite_types';
import { createShareSiteClient, createEACPLogClient } from '../../../core/thrift2/thrift2';
import '../../../gen-js/EACPLog_types';
import { manageLog } from '../../../core/log2/log2';
import { isUserName, isDomain, IP } from '../../../util/validators/validators';
import WebComponent from '../../webcomponent';
import { ValidateMessage } from './helper';
import __ from './locale';

export default class ConfigBase extends WebComponent<Components.SiteManagement.Config.Props, Components.SiteManagement.Config.State> {

    static defaultProps = {
        site: null,
        onSiteConfigSuccess: noop,
        onSiteConfigCancel: noop
    }


    state = {
        site: this.props.site ? this.props.site : { name: '', ip: '', siteKey: '' },
        errorID: null,
        defaultNameValidateState: ValidateMessage.NORMAL,
        defaultIpValidateState: ValidateMessage.NORMAL,
        defaultKeyValidateState: ValidateMessage.NORMAL,
        loading: false
    }

    submit(site) {
        if (this.props.site) {
            if (!site.name) {
                this.setState({
                    defaultNameValidateState: ValidateMessage.EMPTY_VALIDATE
                })
                return
            }
            if (!isUserName(site.name)) {
                this.setState({
                    defaultNameValidateState: ValidateMessage.INVALID_NAME
                })
                return
            }
        } else {
            if (!site.name || !site.ip || !site.siteKey || !isUserName(site.name) || (/[A-Za-z]/i.test(site.ip) && !isDomain(site.ip)) || (!/[A-Za-z]/i.test(site.ip) && !IP(site.ip))) {
                this.setState({
                    defaultNameValidateState: !site.name ? ValidateMessage.EMPTY_VALIDATE : !isUserName(site.name) ? ValidateMessage.INVALID_NAME : ValidateMessage.NORMAL,
                    defaultIpValidateState: !site.ip ? ValidateMessage.EMPTY_VALIDATE : /[A-Za-z]/i.test(site.ip) ? (!isDomain(site.ip) ? ValidateMessage.INVALID_DOMAIN : ValidateMessage.NORMAL) : (!IP(site.ip) ? ValidateMessage.INVALID_IP : ValidateMessage.NORMAL),
                    defaultKeyValidateState: !site.siteKey ? ValidateMessage.EMPTY_VALIDATE : ValidateMessage.NORMAL
                })
                return
            }
        }
        if (this.props.site === null) {
            this.addSite({
                ip: site.ip,
                name: site.name,
                siteKey: site.siteKey
            })
        } else {
            this.editSite({ id: site.id, ip: site.ip, name: site.name })
        }
    }

    /**
     * 添加站点
     * @param site 
     */
    async addSite(paramInfo) {
        try {
            this.setState({
                errorID: null,
                loading: true
            })
            await createShareSiteClient({ ip: this.props.appIp }).AddSite(new ncTAddSiteParam(paramInfo));
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_ADD'],
                msg: __('添加分站点 "${siteName}" 成功', { 'siteName': paramInfo.name }), exMsg: __('站点地址 "${siteAddress}"', { 'siteAddress': paramInfo.ip })
            })
            this.props.onSiteConfigSuccess()
            this.setState({
                loading: false
            })
        } catch (ex) {
            this.setState({
                errorID: ex.errID,
                loading: false
            })
        }
    }



    /**
     * 编辑站点
     * @param site 
     */
    async editSite(paramInfo) {
        try {
            this.setState({
                errorID: null,
                loading: true
            })
            await createShareSiteClient({ ip: this.props.appIp }).EditSite(new ncTEditSiteParam(paramInfo))
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_SET'],
                msg: __('编辑站点名称 "${siteName}" 成功', { 'siteName': paramInfo.name }), exMsg: __('站点地址 "${siteAddress}"', { 'siteAddress': paramInfo.ip })
            })
            this.props.onSiteConfigSuccess();
            this.setState({
                loading: false
            })
        } catch (ex) {
            this.setState({
                errorID: ex.errID,
                loading: false
            })
        }
    }

    protected handleFocusName() {
        this.setState({
            defaultNameValidateState: ValidateMessage.NORMAL
        })
    }

    protected handleFocusIp() {
        this.setState({
            defaultIpValidateState: ValidateMessage.NORMAL
        })
    }

    protected handleFocusKey() {
        this.setState({
            defaultKeyValidateState: ValidateMessage.NORMAL
        })
    }

    protected onErrorConfirm(errorID) {
        this.setState({
            errorID: null
        })
        if (errorID === 10010) {
            this.props.onSiteConfigCancel()
        }
    }

    protected onErrorCancel(errorID) {
        this.setState({
            errorID: null
        })
        if (errorID === 10010) {
            this.props.onSiteConfigCancel()
        }
    }
}