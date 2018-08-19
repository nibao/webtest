import * as React from 'react'
import { trim, noop } from 'lodash';
import session from '../../util/session/session'
import { getOEMConfByOptions } from '../../core/oem/oem';
import { getConfig } from '../../core/config/config'
import { setLanguage } from '../../core/language/language';
import { getConfig as get, getExtAppInfo } from '../../core/apis/eachttp/auth1/auth1'
import { MessageType, getMessages, subscribe } from '../../core/message/message'
import { subscribe as subscribeApproval, ReviewType, getApprovalsCountsByType } from '../../core/audit/audit'
export default class HeadBar extends React.Component<any, any>{

    static defaultProps = {
        nav: [],
        doEnterDisk: noop,
        link: ''
    }

    state = {
        logo: '',
        superChart: false,
        errcode: null,
        msgNum: 0,
        auditNum: 0,
        userAgreementConfig: false,
        helper: '',
        FAQ: ''
    }

    async componentWillMount() {
        this.getLogo();
        /**
         * 在线表格
         */
        let deviceInfo = await getConfig('device_info')

        /**
         * 获取OEM协议配置
         */
        let { userAgreement, helper, FAQ } = await getOEMConfByOptions(['userAgreement', 'helper', 'FAQ'])

        this.setState({
            superChart: deviceInfo['auth_excel'],
            msgNum: getMessages(MessageType.All, false).length,
            auditNum: getApprovalsCountsByType(ReviewType.ShareApvUnreview),
            userAgreementConfig: userAgreement,
            helper,
            FAQ
        })

        subscribe(() => {
            this.setState({
                msgNum: getMessages(MessageType.All, false).length
            })
        })

        subscribeApproval(async () => {
            this.setState({
                auditNum: getApprovalsCountsByType(ReviewType.ShareApvUnreview)
            })
        })
    }

    async getLogo() {
        this.setState({
            logo: (await getOEMConfByOptions(['logo.png']))['logo.png']
        })
    }

    /**
     * 注销成功后跳转页面
     */
    logoutSuccess(url = '/') {
        if (typeof this.props.onLogoutSuccess === 'function') {
            this.props.onLogoutSuccess(url)
        }
    }

    /**
     * 管理控制台
     * @param 控制台地址 
     */
    openConsole(url) {
        window.open(url);
    }

    /**
     * 打开客户端
     */
    openClient(host) {
        location.assign(`AnyShare://?tpc&${trim(host, `${location.protocol}//`)}&9999&9124&${session.get('login')['userid']}&${session.get('login')['tokenid']}`);
    }

    /**
     * 切换语言
     */
    async handleSetLanguage(lang) {
        await setLanguage(lang);
        location.reload();
    }

    /**
     * 跳转在线表格
     */
    async handleSuperChart() {
        try {
            const { url } = (await getExtAppInfo({
                apptype: 1,
                params: {
                    userid: session.get('login')['userid'],
                    grant_type: 'client_credentials',
                    scope: 'api_weblogin',

                }
            })).value;
            window.open(url);
        } catch (e) {
            this.setState({
                errcode: e.errcode
            })
        }
    }

    /**
     * 关闭错误弹窗
     */
    handleErrorConfirm() {
        this.setState({
            errcode: null
        })
    }

    /**
     * 打开用户协议/帮助页面
     * @param 新开标签页地址
     */
    openAgreement(url) {
        window.open(url);
    }
}