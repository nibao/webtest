import * as React from 'react';
import { noop } from 'lodash';
import session from '../../util/session/session';
import { getOEMConfByOptions } from '../../core/oem/oem';
import { getConfig } from '../../core/config/config';
import { authlogout, thirdauthLogoff, wiseduLogoff } from '../../core/auth/auth';
import { logout } from '../../core/logout/logout';
import { getUserQuota } from '../../core/apis/eachttp/quota/quota';
import { getHostInfo } from '../../core/apis/eachttp/redirect/redirect';
import { get as getUser } from '../../core/apis/eachttp/user/user';
import { UserType } from './helper';

export default class AccountDropMenuBase extends React.Component<Components.AccountDropMenu.Props, Components.AccountDropMenu.State>{

    static defaultProps = {
        link: '',
        doChangePassword: noop,
        doOpenHelp: noop,
        doOpenAgreement: noop,
        doOpenConsole: noop,
        doOpenClient: noop,
        doLogout: noop,
        doEnterDisk: noop
    }

    state = {
        quotainfo: {
            used: 0,
            quota: 0,
        },
        config: {}
    }

    async componentDidMount() {
        if (session.get('login')) {
            const [{ quotainfos }, oemConfig, config, userinfo, { host }] = await Promise.all([
                getUserQuota(),
                getOEMConfByOptions(['userAgreement', 'helper', 'FAQ']),
                getConfig(),
                getUser(),
                getHostInfo(null)
            ]);
            const quotainfo = quotainfos.reduce(({ used, quota }, quotaInfo) => ({ used: used + quotaInfo.used, quota: quota + quotaInfo.quota }), {
                used: 0,
                quota: 0,
            })
            this.setState({
                quotainfo,
                config: {
                    passwordUrl: config['third_pwd_modify_url'],
                    forbidOstype: config['forbid_ostype'],
                    userAgreement: oemConfig['userAgreement'],
                    helper: oemConfig['helper'],
                    FAQ: oemConfig['FAQ'],
                    usertype: userinfo.usertype,
                    host
                }
            })
        }
    }

    handleChangePassword() {
        const { passwordUrl, usertype } = this.state.config;
        usertype !== UserType.LocalUser && passwordUrl ? this.props.doChangePassword(passwordUrl) : this.props.doChangePassword();
    }

    /**
     * 登出系统，如果开启了第三方认证，则同时执行第三方的登出接口
     */
    handleLogout() {
        const { platform } = session.get('login')
        const doNotLogoffToken = platform === 'pc'
        logout(this.props.doLogout, doNotLogoffToken)
    }

    /**
     * 进入网盘
     */
    protected handleEnterDisk() {
        this.props.doEnterDisk()
    }
}