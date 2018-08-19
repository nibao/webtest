import * as React from 'react'
import { login } from '../../../core/auth/auth';
import { get as getUser } from '../../../core/apis/eachttp/user/user';
import { OS_TYPE } from '../../../core/auth/auth';
import { setup as setupOpenApi } from '../../../core/openapi/openapi'
import ChangePassword from '../../../components/ChangePassword/component.desktop';
import HeadBar from '../../../components/HeadBar/component.desktop'
import session from '../../../util/session/session'
import { updateLogin, getHomeNav, getLinkFromQuery, clearRouteCache, clearLogin } from '../../helper'
import { hashHistory } from 'react-router'
import __ from './locale';


export default class HeadView extends React.Component<any, any> {

    state = {
        changePassword: false,
        account: '',
        nav: []
    }

    componentWillMount() {
        this.updateNav(this.props.location)
    }

    componentWillReceiveProps({ location }) {
        this.updateNav(location)
    }

    static contextTypes = {
        toast: React.PropTypes.any
    }


    /**
     * 导航菜单
     * @param location 
     */
    async updateNav(location) {
        this.setState({
            nav: location && /^\/home/.test(location.pathname) ? await getHomeNav() : []
        })
    }


    /**
     * 打开修改密码弹窗
     */
    async handleOpenChangePassword(url: string) {
        if (url) {
            hashHistory.replace(url)
        } else {
            const login = { ...session.get('login'), ... (await getUser()) }
            updateLogin(login)
            this.setState({
                changePassword: true,
                account: session.get('login').account
            })
        }
    }

    /**
     * 修改密码成功
     */
    async handleChangePwdSuccess(password: string) {
        try {
            const userInfo = await login(this.state.account, password, OS_TYPE.WEB, { ismodify: true })
            this.context.toast(__('修改成功'))
            updateLogin(userInfo)
            this.setState({
                changePassword: false
            })

        } catch (ex) {
            session.set('kickedOut', ex.errcode);
            hashHistory.replace('/');
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

    handleLogoutSuccess(url = '/') {
        const { link } = getLinkFromQuery(this.props.location)
        clearLogin()
        clearRouteCache()
        if (link) {
            session.set('login', null)
            setupOpenApi({
                userid: '',
                tokenid: ''
            })

            location.reload()
        } else {
            location.replace(url)
        }
    }

    /**
   * 账户被锁定
   */
    userLocked() {
        this.setState({
            changePassword: false
        }, () => {
            clearLogin()
            clearRouteCache()
            hashHistory.replace('/');
        })
    }

    /**
     * 进入网盘
     */
    private handleEnterDisk() {
        const { link } = getLinkFromQuery(this.props.location)
        clearRouteCache('/link', `/link/${link}`)

        hashHistory.push('/home')
    }

    render() {
        const { link } = getLinkFromQuery(this.props.location)

        return (
            <div>
                <HeadBar
                    nav={this.state.nav}
                    link={link}
                    doChangePassword={(url) => { this.handleOpenChangePassword(url) }}
                    onLogoutSuccess={this.handleLogoutSuccess.bind(this)}
                    doEnterDisk={this.handleEnterDisk.bind(this)}
                />
                {
                    this.state.changePassword ?
                        <ChangePassword
                            account={this.state.account}
                            onChangePwdSuccess={this.handleChangePwdSuccess.bind(this)}
                            onChangePwdCancel={this.handleChangepPwdCancel.bind(this)}
                            onUserLocked={this.userLocked.bind(this)}
                            pwdControl={session.get('login').pwdcontrol}
                        /> :
                        null
                }
            </div>
        )
    }
}