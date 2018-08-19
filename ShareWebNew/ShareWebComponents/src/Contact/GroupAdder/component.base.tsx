import * as React from 'react';
import WebComponent from '../../webcomponent';
import __ from './locale';
import { VerifyStatus } from '../helper';

export default class GroupAdderBase extends WebComponent<Components.Contact.GroupAdder.Props, Components.Contact.GroupAdder.State> {
    state = {
        value: '',
        verifyStatus: VerifyStatus.Legal
    }

    /**
     * 输入框变更
     */
    protected onGroupAddChange(value) {
        this.setState({
            value
        })
    }

    /**
     * 点击确定按钮，验证输入是否合法
     */
    protected onGroupAddConfirm() {
        let { value } = this.state;
        let pattern = /^[^\/\\:*?"<>|]{1,128}$/;
        if (!pattern.test(value)) {
            this.setState({
                verifyStatus: VerifyStatus.Illegal
            })
            return;
        }
        this.props.onGroupAddConfirm(value.trim())
    }
}