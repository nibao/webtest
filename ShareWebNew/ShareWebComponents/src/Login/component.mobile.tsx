import * as React from 'react';
import * as classnames from 'classnames';
import { getErrorMessage } from '../../core/errcode/errcode';
import { OS_TYPE } from '../../core/auth/auth';
import { ClassName } from '../../ui/helper';
import Button from '../../ui/Button/ui.mobile';
import Overlay from '../../ui/Overlay/ui.mobile';
import Captcha from './Captcha/component.mobile';
import LoginBase from './component.base';
import { LoadStatus } from './component.base';
import { Status } from './helper';
import __ from './locale';
import * as styles from './styles.mobile.css';

export default class Login extends LoginBase {

    //  计时器id
    timeId: any = null

    render() {
        return (
            <div className={styles['login']}>
                <form onSubmit={this.login.bind(this, OS_TYPE.MOBILEWEB)} >
                    <div className={styles['input-user']}>
                        <input
                            type="text"
                            className={classnames(styles['account'], ClassName.BorderColor__Focus)}
                            value={this.state.account}
                            onChange={account => { this.inputAccount(account) }}
                            placeholder={__('请输入账号')}
                        />
                    </div>
                    <div className={styles['input-password']}>
                        <input
                            type="password"
                            className={classnames(styles['password'], ClassName.BorderColor__Focus)}
                            value={this.state.password} ref="password"
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
                                />
                            ) :
                            null
                    }
                    <div className={styles['submit-load']}>
                        <Button
                            type="submit"
                            disabled={!this.state.account || !this.state.password || (this.state.captchaStatus && !this.state.vcode)}
                            className={classnames(styles['input-btn'], ClassName.BackgroundColor)}
                        >
                            {
                                this.state.loadStatus === LoadStatus.READY ?
                                    __('登 录') :
                                    __('登录中...')

                            }
                        </Button>
                    </div>
                </form>
                {
                    this.state.loginStatus !== Status.NORMAL ?
                        this.renderError(this.state.loginStatus) :
                        null
                }
            </div>
        )
    }

    renderError(errorcode) {
        return (
            <Overlay position="center 80%" className={styles['error-code']}>
                <p>
                    {
                        this.getMessage(errorcode)
                    }
                </p>
            </Overlay>
        )
    }

    getMessage(errorcode) {

        if (this.timeId) {
            clearTimeout(this.timeId);
            this.timeId = null;
        }

        this.timeId = setTimeout(() => {
            this.setState({
                loginStatus: Status.NORMAL
            })
        }, 3000);

        switch (errorcode) {
            case Status.ORGIN_PASSWORD:
                return __('无法使用初始密码登录，请登录Web客户端修改密码。');
            case Status.EXPIRED_PASSWORD:
                return __('您的登录密码已失效，请登录Web客户端修改密码。');
            case Status.LOW_PASSWORD:
                return __('您的密码安全系数过低，请登录Web客户端修改密码。');
            case Status.ACCOUNT_LOCK:
                return __('您输入错误次数超过限制，账号已被锁定，${time}分钟内无法登录，请稍后重试', { 'time': this.state.errorInfo.detail.remainlockTime });
            case Status.NEED_ACTION:
                return __('用户已被禁用，请登录Web客户端激活');
            default:
                return getErrorMessage(errorcode);
        }
    }

}