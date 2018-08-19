import * as React from 'react';
import MessageDialog from '../../../ui/MessageDialog/ui.client';
import { ErrorCode } from '../../../core/apis/openapi/errorcode';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { ErrorStatus } from '../helper';
import __ from './locale';

/**
 * 错误信息
 * @param param0 status 错误状态
 * @param param0 template 外链模版
 * @param param0 detail 错误详细信息
 * @param param0 onConfirm 确认时执行
 */
export default function ErrorMessage({ error, template, detail, onConfirm }) {
    switch (error) {
        case ErrorCode.MailtoFormatInvalid:
        case ErrorCode.SMTPConfigMissing:
        case ErrorCode.SMTPUnknownError:
        case ErrorCode.SMTPInaccessible:
            return (
                <MessageDialog onConfirm={ onConfirm.bind(null, error) }>
                    <p>{ __('发送失败') }</p>
                    <p>{ getErrorMessage(error) }</p>
                </MessageDialog>
            )

        case ErrorCode.PermissionExceeded:
            return (
                <MessageDialog onConfirm={ onConfirm.bind(null, error) }>
                    <p>{ __('管理员已限制您可设定的访问权限为“${allowPerms}”。', { allowPerms: detail.allowPerms }) }</p>
                </MessageDialog>
            )

        case ErrorCode.ExpireDaysExceeded:
            return (
                <MessageDialog onConfirm={ onConfirm.bind(null, error) }>
                    <p>{ __('管理员已设置您限制的有效期，不允许超过${expireDays}天。', { expireDays: template.maxExpireDays }) }</p>
                </MessageDialog>
            )

        case ErrorCode.LimitationExceeded:
            return (
                <MessageDialog onConfirm={ onConfirm.bind(null, error) }>
                    <p>{ __('管理员已设置您限制的打开次数，不允许超过${limitTimes}次。', { limitTimes: template.maxLimitTimes }) }</p>
                </MessageDialog>
            )

        case ErrorCode.LinkPasswordMissing:
            return (
                <MessageDialog onConfirm={ onConfirm.bind(null, error) }>
                    <p>{ __('管理员已设置您必须使用访问密码。') }</p>
                </MessageDialog>
            )

        case ErrorStatus.AccessTimesMissing:
            return (
                <MessageDialog onConfirm={ onConfirm.bind(null, error) }>
                    <p>{ __('管理员已设置您必须限制打开次数。') }</p>
                </MessageDialog>
            )

        case ErrorStatus.PermInvalid:
            return (
                <MessageDialog onConfirm={ onConfirm.bind(null, error) }>
                    <p>{ __('您没有可配置的文件权限，请联系管理员。') }</p>
                </MessageDialog>
            )

        default:
            return (
                <MessageDialog onConfirm={ onConfirm.bind(null, error) }>
                    <p>{ getErrorMessage(error) }</p>
                </MessageDialog>
            )
    }
}