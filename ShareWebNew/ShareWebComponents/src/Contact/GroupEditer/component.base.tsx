import * as React from 'react';
import WebComponent from '../../webcomponent';
import { VerifyStatus } from '../helper';

export default class GroupEditerBase extends WebComponent<Components.Contact.GroupEditer.Props, Components.Contact.GroupEditer.State> {
    state = {
        value: '',
        verifyStatus: VerifyStatus.Legal
    }

    /**
     * 输入框变更
     */
    protected onGroupEditChange(value) {
        this.setState({
            value
        })
    }

    /**
     * 点击确定按钮，验证输入是否合法
     */
    protected onGroupEditConfirm() {
        let { value } = this.state;
        let pattern = /^[^\/\\:*?"<>|]{1,128}$/;
        if (!pattern.test(value)) {
            this.setState({
                verifyStatus: VerifyStatus.Illegal
            })
            return;
        }
        this.props.onGroupEditConfirm(value.trim())
    }
}