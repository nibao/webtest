import * as React from 'react';
import { noop } from 'lodash';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { ErrorCode } from '../../../core/apis/openapi/errorcode'
import { OpType } from '../../../core/optype/optype';
import ExceptionMessage from '../../ExceptionMessage/component.desktop'
import __ from './locale';

/**
 * 根据错误码显示具体的错误信息
 * @param errorCode 错误码
 * @param name 文件名
 */
function formatterErrorMessage(errorCode: number, name: string, locker: string): string {
    switch (errorCode) {
        case ErrorCode.GNSInaccessible:
            return __('当前文件不存在，可能其所在路径发生变更。')

        case ErrorCode.PermissionRestricted:
            return __('您对当前文件没有修改权限。')

        case ErrorCode.FileLocked:
            return __('当前文件已被${locker}锁定。', { locker })

        case ErrorCode.QuotaExhausted:
            return __('当前位置配额空间不足。')

        default:
            return getErrorMessage(errorCode, name, OpType.ALL)
    }
}

const ErrorMessage: React.StatelessComponent<Components.RestoreRevision.ErrorMessage.Props> = function ({
    name = '',
    errorCode = 0,
    locker = '',
    onConfirm = noop
}) {
    return (
        <ExceptionMessage
            title={__('无法执行还原操作')}
            detail={formatterErrorMessage(errorCode, name, locker)}
            onMessageConfirm={onConfirm}
        />
    )
}

export default ErrorMessage