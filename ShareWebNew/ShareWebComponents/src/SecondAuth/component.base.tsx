import * as React from 'react';
import WebComponent from '../webcomponent';
import { getThirdAuth } from '../../core/config/config';
import { validateSecurityDevice } from '../../core/apis/eachttp/auth1/auth1';

export enum secondeAuthStatus {
}

interface Props {
    // 账号
    account: string;
    // 第三方id
    thirdPartId: string;

    // 二次登录成功
    onSuccess: () => any;

    // 取消口令验证
    onCancel: () => any;
}

interface State {
    // 口令
    secondauthKey: string;
    // 错误弹窗
    authError: boolean;
}

export default class SecondAuthBase extends WebComponent<any, any> {

    state = {
        secondauthKey: '',

        authError: false
    }

    /**
     * 获取口令
     * @param key 口令
     */
    getAuthKey(key) {
        this.setState({
            secondauthKey: key
        })
    }

    /**
     * 认证口令
     */
    saveSeacondAuth() {
        validateSecurityDevice({
            thirdpartyid: this.props.thirdPartId,
            params: {
                account: this.props.account,
                key: this.state.secondauthKey
            }
        }).then(res => {
            if (res.result) {
                this.props.onSuccess()
            } else {
                this.setState({
                    authError: true
                })
            }
        })
    }


    /**
     * 关闭错误弹窗
     */
    closeErrorDialog() {
        this.setState({
            authError: false
        })
    }

}