import * as React from 'react';
import { noop } from 'lodash';
import { ErrorCode } from '../../../core/apis/openapi/errorcode';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { MessageDialog } from '../../../ui/ui.desktop';
import { lastDoc } from '../helper';
import __ from './locale';

const ReviewException: React.StatelessComponent<Components.ShareReview.ReviewException.Props> = function ReviewException({
    exceptionInfo,
    onReviewExceptionConfirm = noop
}) {
    return (
        <MessageDialog
            onConfirm={onReviewExceptionConfirm}
        >
            {
                // 文件/文件夹不存在
                exceptionInfo.errcode === ErrorCode.GNSInaccessible ?
                exceptionInfo.doc.isdir ?
                        __('文件夹“${filename}”不存在, 可能其所在路径发生变更。', { filename: exceptionInfo.doc.name || lastDoc(exceptionInfo.doc.docname) })
                        : __('文件“${filename}”不存在, 可能其所在路径发生变更。', { filename: exceptionInfo.doc.name || lastDoc(exceptionInfo.doc.docname) })
                    :
                    getErrorMessage(exceptionInfo.errcode)
            }
        </MessageDialog>
    )
}

export default ReviewException;