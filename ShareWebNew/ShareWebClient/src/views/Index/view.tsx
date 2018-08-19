import * as React from 'react';
import { login } from '../../../core/auth/auth';
import { OS_TYPE } from '../../../core/auth/auth';
import { getOEMConfByOptions } from '../../../core/oem/oem';
import Login from '../../../components/Index/component.desktop';
import ChangePassword from '../../../components/ChangePassword/component.desktop';
import ClientDownload from '../../../components/ClientsDownload/component.desktop';
import About from '../../../components/About/component.desktop';
import session from '../../../util/session/session';
import { clearRouteCache, updateLogin } from '../../helper';
import { hashHistory } from 'react-router';
import __ from './locale';
import * as styles from './styles.css';

export default class Index extends React.Component<any, any>{

    state = {
        changePassword: false,
        account: '',
        background: ''
    }

    static contextTypes = {
        toast: React.PropTypes.any
    }

    async componentWillMount() {
        this.setState({
            background: (await getOEMConfByOptions(['background.png']))['background.png']
        })

        const login = session.get('login')
        if (login) {
            this.handleLoginSuccess(login)
        }

    }

    async loginFromURL() {
        // todo 从地址栏的userid tokenid 登录
    }

    /**
     * 登录成功
     */
    handleLoginSuccess(login) {
        const { redirect, lastLogin } = this.props.location.query

        clearRouteCache()
        updateLogin(login)
        hashHistory.replace(redirect && (!lastLogin || lastLogin === login.userid) ? redirect : '/home')
    }

    /**
     * 打开修改密码弹窗
     */
    handleOpenChangePassword(account) {
        this.setState({
            changePassword: true,
            account: account
        })
    }

    /**
     * 修改密码成功
     */
    async handleChangePwdSuccess(password: string) {
        try {
            const userInfo = await login(this.state.account, password, OS_TYPE.WEB, { ismodify: true })
            this.context.toast(__('修改成功'))
            clearRouteCache()
            const { redirect } = this.props.location.query
            session.set('login', userInfo)
            hashHistory.replace(redirect ? redirect : '/home');

        } catch (ex) {
            session.set('kickedOut', ex.errcode);
            location.reload()
        }
    }

    /**
     * 取消修改密码
     */
    handleChangepPwdCancel() {
        this.setState({
            changePassword: false
        })
    }

    /**
     * 账户被锁定
     */
    userLocked() {
        this.setState({
            changePassword: false
        })
    }


    /**
     * 跳转第三方认证
     */
    openAuth(authServer) {
        window.location.assign(authServer);
    }

    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['wrapper']}>
                    <div className={styles['index']} style={{ 'background-image': `url('data:image/png;base64,${this.state.background}')` }}>
                        <Login onSuccess={this.handleLoginSuccess.bind(this)}
                            onPasswordChange={this.handleOpenChangePassword.bind(this)}
                            onThirdLogin={this.openAuth}
                        />

                        {
                            this.state.changePassword ?
                                <ChangePassword
                                    account={this.state.account}
                                    onChangePwdSuccess={this.handleChangePwdSuccess.bind(this)}
                                    onChangePwdCancel={this.handleChangepPwdCancel.bind(this)}
                                    onUserLocked={this.userLocked.bind(this)}
                                /> :
                                null
                        }
                        <div className={styles['client-download']}>
                            {
                                this.state.clients && this.state.clients.length ?
                                    <div className={styles['clients-wrap']}>
                                        <span className={styles['clients-line']}></span>
                                        <span className={styles['clients-tip']}>{__('下载客户端')}</span>
                                        <span className={styles['clients-line']}></span>
                                    </div> : null
                            }
                            <ClientDownload
                                onClientsReady={(list) => {
                                    this.setState({
                                        clients: list.filter(function (item) {
                                            return item[1] === true;
                                        })
                                    })
                                }}
                                onClientClick={(URL) => { location.assign(URL) }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className={styles['about']}>
                            <About
                                platform="desktop"
                            />
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}