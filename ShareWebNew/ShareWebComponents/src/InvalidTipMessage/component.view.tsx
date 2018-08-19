import * as React from 'react';
import { getErrorMessage } from '../../core/errcode/errcode';
import { OpType } from '../../core/optype/optype';
import { docname, isDir } from '../../core/docs/docs';
import __ from './locale';


const InvalidTipMessageView: React.StatelessComponent<Components.InvalidTipMessagey.Props> = function InvalidTipMessageView({
    errorDoc,
    errorCode,
    onlyrecycle,
}) {

    return (
        <p>
            {
                errorCode === 404006 ?
                    (
                        onlyrecycle && isDir(errorDoc) ?
                            __('回收站目录“${name}”不存在, 可能其所在路径发生变更。', { name: docname(errorDoc) })
                            :
                            isDir(errorDoc) ?
                                __('文件夹“${name}”不存在, 可能其所在路径发生变更。', { name: docname(errorDoc) })
                                :
                                __('文件“${name}”不存在, 可能其所在路径发生变更。', { name: docname(errorDoc) })
                    )
                    :
                    getErrorMessage(errorCode, OpType.ALL)
            }
        </p>
    )
}



export default InvalidTipMessageView;
