import * as React from 'react';
import cookie from 'react-cookie';
import { hashHistory } from 'react-router'
import { assign } from 'lodash';
import session from '../../../util/session/session';
import MessageDialog from '../../../ui/MessageDialog/ui.desktop';
import { setup as setupOpenApi } from '../../../core/openapi/openapi'
import { join } from '../../../core/apis/eachttp/invitation/invitation';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { getConfig } from '../../../core/config/config';
import SSO from '../../../components/SSO/component.desktop';
import __ from './locale';

/**
 * 状态
 */
export enum InvitationStatus {
    // 无异常
    OK
}

export default class SSOView extends React.Component<any, any> {

    state = {
        params: null,

        invitationStatus: InvitationStatus.OK,

        /**
         * 是否已加入过共享邀请
         */
        isJoined: false
    }

    loadUrl: string = ''  // 存储加入共享邀请的路径

    async componentWillMount() {

        const { config: { cookieParams = [], redirect } } = await getConfig('thirdauth')
        const { postmessage, ...arg } = this.props.location.query

        if (postmessage) {
            session.set('postmessage', postmessage);
        }

        let params = assign(
            {},
            arg,
            cookieParams.reduce((value, cookieParam) => {
                let cookieParamValue = cookie.load(cookieParam);

                if (cookieParamValue) {
                    return assign({}, value, { [cookieParam]: cookieParamValue })
                } else {
                    return value
                }
            }, {}));

        this.setState({
            params
        })
    }

    /**
     * 跳转到AnyShare主界面
     */
    private async redirect(login: any) {

        const { redirect, invitation: invitationid } = this.props.location.query;
        const postmessage = session.take('postmessage');
        if (postmessage) {
            if (/MSIE\s8/.test(navigator.userAgent) || /MSIE\s9/.test(navigator.userAgent)) {
                window.name = JSON.stringify(login)
            } else {
                window.opener.postMessage([0, login], location.protocol + '//' + location.host); // 0 表示认证成功
            }
        } else {
            session.set('login', login);
            setupOpenApi({
                userid: login.userid,
                tokenid: login.tokenid
            })

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

    }

    /**
     * 确定加入共享邀请错误弹窗
     */
    private confirmInvitation() {
        this.setState({
            invitationStatus: InvitationStatus.OK
        })
        this.props.history.replace({ pathname: `/home` });
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


    render() {
        const { invitationStatus, isJoined, params } = this.state

        return (
            params ?
                <div>
                    <SSO
                        params={params}
                        onAuthSuccess={this.redirect.bind(this)}
                    />
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
                :
                <div></div>
        )
    }
}