import * as React from 'react';
import * as classnames from 'classnames';
import { getErrorMessage } from '../../core/errcode/errcode';
import AuthErrorBase from './component.base';
import { ErrorType } from './component.base';
import ChangePassword from './ChangePassword/component.desktop';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class AuthError extends AuthErrorBase {
    render() {
        return (
            <div className={styles['error-size']}>
                {
                    this.state.errorType === ErrorType.NORMAL ?
                        null :
                        this.getError(this.state.errorType)
                }
            </div>
        )
    }

    getError(errorcode) {
        switch (errorcode) {
            case ErrorType.NO_ACCOUNT:
                return (
                    <div className={styles['input-error']}>
                        {__('你还没有输入用户名')}
                    </div>
                );

            case ErrorType.NO_PASSWORD:
                return (
                    <div className={styles['input-error']}>
                        {__('你还没有输入密码')}
                    </div>
                );
            case ErrorType.ACCOUNT_LOCK:
                return (
                    <div className={styles['input-error']}>
                        {__('您输入错误次数超过限制，账号已被锁定，${time}分钟内无法登录，请稍后重试', { 'time': this.state.errorInfo.detail.remainlockTime })}
                    </div>
                );
            case ErrorType.CLIENT_LOGOUT:
                return (
                    <div className={styles['input-error']}>
                        {__('登录已超时，请重新登录')}
                    </div>
                );

            case ErrorType.ORGIN_PASSWORD:
            case ErrorType.LOW_PASSWORD:
            case ErrorType.EXPIRED_PASSWORD:
                return (
                    <ChangePassword
                        errorCode={errorcode}
                        onConfirm={() => { this.props.onPasswordChange(this.props.account) }}
                        onCancel={() => { this.cancelPassword() }}
                    />
                )

            default:
                return (
                    <div className={styles['input-error']}>
                        {
                            getErrorMessage(errorcode)
                        }
                    </div>
                );
        }
    }
}