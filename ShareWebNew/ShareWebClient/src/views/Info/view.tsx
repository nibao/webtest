import * as React from 'react'
import { hashHistory } from 'react-router'
import { login } from '../../../core/auth/auth';
import { get as getUser } from '../../../core/apis/eachttp/user/user';
import { OS_TYPE } from '../../../core/auth/auth';
import ChangePassword from '../../../components/ChangePassword/component.desktop';
import PersonalInformation from '../../../components/PersonalInformation/component.desktop';
import session from '../../../util/session/session'
import { updateLogin, clearRouteCache, clearLogin } from '../../helper'
import __ from './locale';

export default class Index extends React.Component<any, any>{

    state = {
        changePassword: false,
        account: ''
    }

    static contextTypes = {
        toast: React.PropTypes.any
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
        }, () => {
            clearLogin()
            clearRouteCache()
            hashHistory.replace('/');
        })
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

    render() {
        return (
            <div style={{ height: '100%' }}>
                <PersonalInformation
                    doChangePassword={(url) => { this.handleOpenChangePassword(url) }}
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