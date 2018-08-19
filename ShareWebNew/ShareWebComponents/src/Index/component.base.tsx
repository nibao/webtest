import * as React from 'react';
import { noop } from 'lodash';
import WebComponent from '../webcomponent';
import { getConfig } from '../../core/config/config';
import session from '../../util/session/session'
import { getAuth } from '../../core/auth/auth';
import { getOEMConfByOptions } from '../../core/oem/oem';

export enum PanelType {
    PENDDING = -1,  // 默认不显示任何登陆面板

    NORMAL_LOGIN, // 正常键入密码登录

    THIRD_LOGIN, // 第三方登录

    ACCESSCODE // 提取码
}

export default class IndexBase extends WebComponent<any, any> {
    static defaultProps = {
        onSuccess: noop, // 登录成功

        onPasswordChange: noop, // 跳转修改密码

        onThirdLogin: noop, // 第三方跳转

        /**
         * 当前显示表单
         */
        view: ''
    }

    state = {
        panel: PanelType.PENDDING, // 登录方式选择

        linkAccessCode: false, // 是否开启文件功能,

        thirdAuth: null, // 是否开启第三方登录

        slogan: '' // oem文字
    }

    async componentWillMount() {
        const [linkAccessCode, thirdAuth, slogan] = await Promise.all([getConfig('enable_link_access_code'), getAuth(), getOEMConfByOptions(['slogan'])])
        if (linkAccessCode && this.props.view === 'accesscode') {
            this.setState({
                linkAccessCode: linkAccessCode,
                thirdAuth: thirdAuth,
                slogan: slogan.slogan,
                panel: PanelType.ACCESSCODE
            })
        } else {
            this.setState({
                linkAccessCode: linkAccessCode,
                thirdAuth: thirdAuth,
                slogan: slogan.slogan,
                panel: thirdAuth && !thirdAuth.config.hideThirdLogin ? PanelType.THIRD_LOGIN : PanelType.NORMAL_LOGIN,
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

    openLink(fullLink) {
        session.remove('password');
        session.remove('link');
        window.open(fullLink);
    }


}