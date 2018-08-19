///<reference path="./component.base.d.ts" />

import * as React from 'react';
import cookie from 'react-cookie';
import { noop } from 'lodash';
import { getConfig } from '../../core/apis/eachttp/auth1/auth1'
import { getID, getUserType, authlogout, thirdauthLogoff, wiseduLogoff } from '../../core/auth/auth';
import { logout } from '../../core/logout/logout'
import WebComponent from '../webcomponent';

export default class LogoutBase extends WebComponent<Components.Logout.Props, any> implements Components.Logout.Base {

    state = {
        confirming: false,
    }

    static defaultProps = {
        onSuccess: noop
    }

    /**
     * 点击注销按钮
     */
    confirm() {
        this.setState({ confirming: true });
    }

    /**
     * 登出系统，如果开启了第三方认证，则同时执行第三方的登出接口
     */
    async confirmLogout() {
        await logout(this.props.onSuccess)
    }

    /**
     * 取消注销操作
     */
    cancel() {
        this.setState({ confirming: false })
    }

}