/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { noop } from 'lodash'
import { getErrorTemplate, getErrorMessage } from '../../../core/exception/exception';
import MessageDialog from '../../../ui/MessageDialog/ui.desktop';
import ErrorDialog from '../../../ui/ErrorDialog/ui.desktop';
import { Status } from '../helper';
import __ from './locale';

/**
 * 显示错误弹窗
 * @param onConfrim  // 确定事件
 * @param Message // 提示信息 
 */
export default function ErrorMessage({ errorType, errorUser, onConfirm = noop }: Console.EnableUser.ErrorMessage.Props) {

    switch (errorType) {
        case Status.CURRENT_USER_INCLUDED:
            return (
                <MessageDialog onConfirm={onConfirm}>
                    {__('您无法启用自身账号。')}
                </MessageDialog>
            );
        case 20518:
            return (
                <ErrorDialog onConfirm={onConfirm}>
                    {__('启用账号 ${displayName} 失败。错误信息：归属站点 ${siteName} 的启用用户数已达用户授权总数上限。', { displayName: errorUser.user.displayName, siteName: errorUser.user.siteInfo ? errorUser.user.siteInfo.name : '---' })}
                </ErrorDialog>
            )
        default:
            return (
                <MessageDialog onConfirm={onConfirm}>
                    {getErrorMessage(errorType)}
                </MessageDialog>
            )

    }
}