import * as React from 'react';
import { noop } from 'lodash';
import WebComponent from '../webcomponent';
import { listen, unlisten } from '../../util/message/message';
import { getOEMConfByOptions } from '../../core/oem/oem';
import { getAuth } from '../../core/auth/auth';
import { Messages } from '../../core/messages';

export enum PanelType {
    NORMAL_LOGIN, // 正常键入密码登录

    THIRD_LOGIN, // 第三方登录

    /**
     * 准备状态
     */
    PENNDING
}

interface State {
    // oem登录图片
    titleIcon: string;
    // 是否存在第三方
    thirdAuth: any;

}

interface Props {
    onAuthSuccess: (res) => any,
    onAuthClose: () => any,
    onPasswordChange: () => any
}

export default class OAuthBase extends WebComponent<any, any> {
    static defaultProps = {
        onAuthSuccess: noop,
        onAuthClose: noop
    }

    state = {
        slogan: '',
        thirdAuth: null,
        panel: PanelType.PENNDING
    }

    async componentDidMount() {
        const [thirdAuth, slogan] = await Promise.all([getAuth(), getOEMConfByOptions(['slogan'])])
        if (thirdAuth && thirdAuth.config.autoCasRedirect) {
            this.thirdLogin()
        } else {
            this.setState({
                thirdAuth: thirdAuth,
                slogan: slogan.slogan,
                panel: thirdAuth && !thirdAuth.config.hideThirdLogin ? PanelType.THIRD_LOGIN : PanelType.NORMAL_LOGIN
            })
        }
    }

    /**
     * 改变登录的方式
     * @param value 登录的方式 
     */
    changePanel(value) {
        this.setState({
            panel: value
        })
    }


    /**
     * 获取用户信息
     * @param userInfo 
     */
    getUserInfo(userInfo) {
        this.props.onAuthSuccess(userInfo);
    }
    /**
     * 第三方认证
     */
    thirdLogin() {
        // 打开子窗口
        let newWindow = window.open('/sso?postmessage=true', '', 'width=800,height=600,toolbar=0,titlebar=0,menubar=0,left=600px,top=200px,location=no,personalbar=0,resizable=no,status=no,alwaysRaised=no,alwaysLowered=no');
        if (/MSIE\s8/.test(navigator.userAgent) || /MSIE\s9/.test(navigator.userAgent)) {
            let data = {}
            let intervalId = setInterval(() => {
                try {
                    data = JSON.parse(newWindow.name)
                    if (data.userid) {
                        clearInterval(intervalId)
                        this.props.onAuthSuccess(data);
                        newWindow.close();
                    }
                } catch (e) {

                }
            }, 100)
        } else {
            // 监听子窗口
            listen(Messages.AUTH_SUCCESS, (data) => {

                this.props.onAuthSuccess(data);
                unlisten(Messages.AUTH_SUCCESS);
                newWindow.close();
            });
        }

        let closeWindow = setInterval(() => {
            if (newWindow.closed) {
                clearInterval(closeWindow);
            }
        }, 1000);
    }
}