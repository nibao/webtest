import * as React from 'react';
import { getErrorMessage } from '../../core/errcode/errcode';
import Overlay from '../../ui/Overlay/ui.desktop';
import RecoveryErrorBase from './component.base';
import __ from './locale';

function formatter(errorCode): string {
    if (errorCode === 404006) {
        return __('请求的文件或目录不存在。')
    }
    return getErrorMessage(errorCode);
}

export default class RecoveryError extends RecoveryErrorBase {

    render() {
        return (
            <Overlay position="top center">{formatter(this.props.errorCode)}</Overlay>
        )

    }
}