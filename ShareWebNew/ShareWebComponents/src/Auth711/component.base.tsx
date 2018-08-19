import * as React from 'react';
import { noop } from 'lodash';
import WebComponent from '../webcomponent';
import { authByParams } from '../../core/auth/auth';
import { SetDevProvride, AuthLogin, ExportUserCert, SignData, authRandom } from '../../core/apis/plugin/711';

export default class Auth711Base extends WebComponent<Components.Auth711.Props, Components.Auth711.State> {

    static defaultProps = {
        onAuthSuccess: noop
    }

    state = {
        pin: '',
        hr: '',
        focusing: false
    }

    /**
     * 文本聚焦
     */
    protected setFocusStatus() {
        this.setState({
            focusing: true
        })
    }

    /**
     * 文本失去聚焦
     */
    protected setBlurStatus(): void {
        this.setState({
            focusing: false
        })
    }

    /**
     * 输入框
     */
    protected setPin(e) {
        this.setState({
            pin: e.target.value
        })
    }
    /**
     * 关闭错误弹窗
     */
    protected closeError() {
        this.setState({
            hr: undefined
        })
    }

    protected conformAuth() {
        // 检查是否有key
        let hr1 = SetDevProvride()
        let rand = authRandom(17)
        // 是否认证成功
        this.setState({
            hr: AuthLogin(this.state.pin)
        }, () => {
            authByParams({
                // 获取证书
                cert: ExportUserCert(),
                rand: rand,
                // 数字签名
                cipher: SignData(String(rand))
            }).then((info) => {
                this.props.onAuthSuccess(info);
            });
        })

    }
}
