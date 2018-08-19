import * as React from 'react';
import * as classnames from 'classnames';
import { getErrorMessage } from '../../core/errcode/errcode';
import { OS_TYPE } from '../../core/auth/auth';
import Button from '../../ui/Button/ui.desktop';
import { ClassName } from '../../ui/helper';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import SecondAuth from '../SecondAuth/component.desktop';
import ChangePassword from './ChangePassword/component.desktop';
import Captcha from './Captcha/component.desktop';
import LoginBase from './component.base';
import { InputType, LoadStatus } from './component.base';
import { Status } from './helper';
import __ from './locale';
import * as styles from './styles.desktop.css';
import * as load from './assets/loading.gif';

export default class Login extends LoginBase {
    render() {
        return (
            <div className={styles['container']}>
                <form onSubmit={this.login.bind(this, OS_TYPE.WEB)} autoComplete="off">
                    <div className={
                        classnames(styles['input-user'],
                            {
                                [styles['input-focus']]: this.state.focusing === InputType.ACCOUNT
                            }
                        )}>
                        <span className={styles['input-icon']} >
                            <UIIcon code={'\uf01f'} size={16} className={styles['icon-middle']} />
                            <span className={styles['input-line']} >
                            </span>
                        </span>
                        <input
                            className={styles['input-login']}
                            value={this.state.account}
                            onChange={account => { this.inputAccount(account) }}
                            onFocus={() => { this.setFocusStatus(InputType.ACCOUNT) }}
                            onBlur={() => { this.setBlurStatus() }}
                            placeholder={__('请输入账号')}
                        />
                    </div>
                    <div className={
                        classnames(styles['input-user'],
                            {
                                [styles['input-focus']]: this.state.focusing === InputType.PASSWORD
                            }
                        )}>
                        <span className={styles['input-icon']} >
                            <UIIcon code={'\uf020'} size={16} className={styles['icon-middle']} />
                            <span className={styles['input-line']} >
                            </span>
                        </span>
                        <input
                            type="password"
                            className={styles['input-login']}
                            value={this.state.password}
                            ref="password"
                            onFocus={() => { this.setFocusStatus(InputType.PASSWORD) }}
                            onBlur={() => { this.setBlurStatus() }}
                            onChange={password => { this.inputPassword(password) }}
                            placeholder={__('请输入密码')}
                        />
                    </div>
                    {
                        this.state.captchaStatus ?
                            (
                                <Captcha
                                    captchaPicture={this.state.captchaInfo.vcode}
                                    vcode={this.state.vcode}
                                    handleChange={value => { this.getInputVcode(value) }}
                                    changeNext={this.changeNext.bind(this)}
                                    onEnter={this.login.bind(this, OS_TYPE.WEB)}
                                />
                            ) :
                            null
                    }
                    <div className={styles['login-submit']}>
                        <Button type="submit" className={classnames(styles['input-btn'], ClassName.BackgroundColor)} >
                            {
                                this.state.loadStatus === LoadStatus.READY ?
                                    __('登 录') :
                                    __('登录中...')

                            }
                        </Button>
                    </div>
                    <div className={styles['error-size']}>
                        {
                            this.state.loginStatus === Status.NORMAL || this.state.needChangePassword ?
                                null :
                                this.getError(this.state.loginStatus)
                        }
                        {
                            this.state.caMessage ?
                                (<div className={styles['input-error']}>
                                    {this.state.caMessage}
                                </div>) :
                                null
                        }
                    </div>
                </form>
                {
                    this.state.secondAuthId ?
                        <SecondAuth
                            account={this.state.account}
                            thirdPartId={this.state.secondAuthId}
                            onSuccess={() => { this.secondAuthSuccess() }}
                            onCancel={() => { this.onCancelSecondAuth() }} />
                        : null
                }
                {
                    this.state.needChangePassword ? this.getError(this.state.loginStatus) : null
                }
            </div >
        )
    }

    getError(errorcode) {
        switch (errorcode) {
            case Status.NO_ACCOUNT:
                return (
                    <div className={styles['input-error']}>
                        {__('你还没有输入账号')}
                    </div>
                );

            case Status.NO_PASSWORD:
                return (
                    <div className={styles['input-error']}>
                        {__('你还没有输入密码')}
                    </div>
                );
            case Status.NO_VCODE:
                return (
                    <div className={styles['input-error']}>
                        {__('验证码不能为空，请重新输入')}
                    </div>
                )
            case Status.ACCOUNT_LOCK:
                return (
                    <div className={styles['input-error']}>
                        {__('您输入错误次数超过限制，账号已被锁定，${time}分钟内无法登录，请稍后重试', { 'time': this.state.errorInfo.detail.remainlockTime })}
                    </div>
                );
            case Status.CLIENT_LOGOUT:
                return (
                    <div className={styles['input-error']}>
                        {__('登录已超时，请重新登录')}
                    </div>
                );

            case Status.ORGIN_PASSWORD:
            case Status.LOW_PASSWORD:
            case Status.EXPIRED_PASSWORD:
                return (
                    <ChangePassword
                        errorCode={errorcode}
                        onConfirm={this.requestPasswordChange.bind(this)}
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