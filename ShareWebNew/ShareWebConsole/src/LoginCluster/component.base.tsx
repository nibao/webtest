import * as React from 'react';
import cookie from 'react-cookie';
import { noop } from 'lodash';
import '../../gen-js/EACPLog_types';
import '../../gen-js/ShareMgnt_types';
import '../../gen-js/ncTECMSManager';
import { createShareMgntClient, ECMSManagerClient } from '../../core/thrift2/thrift2';
import { loginLog } from '../../core/log2/log2';
import { getOEMConfByOptions } from '../../core/oem/oem';
import { ErrorCode as EcmsmanagerErrcode } from '../../core/thrift/ecmsmanager/errcode';
import { ErrorCode as ShareMgntErrCode } from '../../core/thrift/sharemgnt/errcode';
import { post, head } from '../../util/http/http';
import session from '../../util/session/session';
import WebComponent from '../webcomponent';
import { AuthResults, LoginStatus } from './helper';
import __ from './locale';

export default class LoginClusterBase extends WebComponent<Components.LoginCluster.Props, Components.LoginCluster.State> {
    static defaultProps = {
        onLoginSuccess: noop
    }

    state = {
        appIp: null,
        loginName: '',
        password: '',
        authType: 0,
        focusing: null,
        loginStatus: LoginStatus.Ready,
        loginAuthStatus: AuthResults.Normal,
        authFailedDetail: null,
        requireCaptcha: false,
        slogan: '',
        captchaInfo: {
            uuid: '',
            vcode: ''
        },
        vcode: '',
        showChangePassword: false
    }

    /**
     * 系统管理员userid(值唯一)
     */
    AdminUserId = '266c6a42-6131-4d62-8f39-853e7093701c'

    async componentWillMount() {
        this.setState({
            // 获取应用系统主节点ip (接口不抛错，返回为空字符串""，表示当前应用服务不可用)  
            appIp: await ECMSManagerClient.get_app_master_node_ip()
        }, async () => {
            if (this.state.appIp) {
                // 应用服务可用的情况下获取验证码状态和slogan      
                this.getCaptchaStatus();
                this.setState({
                    slogan: (await getOEMConfByOptions(['slogan'])).slogan
                })
            }
        })
    }

    /**
     * 获取是否需要验证码
     */
    private async getCaptchaStatus() {
        if (session.get('captchaStatus')) {
            this.setState({
                requireCaptcha: session.get('captchaStatus')
            })
            this.getCaptchaInfo(this.state.captchaInfo.uuid)
        } else {
            const { isEnable, passwdErrCnt } = await createShareMgntClient({ ip: this.state.appIp }).Usrm_GetVcodeConfig();
            if (isEnable && passwdErrCnt === 0) {
                session.set('captchaStatus', true)
                this.setState({
                    requireCaptcha: session.get('captchaStatus')
                })
                this.getCaptchaInfo(this.state.captchaInfo.uuid)
            }
        }
    }

    /**
     * 获取输入的验证码
     */
    protected getInputVcode(vcode: string) {
        this.setState({ vcode })
    }

    /**
     * 换下一个验证码
     */
    protected changeNext() {
        this.getCaptchaInfo(this.state.captchaInfo.uuid);
    }

    /**
     * 获取验证码图片
     */
    private async getCaptchaInfo(uuid: string) {
        this.setState({
            captchaInfo: await createShareMgntClient({ ip: this.state.appIp }).Usrm_CreateVcodeInfo(uuid),
            requireCaptcha: true,
            vcode: ''
        })
    }

    /**
     * 输入管理员登录名
     */
    protected inputLoginName(event): void {
        this.setState({
            loginName: event.target.value
        })
    }

    /**
     * 输入密码
     */
    protected inputPassword(event): void {
        this.setState({
            password: event.target.value
        })
    }

    /**
     * 文本聚焦
     * @param value = InputType.LoginName（账户输入）|| InputType.PassWord（密码输入）
     */
    protected setFocusStatus(value: number) {
        this.setState({
            focusing: value
        })
    }

    /**
     * 文本失焦
     */
    protected setBlurStatus(): void {
        this.setState({
            focusing: null
        })
    }

