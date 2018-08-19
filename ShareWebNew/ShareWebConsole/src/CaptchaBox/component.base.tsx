import * as React from 'react';
import { noop } from 'lodash';
import { createVcodeInfo } from '../../core/thrift/sharemgnt/sharemgnt';
import WebComponent from '../webcomponent';

export default class CaptchaBoxBase extends WebComponent<Console.CaptchaBox.Props, Console.CaptchaBox.State> {

    static defaultProps = {
        uuid: '',
        onChange: noop
    }

    state = {
        captcha: '',
        codeCreateInfo: {
            vcode: '',
            uuid: ''
        }
    }

    async componentWillMount() {
        this.setState({
            codeCreateInfo: await createVcodeInfo([this.props.uuid])
        }, () => {
            this.props.onChange({ uuid: this.state.codeCreateInfo.uuid, vcode: '' })
        })
    }

    /**
     * 输入验码事件
     */
    protected handleChange(value: string) {
        this.setState({
            captcha: value
        })
        this.props.onChange({ uuid: this.state.codeCreateInfo.uuid, vcode: value })
    }

    /**
     * 换一张验证码
     */
    protected async changeNext() {
        this.setState({
            codeCreateInfo: await createVcodeInfo([this.state.codeCreateInfo.uuid])
        })
    }
}