import * as React from 'react';
import MessageDialog from '../../../ui/MessageDialog/ui.client';
import { ErrorCode } from '../../../core/apis/openapi/errorcode';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { isDir } from '../../../core/docs/docs';
import __ from './locale';

/**
 * 初始化错误
 * @param param.doc 文档对象
 * @param param.errcode 错误状态
 * @param param.onConfirm 确认时执行
 */
export default function InitError({ doc, errcode, onConfirm }) {
    return (
        <MessageDialog onConfirm={ onConfirm.bind(null, errcode) }>
            {
                getMessage({ doc, errcode })
            }
        </MessageDialog>
    )
}

/**
 * 获取错误信息
 * @param param.doc 文档对象
 * @param param.errcode 错误码
 */
function getMessage({ doc, errcode }) {
    switch (errcode) {
        case ErrorCode.PermissionRestricted:
            return isDir(doc) ?
                __('您不是该文件夹所有者，无法开启链接共享。') :
                __('您不是该文件所有者，无法开启链接共享。')
        case ErrorCode.GNSInaccessible:
            return __('文件或文件夹不存在, 可能其所在路径发生变更。')
        default:
            return getErrorMessage(errcode);
    }
}