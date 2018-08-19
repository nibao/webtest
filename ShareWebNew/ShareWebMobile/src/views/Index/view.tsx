import * as React from 'react'
import { hashHistory } from 'react-router'
import { setup as setupOpenApi } from '../../../core/openapi/openapi'
import { getAuth } from '../../../core/auth/auth';
import { join } from '../../../core/apis/eachttp/invitation/invitation';
import { getOEMConfByOptions } from '../../../core/oem/oem';
import { getErrorMessage } from '../../../core/errcode/errcode';
import MessageDialog from '../../../ui/MessageDialog/ui.mobile'
import session from '../../../util/session/session'
import Login from '../../../components/Login/component.mobile'
import ThirdLogin from '../../../components/ThirdLogin/component.mobile';
import { clearRouteCache } from '../../helper'
import * as styles from './styles.css'
import __ from './locale'

enum PanelType {
    /**
     * 正常登录
     */
    NORMAL_LOGIN,

    /**
     * 第三方登陆
     */
    THIRD_LOGIN
}

enum InvitationStatus {
    /**
     * 无异常
     */
    OK
}

export default class Index extends React.Component<any, any>{

    state = {
        /**
         * 共享邀请状态
         */
        invitationStatus: InvitationStatus.OK,

        /**
         * 共享邀请是否已加入过
         */
        isJoined: false,

        logo: '',

        slogan: '',

        /**
         * 第三方登录信息
         */
        thirdauth: {},

        /**
         * 登录界面类型：正常登录 or 第三方登录
         */
        panel: undefined
    }

    loadUrl: string = ''

    async componentWillMount() {
        // 获取登录界面oem图标和文字
        const oems = await getOEMConfByOptions(['logo.png', 'slogan'])

        this.setState({
            logo: 'data:image/png;base64,' + oems['logo.png'],
            slogan: oems['slogan']
        })
    }

    async componentDidMount() {
        // thirdauth置为null，表示第三方认证配置已经获取完毕
        const thirdauth = await getAuth()

        this.setState({
            thirdauth: thirdauth ? thirdauth : null,
            panel: thirdauth && !thirdauth.config.hideThirdLogin ? PanelType.THIRD_LOGIN : PanelType.NORMAL_LOGIN,
        })
    }

    /**
     * 确定加入共享邀请错误弹窗
     */
    private confirmInvitation() {
        this.setState({
            invitationStatus: InvitationStatus.OK
        })

        const { redirect } = this.props.location.query
        hashHistory.replace(redirect ? redirect : '/home')
    }

    /**
     * 跳转到AnyShare主界面
     */
    private async getIn(login: any) {
        // clearRouteCache()
        clearRouteCache('/home/documents')

        session.set('login', login)
        setupOpenApi({
            userid: login.userid,
            tokenid: login.tokenid
        })

        const { redirect, invitation: invitationid } = this.props.location.query

        if (invitationid) {
            // 共享邀请登录
            try {
                const path = await join({ invitationid })
                this.loadUrl = `/home/documents/?gns=` + path.docid.replace('gns://', '')

                if (path.result) {
                    hashHistory.replace(redirect ? redirect : this.loadUrl)
                } else {
                    // 重复加入
                    this.setState({
                        isJoined: true
                    })
                }
            }
            catch (xhr) {
                this.setState({
                    invitationStatus: xhr.errcode
                })
            }

        } else {
            // 正常登录
            hashHistory.replace(redirect ? redirect : '/home')
        }
    }

    /**
     * 确定重复加入共享提示
     */
    private confirmJoined() {
        this.setState({
            isJoined: false
        })

        hashHistory.replace(this.loadUrl)
    }

    /**
     * 切换登录面板
     */
    private changePanel(status: PanelType) {
        this.setState({
            panel: status
        })
    }

    /**
     * 跳转第三方认证
     */
    private openAuth(authServer: string) {
        window.location.assign(authServer);
    }

    render() {
        const { logo, slogan, panel, thirdauth, invitationStatus, isJoined } = this.state

        return (
            <div className={styles['container']}>
                <div className={styles['login-panel']}>
                    <div className={styles['user-png']}>
                        <div className={styles['login-logo']}>
                            <img className={styles['login-image']} src={logo} />
                        </div>
                        <div className={styles['login-slogan']}>
                            {
                                slogan
                            }
                        </div>
                    </div>
                    {
                        panel === PanelType.NORMAL_LOGIN ?
                            <div className={styles['user-login']}>
                                <div className={styles['login']}>
                                    <Login onSuccess={this.getIn.bind(this)} />
                                </div>
                                {
                                    thirdauth && !thirdauth.config.hideThirdLogin ?
                                        (
                                            <div className={styles['change-panel']}>
                                                <a onClick={() => { this.changePanel(PanelType.THIRD_LOGIN) }}>
                                                    {
                                                        __('切换登录')
                                                    }
                                                </a>
                                            </div>
                                        ) :
                                        null
                                }
                            </div> :
                            null
                    }
                    {
                        panel === PanelType.THIRD_LOGIN ?
                            <div className={styles['user-login']}>
                                <div className={styles['login']}>
                                    <ThirdLogin doSSO={this.openAuth.bind(this)} />
                                </div>
                                {
                                    !thirdauth.config.hideLogin ?
                                        (
                                            <div className={styles['change-panel']}>
                                                <a onClick={() => { this.changePanel(PanelType.NORMAL_LOGIN) }}>
                                                    {
                                                        __('切换登录')
                                                    }
                                                </a>
                                            </div>
                                        ) :
                                        null
                                }
                            </div> :
                            null
                    }
                    {
                        invitationStatus !== InvitationStatus.OK && (
                            <MessageDialog onConfirm={this.confirmInvitation.bind(this)}>
                                {getErrorMessage(invitationStatus)}
                            </MessageDialog>
                        )
                    }
                    {
                        isJoined && (
                            <MessageDialog onConfirm={this.confirmJoined.bind(this)}>
                                {__('您已经是该文档的访问者，不能重复加入。')}
                            </MessageDialog>
                        )
                    }
                </div>
            </div>
        )
    }
}