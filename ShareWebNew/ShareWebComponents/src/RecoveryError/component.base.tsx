import * as React from 'react';
import WebComponent from '../webcomponent';

export default class RecoveryErrorBase extends WebComponent<Components.RecoveryError.Props, Components.RecoveryError.State> {

    componentDidMount() {
        // 黄色错误提示框延迟5秒后消失
        setTimeout(() => {
            this.props.onClose();
        }, 5000);
    }
}