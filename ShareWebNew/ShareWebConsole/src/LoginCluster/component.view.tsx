import * as React from 'react';
import * as classnames from 'classnames';
import { ClassName } from '../../ui/helper';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import ChangePassword from '../ChangePassword/component.view';
import LoginClusterBase from './component.base';
import Captcha from './Captcha/component.view';
import ModifyPassword from './ModifyPassword/component.view';
import ErrorMessage from './ErrorMessage/component.view';
import { AuthResults, InputType, LoginStatus } from './helper';
import __ from './locale';
import * as styles from './styles.view';
import * as loading from './assets/loading.gif';

export default class LoginCluster extends LoginClusterBase {
    render() {
        const {
            appIp,
            loginName,
            password,
            slogan,
            loginStatus,
            loginAuthStatus,
            requireCaptcha,
            showChangePassword
        } = this.state;
        if (appIp === null) {
            return null
        }
        return (
            <div className={styles['index-panel']}>
                <div className={styles['login-body']}>
                    <div className={styles['header-font']}>{__('系统管理员登录')}</div>
                    <div className={styles['oem-organization']}>{slogan}</div>
                    <form
                        autoComplete="off"
                        onSubmit={(e) => { this.login(e) }}
                    >
                        <div
                            className={classnames(styles['input-user'], { [styles['input-focus']]: this.state.focusing === InputType.LoginName })}
                        >
                            <span className={styles['input-icon']} >
                                <UIIcon code={'\uf01f'} size={16} className={styles['icon-middle']} />
                                <span className={styles['input-line']} >
                                </span>
                            </span>
                            <input
                                className={styles['input-login']}
                                placeholder={__('请输入账号')}
                                value={loginName}
                                onChange={loginName => { this.inputLoginName(loginName) }}
                                onFocus={() => { this.setFocusStatus(InputType.LoginName) }}
                                onBlur={() => { this.setBlurStatus() }}
                            />
                        </div>
                        <div
                            className={classnames(styles['input-user'], { [styles['input-focus']]: this.state.focusing === InputType.PassWord })}
                        >
                            <span className={styles['input-icon']} >
                                <UIIcon code={'\uf020'} size={16} className={styles['icon-middle']} />
                                <span className={styles['input-line']} >
                                </span>
                            </span>
                            <input
                                type="password"
                                className={styles['input-login']}
                                placeholder={__('请输入密码')}
                                value={password}
                                onFocus={() => { this.setFocusStatus(InputType.PassWord) }}
                                onBlur={() => { this.setBlurStatus() }}
                                onChange={password => { this.inputPassword(password) }}
                            />
                        </div>
                        {
                            requireCaptcha ?
                                <Captcha
                                    captchaPicture={this.state.captchaInfo.vcode}
                                    vcode={this.state.vcode}
                                    handleChange={value => { this.getInputVcode(value) }}
                                    changeNext={() => this.changeNext()}
                                    onEnter={(e) => this.login(e)}
                                />
                                : null
                        }
                        <div className={styles['login-submit']}>
                            <Button
                                type="submit"
                                className={classnames(styles['input-btn'], ClassName.BackgroundColor)}
                            >
                                {
                                    loginStatus === LoginStatus.Ready ?
                                        __('登 录') :
                                        __('登录中...')
                                }
                            </Button>
                        </div>
                    </form>
                    {
                        (loginAuthStatus !== AuthResults.Normal &&
                            loginAuthStatus !== AuthResults.PwdExpired &&
                            loginAuthStatus !== AuthResults.PwdInValid &&
                            loginAuthStatus !== AuthResults.PwdUnSafe) ?
                            this.renderError(loginAuthStatus, loginName)
                            : null
                    }
                    {
                        loginAuthStatus === AuthResults.PwdExpired || loginAuthStatus === AuthResults.appNotAvailable ?
                            <ErrorMessage
                                errorType={loginAuthStatus}
                                onMessageConfirm={() => this.closeErrorDialog()}
                            />
                            : null
                    }
                    {
                        loginAuthStatus === AuthResults.PwdInValid || loginAuthStatus === AuthResults.PwdUnSafe ?
                            <ModifyPassword
                                errorCode={loginAuthStatus}
                                onModifyConfirm={() => { this.openChangePasswordDialog() }}
                                onModifyCancel={() => { this.cancelModifyPassword() }}
                            />
                            : null
                    }
                </div>
                {
                    showChangePassword ?
                        <ChangePassword
                            account={loginName}
                            onChangePwdSuccess={this.handleChangePwdSuccess.bind(this)}
                            onChangePwdCancel={this.handleChangepPwdCancel.bind(this)}
                            onUserLocked={this.handleChangepPwdCancel.bind(this)}
                        />
                        : null
                }
            </div>
        )
    }

