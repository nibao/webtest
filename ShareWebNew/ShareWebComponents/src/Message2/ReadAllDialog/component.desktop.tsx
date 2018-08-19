import * as React from 'react';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import { MessageType } from '../../../core/message/message';

import __ from './locale';

/**
 * 渲染阅读所有确认弹窗
 * @export
 * @param {Components.Message2.ReadAllDialog.Props} { showMsgType, handleSubmitReadAll, handleHideReadAll } 
 * @returns 
 */
export default function ReadAllDialog({ showMsgType, handleSubmitReadAll, handleHideReadAll }: Components.Message2.ReadAllDialog.Props) {
    const readAllTip = {
        [MessageType.Share]: __('您确定要将共享消息全部标为已读吗？'),
        [MessageType.Check]: __('您确定要将审核消息全部标为已读吗？'),
        [MessageType.Security]: __('您确定要将安全消息全部标为已读吗？'),
    }
    return (
        <ConfirmDialog
            onConfirm={() => { handleSubmitReadAll() }}
            onCancel={() => { handleHideReadAll() }}
        >
            {readAllTip[showMsgType]}
        </ConfirmDialog>
    )
}