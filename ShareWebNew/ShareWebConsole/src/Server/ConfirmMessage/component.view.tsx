import * as React from 'react';
import { noop } from 'lodash';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import { Operation } from '../helper';
import __ from './locale';

/**
 * 显示确认弹窗
 */
const ConfirmMessage: React.StatelessComponent<Components.Server.ConfirmMessage.Props> = function ConfirmMessage({
    opState,
    onMessageCancel = noop,
    onMessageConfirm = noop
}) {
    switch (opState) {
        case Operation.CloseLVSAppBalancing:
        case Operation.CloseLVSStorageBalancing:
            return (
                <ConfirmDialog
                    onConfirm={onMessageConfirm}
                    onCancel={onMessageCancel}
                >
                    {__('此操作可能降低系统性能，您确定要执行此操作吗？')}
                </ConfirmDialog>
            )
        case Operation.RestartNode:
            return (
                <ConfirmDialog
                    onConfirm={onMessageConfirm}
                    onCancel={onMessageCancel}
                >
                    {__('您确定要重启该节点吗？')}
                </ConfirmDialog>
            )
        case Operation.RestartService:
            return (
                <ConfirmDialog
                    onConfirm={onMessageConfirm}
                    onCancel={onMessageCancel}
                >
                    {__('您确定要重启该节点的后台服务吗？')}
                </ConfirmDialog>
            )
        case Operation.DeleteNode:
            return (
                <ConfirmDialog
                    onConfirm={onMessageConfirm}
                    onCancel={onMessageCancel}
                >
                    {__('您确定要移除该节点吗？')}
                </ConfirmDialog>
            )
        default:
            return <noscript />
    }

}

export default ConfirmMessage