    renderError(loginAuthStatus, loginName) {
        switch (loginAuthStatus) {
            case AuthResults.Normal:
                return null

            case AuthResults.UserOrPwdError:
                return (
                    <div className={styles['input-error']}>
                        {__('用户名或密码不正确')}
                    </div>
                )

            case AuthResults.NoLoginName:
                return (
                    <div className={styles['input-error']}>
                        {__('你还没有输入用户名')}
                    </div>
                )

            case AuthResults.NoPassword:
                return (
                    <div className={styles['input-error']}>
                        {__('你还没有输入密码')}
                    </div>
                )

            case AuthResults.NoVcode:
                return (
                    <div className={styles['input-error']}>
                        {__('验证码不能为空，请重新输入')}
                    </div>
                )

            case AuthResults.PwdFirstError:
                return (
                    <div className={styles['input-error']}>
                        {__('您已输错1次密码，连续输错3次将导致账号被锁定')}
                    </div>
                )

            case AuthResults.PwdSecError:
                return (
                    <div className={styles['input-error']}>
                        {__('您已输错2次密码，连续输错3次将导致账号被锁定')}
                    </div>
                )

            case AuthResults.AccountLocked:
            case AuthResults.ContinuousErrPwd3Times:
                return (
                    <div className={styles['input-error']}>
                        {__('您输入错误次数超过限制，账号已被锁定，${time}分钟内无法登录，请稍后重试',
                            { time: this.state.authFailedDetail && this.state.authFailedDetail.remainlockTime }
                        )}
                    </div>
                )
            case AuthResults.VcodeExpired:
                return (
                    <div className={styles['input-error']}>
                        {__('验证码已过期，请重新输入')}
                    </div>
                )

            case AuthResults.VcodeError:
                return (
                    <div className={styles['input-error']}>
                        {__('验证码不正确，请重新输入')}
                    </div>
                )

            case AuthResults.AccountOrPwdInError:
                return (
                    <div className={styles['input-error']}>
                        {__('用户名或密码不正确')}
                    </div>
                )

            case AuthResults.OverErrCount:
                if (loginName === 'admin') {
                    return (
                        <div className={styles['input-error']}>
                            {__('您输入错误次数超过限制，账号已被锁定，请联系厂商协助。')}
                        </div>
                    )
                } else {
                    return (
                        <div className={styles['input-error']}>
                            {__('您输入错误次数超过限制，账号已被锁定，请联系安全管理员。')}
                        </div>
                    )
                }

            case AuthResults.NotSystemAdmin:
                return (
                    <div className={styles['input-error']}>
                        {__('您不是系统管理员，无法登录系统控制台。')}
                    </div>
                )
            case AuthResults.CommonUserLogin:
                return (
                    <div className={styles['input-error']}>
                        {__('您是普通用户，无法登录控制台。')}
                    </div>
                )

            default:
                return (
                    <div className={styles['input-error']}>
                        {loginAuthStatus}
                    </div>
                )
        }
    }
}