import * as React from 'react';
import { noop } from 'lodash';
import session from '../../util/session/session';
import { login } from '../../core/auth/auth';
import { getVcode } from '../../core/apis/eachttp/auth1/auth1'
import { getThirdAuth, getConfig } from '../../core/config/config';
import { caAuth } from '../../core/ca/ca';
import WebComponent from '../webcomponent';
import { Status } from './helper';


/**
 * 输入框类型
 */
export enum InputType {
    ACCOUNT,
    PASSWORD
}

/**
 *  登录状态
 */
export enum LoadStatus {
    READY,
    LOADING
}

export default class LoginBase extends WebComponent<Components.Login.Props, Components.Login.State> implements Components.Login.Component {
    static defaultProps = {
        onPasswordChange: noop,

        onSuccess: noop
    }

    state = {
        account: '',
        password: '',
        loginStatus: Status.NORMAL,
        focusing: null,
        loadStatus: LoadStatus.READY,
        caMessage: '',
        secondAuthId: '',
        needChangePassword: false,
        errorInfo: null,
        captchaStatus: false,
        captchaInfo: {
            uuid: '',
            vcode: ''
        },
        vcode: ''
    }

    userInfo = null

    componentWillMount() {
        if (session.has('kickedOut')) {
            if (session.get('kickedOut') === Status.ACCOUNT_LOCK) {
                this.setState({
                    loginStatus: session.take('kickedOut'),
                    errorInfo: { detail: session.take('detail') }
                })
            } else {
                this.setState({
                    loginStatus: session.take('kickedOut')
                })
            }


        } else if (session.has('timeout')) {
            this.setState({
                loginStatus: Status.CLIENT_LOGOUT
            })
            session.remove('timeout');
        }
        this.getCaptchaStatus()
    }

    protected login(ostype, event): void {

        if (!this.state.account) {
            this.setState({
                loginStatus: Status.NO_ACCOUNT
            })
        } else if (!this.state.password) {
            this.setState({
                loginStatus: Status.NO_PASSWORD
            })
        } else if (!this.state.vcode && session.get('captchaStatus')) {
            this.setState({
                loginStatus: Status.NO_VCODE,
                vcode: ''
            })
        } else {
            this.setState({
                loadStatus: LoadStatus.LOADING
            })

            getThirdAuth().then((thirdauth) => {
                // 开启了CA认证
                if (thirdauth.id === 'ideabank') {
                    caAuth(this.state.account, thirdauth.config).then(function () {
                        this.authLogin(ostype);
                    }, function (message) {
                        this.setState({
                            caMessage: message
                        })
                    })
                } else {
                    this.authLogin(ostype);
                }
            });
        }

        event.preventDefault();
    }

    private authLogin(ostype) {
        login(this.state.account, this.state.password, ostype, { uuid: this.state.captchaInfo.uuid, vcode: this.state.vcode, ismodify: false }).then(res => {
            session.remove('captchaStatus');
            this.userInfo = res;
            this.setState({
                loadStatus: LoadStatus.READY
            })
            if (res.needsecondauth) {
                getThirdAuth('id').then(thirdauthid => {
                    if (thirdauthid === 'cjsjy') {
                        this.setState({
                            secondAuthId: thirdauthid
                        })
                    }
                })
            } else {
                this.props.onSuccess(res);
            }
        }, err => {

            if (session.get('captchaStatus')) {
                this.getCaptchaInfo(this.state.captchaInfo.uuid);
            } else if (err.detail && err.detail.isShowStatus) {
                session.set('captchaStatus', true)
                this.getCaptchaInfo(this.state.captchaInfo.uuid);
            }
            this.setState({
                loadStatus: LoadStatus.READY,
                vcode: ''
            });

            if (err.errcode) {
                if (err.errcode === Status.EXPIRED_PASSWORD || err.errcode === Status.LOW_PASSWORD || err.errcode === Status.ORGIN_PASSWORD) {
                    this.setState({
                        loginStatus: err.errcode,
                        errorInfo: err,
                        needChangePassword: true
                    })
                } else {
                    this.setState({
                        loginStatus: err.errcode,
                        errorInfo: err
                    })
                }
            }

            this.refs.password && this.refs.password.focus();
            this.refs.password && this.refs.password.blur();
        })
    }

    protected inputAccount(e): void {
        this.setState({
            account: e.target.value
        })
    }

    protected inputPassword(e): void {
        this.setState({
            password: e.target.value
        })
    }

    /**
     * 文本聚焦
     * @param value = InputType.ACCOUNT（账户输入）|| InputType.PASSWORD（密码输入）
     */
    protected setFocusStatus(value) {
        this.setState({
            focusing: value
        })
    }

    /**
     * 文本失去聚焦
     * @param value = InputType.ACCOUNT（账户输入）|| InputType.PASSWORD（密码输入）
     */
    protected setBlurStatus(): void {
        this.setState({
            focusing: null

        })
    }

    /**
     * 取消跳转修改密码
     */
    protected cancelPassword() {
        this.setState({
            loginStatus: Status.NORMAL,
            needChangePassword: false
        })
    }
    /**
     * 二次认证成功
     */
    secondAuthSuccess() {
        this.setState({
            secondAuthId: ''
        })
        this.props.onSuccess(this.userInfo);
    }

    /**
     * 取消二次认证
     */
    onCancelSecondAuth() {
        this.setState({
            secondAuthId: ''
        })
    }

    /**
     * 获取是否需要验证码
     */
    private async getCaptchaStatus() {
        const vcodeLogin = await getConfig('vcode_login_config')
        if (session.get('captchaStatus')) {
            this.setState({
                captchaStatus: session.get('captchaStatus')
            })
            this.getCaptchaInfo(this.state.captchaInfo.uuid)
        } else if (vcodeLogin && vcodeLogin.isenable && vcodeLogin.passwderrcnt === 0) {
            session.set('captchaStatus', true)
            this.setState({
                captchaStatus: true
            })
            this.getCaptchaInfo(this.state.captchaInfo.uuid)
        }
    }

    /**
     * 获取输入的验证码
     */
    protected getInputVcode(vcode: string) {
        this.setState({
            vcode: vcode
        })
    }

    /**
     * 换下一个验证码
     */
    protected changeNext() {
        this.getCaptchaInfo(this.state.captchaInfo.uuid)
    }

    /**
     * 获取验证码图片
     */
    private async getCaptchaInfo(uuid: string) {
        this.setState({
            captchaInfo: await getVcode({ uuid }),
            captchaStatus: true
        })
    }

    /**
     * 去修改密码
     */
    protected requestPasswordChange() {
        this.props.onPasswordChange(this.state.account);
        this.setState({
            loginStatus: Status.NORMAL,
            needChangePassword: false
        })
    }
}