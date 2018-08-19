import * as React from 'react'
import { login } from '../../../core/auth/auth';
import session from '../../../util/session/session'
import { OS_TYPE } from '../../../core/auth/auth';
import LinkDocs from '../../../components/LinkDocs/component.desktop'
import Upload from '../../../components/Upload/component.desktop'
import ChangePassword from '../../../components/ChangePassword/component.desktop'
import { reset } from '../../../core/upload/upload'
import { docname, isDir } from '../../../core/docs/docs'
import { setOEMtitle } from '../../../core/oem/oem'
import { setTitle } from '../../../util/browser/browser'
import { openDoc, getLinkFromQuery, clearRouteCache } from '../../helper'
import { hashHistory } from 'react-router'
import __ from './locale';
import * as styles from './styles.css'

export default class LinkView extends React.Component<any, any> {

    state = {
        linkDoc: {},
        changePassword: false,
        account: ''
    }

    componentWillUnmount() {
        /** 退出link路由时重置上传 */
        reset()
    }

    static contextTypes = {
        toast: React.PropTypes.any
    }

    /**
     * 登录成功(外链转存涉及到登录)
     */
    handleLoginSuccess() {
        const { pathname, search } = this.props.location

        hashHistory.replace(`${pathname}${search}`)
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

    handleChangePwd(success) {
        return async (password) => {
            try {
                const userInfo = await login(this.state.account, password, OS_TYPE.WEB, { ismodify: true })
                this.context.toast(__('修改成功'))
                session.set('login', userInfo)
                this.setState({
                    changePassword: false
                })
                success(userInfo)
            } catch (ex) {
                session.set('kickedOut', ex.errcode);
                location.reload()
            }
        }
    }

    render() {
        const linkDoc = getLinkFromQuery(this.props.location)

        return (
            <div className={styles['container']}>
                <LinkDocs
                    linkDoc={linkDoc}
                    onPathChange={openDoc}
                    onLoginSuccess={this.handleLoginSuccess.bind(this)}
                    onRedirectDest={(docid) => openDoc({ docid })}
                    onLoad={doc => {
                        if (doc === null || isDir(doc)) {
                            setOEMtitle()
                        } else {
                            setTitle(docname(doc))
                        }
                    }
                    }
                    onRequestChangePassword={(account, success) => {
                        this.handleOpenChangePassword(account)
                        this.handleChangePwdSuccess = this.handleChangePwd(success)
                    }
                    }
                />
                <Upload swf={'/libs/webuploader/dist/Uploader.swf'} />
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
            </div>
        )
    }
}