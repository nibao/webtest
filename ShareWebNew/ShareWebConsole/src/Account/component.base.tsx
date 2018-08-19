import * as React from 'react';
import cookie from 'react-cookie';
import '../../gen-js/EACPLog_types';
import { loginLog } from '../../core/log2/log2';
import { post } from '../../util/http/http';
import session from '../../util/session/session';
import { evaluate } from '../../util/accessor/accessor';
import WebComponent from '../webcomponent';
import __ from './locale';

export default class AccountBase extends WebComponent<Components.Account.Props, any> {
    static defaultProps = {
    }

    /**
     * 设置邮箱
     */
    protected setSmtp() {
        this.props.onClickEmailConfig();
    }

    /**
     * 退出登录
     */
    protected async logout() {
        try {
            await post('/interface/logout/', {},  { headers: { 'X-CSRFToken': evaluate(cookie.load('csrftoken')) } })
            await loginLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTLoginType['NCT_CLT_LOGIN_OUT'],
                msg: __('退出 系统管理控制台 成功'),
                exMsg: ''
            })
        } catch (ex) {

        } finally {
            session.remove('userid');
            session.has('username') && session.remove('username');
            session.has('displayname') && session.remove('displayname');
            session.remove('userInfo');
            location.replace('/');
        }
    }

    /**
     * 查看帮助
     */
    protected help() {


    }
}