import * as React from 'react';
import { noop } from 'lodash';
import MessageDialog from '../../../ui/MessageDialog/ui.client';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { OpType } from '../../../core/optype/optype';
import __ from './locale';

export default function ErrorMessage({ onConfirm = noop, name, errorCode }) {
    return (
        <MessageDialog
            onConfirm={onConfirm}
        >
            <p>
                {
                    errorCode === 403002 ?
                        __('您对当前文件没有修改权限。')
                        :
                        errorCode === 403031 ?
                            __('同名的文件“${name}”已被其他用户锁定。', { name })
                            :
                            errorCode === 403070 ?
                                __('文件“${name}”过大，无法同步，您所在的网络存在限制。', { name })
                                :
                                errorCode === 404006 ?
                                    __('当前文件不存在，可能其所在路径发生变更')
                                    :
                                    getErrorMessage(errorCode, name, OpType.ALL)

                }
            </p>
        </MessageDialog>
    )
}