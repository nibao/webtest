import * as React from 'react';
import { noop } from 'lodash';
import MessageDialog from '../../../ui/MessageDialog/ui.desktop';
import { AuthResults } from '../helper';
import __ from './locale';

/**
 * 显示错误弹窗
 */
const ErrorMessage: React.StatelessComponent<Components.LoginCluster.ErrorMessage.Props> = function ErrorMessage({
    errorType,
    onMessageConfirm = noop
}) {
    switch (errorType) {
        case AuthResults.PwdExpired:
            return (
                <MessageDialog onConfirm={onMessageConfirm}>
                    {__('您的密码已过期，请联系管理员。')}
                </MessageDialog>
            );

        default:
            return <noscript />;
    }
}

export default ErrorMessage