    /**
     * 应用子系统不可用时使用本地登录系统管理控制台
     */
    private async verifySignIn() {
        const { loginName, password } = this.state;

        try {
            const uuid = await ECMSManagerClient.verify_sign_in(loginName, password);
            return uuid;
        } catch (ex) {
            switch (ex.errID) {
                case EcmsmanagerErrcode.InvalidAccountOrPassword:
                    this.setState({
                        loginAuthStatus: AuthResults.UserOrPwdError
                    })
                    break;
            }
        }
    }

    /**
     * 认证
     */
    private async auth(loginName, password, vcode, captchaInfo, authType?) {
        try {
            const clientIp = (await head('/meta')).getResponseHeader('x-client-addr')

            const userid = await createShareMgntClient({ ip: this.state.appIp }).Usrm_Login(
                loginName,
                password,
                authType || 1,
                new ncTUserLoginOption({
                    loginIp: clientIp,
                    uuid: captchaInfo && captchaInfo.uuid ? captchaInfo.uuid : '',
                    vcode: vcode ? vcode : ''
                }));
            if (userid === this.AdminUserId) {
                session.remove('captchaStatus');
                loginLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTLoginType['NCT_CLT_LOGIN_IN'],
                    msg: __('登录 系统管理控制台 成功'),
                    exMsg: '',
                    userId: userid
                })
                return userid;
            } else {
                this.setState({
                    loginStatus: LoginStatus.Ready,
                    loginAuthStatus: AuthResults.NotSystemAdmin
                })
            }
        } catch (ex) {
            this.setState({
                loginStatus: LoginStatus.Ready
            })
            if (session.get('captchaStatus')) {
                // 重新获取验证码信息
                this.getCaptchaInfo(this.state.captchaInfo.uuid)

            } else if (ex.errDetail && JSON.parse(ex.errDetail).isShowStatus) {
                // 获取验证码信息
                session.set('captchaStatus', true)
                this.getCaptchaInfo(this.state.captchaInfo.uuid)
            }
            switch (ex.errID) {
                case ShareMgntErrCode.PwdInValid:
                    // 密码失效了
                    this.setState({
                        loginAuthStatus: AuthResults.PwdInValid
                    })
                    break;

                case ShareMgntErrCode.PwdUnSafe:
                    // 密码不安全或者失效了
                    this.setState({
                        loginAuthStatus: AuthResults.PwdUnSafe
                    })
                    break;

                case ShareMgntErrCode.PwdExpired:
                    // 密码已过期
                    this.setState({
                        loginAuthStatus: AuthResults.PwdExpired,
                    })
                    break;

                case ShareMgntErrCode.PwdFirstError:
                    // 第一次输入密码错误
                    this.setState({
                        loginAuthStatus: AuthResults.PwdFirstError
                    })
                    break;

                case ShareMgntErrCode.PwdSecError:
                    // 第二次输入密码错误
                    this.setState({
                        loginAuthStatus: AuthResults.PwdSecError
                    })
                    break;

                case ShareMgntErrCode.AccountLocked:
                    this.setState({
                        loginAuthStatus: AuthResults.AccountLocked,
                        authFailedDetail: JSON.parse(ex.errDetail)
                    })
                    break;

                case ShareMgntErrCode.ContinuousErrPwd3Times:
                    // 账号被锁定
                    createShareMgntClient({ ip: this.state.appIp }).Usrm_GetUserInfoByAccount(loginName).then(function (user) {
                        loginLog({
                            level: ncTLogLevel['NCT_LL_WARN'],
                            opType: ncTLoginType['NCT_CLT_LOGIN_IN'],
                            msg: __('登录 系统管理控制台 失败'),
                            exMsg: __('该用户连续3次输入错误密码'),
                            userId: user.id
                        })
                    });
                    this.setState({
                        loginAuthStatus: AuthResults.AccountLocked,
                        authFailedDetail: JSON.parse(ex.errDetail)
                    })
                    break;

                case ShareMgntErrCode.AccountOrPwdInError:
                    // 用户错误
                    createShareMgntClient({ ip: this.state.appIp }).Usrm_GetUserInfoByAccount(loginName).then(function (user) {
                        loginLog({
                            level: ncTLogLevel['NCT_LL_INFO'],
                            opType: ncTLoginType['NCT_CLT_LOGIN_IN'],
                            msg: __('登录 系统管理控制台 失败'),
                            exMsg: __('用户名或密码不正确'),
                            userId: user.id
                        })
                    });
                    this.setState({
                        loginAuthStatus: AuthResults.AccountOrPwdInError
                    })
                    break;

                case ShareMgntErrCode.OverErrCount:
                    this.setState({
                        loginAuthStatus: AuthResults.OverErrCount
                    })
                    break;

                case ShareMgntErrCode.VcodeExpired:
                    this.setState({
                        loginAuthStatus: AuthResults.VcodeExpired
                    })
                    break;

                case ShareMgntErrCode.VcodeError:
                    this.setState({
                        loginAuthStatus: AuthResults.VcodeError
                    })
                    break;
                case ShareMgntErrCode.LimitUserLogin:
                    this.setState({
                        loginAuthStatus: AuthResults.CommonUserLogin
                    })
                    break;
                default:
                    this.setState({
                        loginAuthStatus: ex.expMsg
                    })
                    break;
            }
        }
    }

    /**
     * 登录
     */
    protected async login(event) {
        const { loginName, password, vcode, captchaInfo } = this.state;
        event.preventDefault();

        if (!loginName) {
            this.setState({
                loginAuthStatus: AuthResults.NoLoginName
            })
        } else if (!password) {
            this.setState({
                loginAuthStatus: AuthResults.NoPassword
            })
        } else if (!vcode && this.state.requireCaptcha) {
            this.setState({
                loginAuthStatus: AuthResults.NoVcode
            })
            this.getCaptchaInfo(this.state.captchaInfo.uuid)
        } else {
            this.setState({
                loginStatus: LoginStatus.Loading
            })
            if (this.state.appIp === '') {
                const uuid = await this.verifySignIn();
                await post('/interface/signin/', { 'id': uuid },
                    {
                        sendAs: 'json',
                        readAs: 'json',
                        headers: { 'X-CSRFToken': cookie.load('csrftoken') }
                    });
                this.setState({
                    loginStatus: LoginStatus.Ready
                })
                this.props.onLoginSuccess(uuid);
            } else {
                // 使用应用管理控制台的登录接口登录系统管理控制台
                const userid = await this.auth(loginName, password, vcode, captchaInfo);
                if (userid) {
                    const user = await createShareMgntClient({ ip: this.state.appIp }).Usrm_GetUserInfo(userid);
                    await post('/interface/signin/', user,
                        {
                            sendAs: 'json',
                            readAs: 'json',
                            headers: { 'X-CSRFToken': cookie.load('csrftoken') }
                        });
                    this.setState({
                        loginStatus: LoginStatus.Ready,
                        loginAuthStatus: AuthResults.Normal
                    })
                    this.props.onLoginSuccess(user);
                }
            }
        }
    }

    /**
     * 取消修改密码
     */
    protected cancelModifyPassword() {
        this.setState({
            loginAuthStatus: AuthResults.Normal
        })
    }

    /**
     * 关闭错误提示弹窗
     */
    protected closeErrorDialog() {
        this.setState({
            loginAuthStatus: AuthResults.Normal
        })
    }

    protected handleCaptchaChange(captcha) {
        this.setState({
            captchaInfo: captcha
        })
    }

    /**
     * 打开修改密码弹窗
     */
    protected async openChangePasswordDialog() {
        this.setState({
            showChangePassword: true,
            loginAuthStatus: AuthResults.Normal
        })
    }

    /**
     * 修改密码成功后自动登录控制台
     */
    protected async handleChangePwdSuccess(password) {
        this.setState({
            showChangePassword: false,
            password: ''
        })
        // 使用应用管理控制台的登录接口登录系统管理控制台
        // const userid = await this.auth(this.state.loginName, password, this.state.vcode, this.state.captchaInfo);
        // const user = await createShareMgntClient({ ip: this.state.appIp }).Usrm_GetUserInfo(userid);
        // post('/interface/signin/', user,
        //     {
        //         sendAs: 'json',
        //         readAs: 'json',
        //         headers: { 'X-CSRFToken': cookie.load('csrftoken') }
        //     });
        // this.props.onLoginSuccess(user);
    }

    /**
     * 修改密码弹窗点击取消按钮
     */
    protected handleChangepPwdCancel() {
        this.setState({
            showChangePassword: false,
            loginAuthStatus: AuthResults.Normal
        })
    }
}