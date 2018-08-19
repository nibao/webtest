/// <reference path="./component.base.d.ts" />
import * as React from 'react';
import { noop } from 'lodash';
import WebComponent from '../webcomponent';
import session from '../../util/session/session';

/**
 * 登录状态
 */
export enum ErrorType {
    // 无异常
    NORMAL,

    // 无用户名
    NO_ACCOUNT,

    // 无密码
    NO_PASSWORD,

    // 客户端超时退出
    CLIENT_LOGOUT,

    // 初始密码登录
    ORGIN_PASSWORD = 401017,

    // 密码系数过低
    LOW_PASSWORD = 401013,

    // 密码已失效
    EXPIRED_PASSWORD = 401012,

    // 账号已被锁定
    ACCOUNT_LOCK = 401020
}

export default class AuthErrorBase extends WebComponent<Components.AuthError.Props, any> {
    static defaultProps = {
        errorType: ErrorType.NORMAL,

        onPasswordChange: noop
    }

    state = {
        errorType: this.props.errorType
    }

    async componentWillMount() {
        if (session.has('kickedOut')) {
            this.setState({
                errorType: session.take('kickedOut')
            })
        } else if (session.has('timeout')) {
            this.setState({
                errorType: ErrorType.CLIENT_LOGOUT
            })
            session.remove('timeout');
        }
    }

    cancelPassword() {
        this.setState({
            errorType: ErrorType.NORMAL
        })
    }


}