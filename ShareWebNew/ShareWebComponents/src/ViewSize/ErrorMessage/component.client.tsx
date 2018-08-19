import * as React from 'react';
import { noop } from 'lodash';
import MessageDialog from '../../../ui/MessageDialog/ui.client';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { OpType } from '../../../core/optype/optype';
import { docname } from '../../../core/docs/docs';
import __ from './locale';

export default function ErrorMessage({ onConfirm = noop, errorCode, errorDoc, onlyrecycle }) {
    return (
        <MessageDialog
            onConfirm={() => onConfirm(errorDoc.size === -1 && !errorDoc.isdir)}
        >
            <p>
                {
                    errorCode === 404006 ?
                        onlyrecycle ?
                            errorDoc.size === -1 && !errorDoc.isdir ?
                                __('回收站目录“${name}”不存在。', { name: docname(errorDoc) })
                                :
                                errorDoc.size === -1 && errorDoc.isdir ?
                                    __('文件夹“${name}”不存在。', { name: docname(errorDoc) })
                                    :
                                    __('文件“${name}”不存在。', { name: docname(errorDoc) })
                            :
                            __('当前数据已过期，请刷新后重试')
                        :
                        getErrorMessage(errorCode, OpType.ALL)
                }
            </p>
        </MessageDialog>
    )
}