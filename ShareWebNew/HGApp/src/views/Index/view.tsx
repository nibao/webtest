import * as React from 'react'
import Login from '../../../components/Login/component.mobile'
import Icon from '../../../ui/Icon/ui.mobile'
import session from '../../../util/session/session'
import { getFullInfo } from '../../../core/user/user'
import { extLogin } from '../../../core/auth/auth'
import { login } from '../../../core/apis/eachttp/auth2/auth2'
import DisableConfig from '../DisableConfig/view'
import * as md5 from 'js-md5'
import { hashHistory } from 'react-router'
import * as logo from './assets/logo.png';

export default class Index extends React.Component<any, any>{

    state = {
        showLoginForm: false,
        showDisabelDialog: false
    }

    componentWillMount() {
        // todo 有login 直接跳转home
        this.loginFromHGApp()
    }

    async loginFromHGApp() {
        if (typeof HGUser !== 'undefined') {
            try {
                const { appid = '', appKey = '' } = HGAppConfig || {}
                const { guid: account } = await new Promise((resolve, reject) => HGUser.getUserInfo(resolve, reject))
                const login = await extLogin({ account, appid, key: md5(`${appid}${appKey}${account}`) })
                this.handleLoginSuccess(login)
            } catch (e) {
                if (e.errcode === 401004) {
                    this.setState({
                        showDisabelDialog: true
                    })
                }
                this.setState({
                    showLoginForm: true
                })
            }
        } else {
            this.setState({
                showLoginForm: true
            })
        }
    }

    async loginFromURL() {
        // todo 从地址栏的userid tokenid 登录
    }

    handleLoginSuccess(login) {
        const { redirect } = this.props.location.query
        session.set('login', login)
        hashHistory.replace(redirect ? redirect : '/home')
    }

    render() {
        return (
            <div>
                <div style={{ width: '100vw', height: '100vh', textAlign: 'center', lineHeight: '100vh' }}>
                    <Icon
                        url={logo}
                        size={'auto'}
                    />
                </div >
                {
                    this.state.showDisabelDialog ? <DisableConfig onConfirm={this.onDisableConfigConfirm.bind(this)} onCancel={this.onDisableConfigCancel.bind(this)} /> : null
                }
            </div>
        )
    }

    onDisableConfigConfirm() {
        this.setState({
            showDisabelDialog: false
        })
        if (typeof HGApp !== 'undefined') {
            HGApp.close()
        }
    }

    onDisableConfigCancel() {
        this.setState({
            showDisabelDialog: false
        })
        if (typeof HGApp !== 'undefined') {
            HGApp.close()
        }
    }
}