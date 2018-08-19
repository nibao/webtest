import * as React from 'react';
import '../../gen-js/EACPLog_types';
import { loginLog } from '../../core/log2/log2';
import { post } from '../../util/http/http';
import session from '../../util/session/session';
import { getOEMConfByOptions } from '../../core/oem/oem';
import { createShareMgntClient } from '../../core/thrift2/thrift2';
import { appStatusReady } from '../../core/cluster/cluster';
import WebComponent from '../webcomponent';
import __ from './locale';

export default class HeaderBarBase extends WebComponent<Components.HeaderBar.Props, Components.HeaderBar.State> {
    static defaultProps = {
    }

    state = {
        indexView: false,
        showEditSystemManager: false,
        logo: ''
    }

    componentWillMount() {
        this.getState(this.props.path);
        this.getLogo()
    }

    /**
     * 获取OEM配置项logo资源
     */
    private async getLogo() {
        this.setState({
            logo: (await getOEMConfByOptions(['logo.png']))['logo.png']
        })
    }

    /**
     * 获取当前路由
     */
    async getState(path) {
        this.setState({
            indexView: path === '/' ? true : false
        })
    }

    /**
     * 跳转至应用管理控制台
     */
    protected async redirectToApp() {
        const appIp = await appStatusReady();
        if (appIp !== '') {
            const hostName = await createShareMgntClient({ip: appIp}).GetHostName()
            const consoleHttps = await createShareMgntClient({ ip: appIp }).GetGlobalConsoleHttpsStatus()
            // 跳转到应用控制台之前先退出系统控制台
            await this.logout()
            location.assign(`${consoleHttps ? 'https:' : 'http:'}//${hostName}:8000`);
        }
    }

    /**
     * 退出登录
     */
    private async logout() {
        try {
            await post('/interface/logout/', {})
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
        }
    }

    /**
     * 设置管理员账号
     */
    protected async setSystemManager() {
        if (await appStatusReady() !== '') {
            this.setState({
                showEditSystemManager: true
            })
        }
    }

    /**
     * 取消设置管理员账号
     */
    protected cancelEditSystemManager() {
        this.setState({
            showEditSystemManager: false
        })
    }

    /**
     * 编辑管理员账号成功
     */
    protected async handleEditSuccess() {
        this.setState({
            showEditSystemManager: false
        })
        const appIp = await appStatusReady();
        if (appIp !== '') {
            const user = await createShareMgntClient({ ip: appIp }).Usrm_GetUserInfo(session.get('userid'))
            session.set('userid', user.id);
            session.set('username', user.user.loginName);
            session.set('displayname', user.user.displayName);
            session.set('userInfo', user);
        }
    }

    /**
     * 重定向到登录页
     */
    protected handleRedirect() {
        location.replace('/');
    }

    /**
     * 查看帮助
     */
    protected help() {

    }
}