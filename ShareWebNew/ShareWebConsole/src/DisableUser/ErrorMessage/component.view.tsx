/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { noop } from 'lodash'
import { getErrorTemplate, getErrorMessage } from '../../../core/exception/exception';
import MessageDialog from '../../../ui/MessageDialog/ui.desktop';
import { Status } from '../helper';
import __ from './locale';

/**
 * 显示错误弹窗
 * @param onConfrim  // 确定事件
 * @param Message // 提示信息 
 */
export default function ErrorMessage({ errorType, onConfirm = noop }: Console.DisableUser.ErrorMessage.Props) {

    switch (errorType) {
        case Status.CURRENT_USER_INCLUDED:
            return (
                <MessageDialog onConfirm={ onConfirm }>
                    {__('您无法禁用自身账号。')}
                </MessageDialog>
            );
        default:
            return (    
                <MessageDialog onConfirm={onConfirm}>
                    {getErrorMessage(errorType)}
                </MessageDialog>
            )

    }
}