import * as React from 'react';
import { noop, findIndex } from 'lodash';
import { restore, getSuggestName } from '../../../core/apis/efshttp/recycle/recycle';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { ErrorCode } from '../../../core/apis/openapi/errorcode';
import WebComponent from '../../webcomponent';
import __ from './locale';

function formatter(errorCode, data, docs) {
    if (docs.length === 1) {
        if (errorCode === 404006 && data.size === -1) {
            return __('文件夹不存在')
        } else if (errorCode === 404006 && data.size !== -1) {
            return __('文件不存在')
        }
    } else {
        if (errorCode === 404006) {
            return __('文件或文件夹不存在')
        }
    }
    return getErrorMessage(errorCode);

}
export default class RecycleRestoreBase extends WebComponent<Components.Recycle.RecycleRestore.Props, Components.Recycle.RecycleRestore.State> {

    state = {
        recycleRestoreDocs: this.props.docs,
        recycleRestoreRename: false,
        progressDialogShow: false,
        errorCode: -1,
        renameDoc: {},
        suggestName: '',
        skipRenameError: false,
        skipAllRenameError: false,
        showRestoreConfirm: true

    }

    static defaultProps = {
        docs: null,
        onSingleSuccess: noop,
        onSuccess: noop,
        onCancel: noop,
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    progressDialogShowWindow: UI.NWWindow.NWWindow;


    /**
     * 确认还原
     */
    onConfirmRestore() {
        this.setState({
            showRestoreConfirm: false
        }, () => {
            this.restoreFiles();
        })

    }

    /**
     * 开始还原选中的文件
     */
    restoreFiles(docs: Core.Docs.Docs = this.props.docs) {
        if (docs && docs.length) {
            this.setState({
                recycleRestoreDocs: docs,
                progressDialogShow: true,
                recycleRestoreRename: false
            })
        } else {
            this.props.onSuccess();
        }
    }

    /**
     * 还原文件
     */
    loader(doc: any) {
        if (this.state.skipAllRenameError) {
            return restore({ docid: doc.docid, ondup: 2 });
        } else {
            let ifSkip = this.state.skipRenameError;
            this.setState({
                skipRenameError: false
            });
            return restore({ docid: doc.docid, ondup: ifSkip ? 2 : 1 });

        }

    }

    /**
     * 处理错误
     */
    protected async handleError(err, item) {
        // 如果是重名错误，触发获取建议名称请求
        let suggestName = err.errcode === ErrorCode.FullnameDuplicated ? await getSuggestName(item) : null;
        this.setState({
            errorCode: err.errcode === ErrorCode.FullnameDuplicated ? -1 : err.errcode,
            recycleRestoreRename: err.errcode === ErrorCode.FullnameDuplicated,
            renameDoc: item,
            progressDialogShow: false,
            suggestName
        });
    }

    /**
     * 点击确认重命名
     */
    protected onConfirmRename() {
        // 将剩下需要还原的文档在此进行还原
        this.setState({
            skipRenameError: true
        })
        this.restoreFiles(this.state.recycleRestoreDocs);
    }

    /**
     * 单个文件还原成功
     */
    protected onSingleSuccess(item) {

        // 还原后从当前state中删除
        let newRestoreDocs = [...this.state.recycleRestoreDocs];
        let deleteKeyIndex = findIndex(newRestoreDocs, (doc) => {
            return doc['docid'] === item['docid']
        })
        newRestoreDocs.splice(deleteKeyIndex, 1);
        this.setState({
            recycleRestoreDocs: newRestoreDocs
        }, () => {
            this.props.onSingleSuccess(item);
        });

    }

    /**
     * 勾选跳过重名警告
     */
    protected handleCheckSkip() {
        this.setState({
            skipAllRenameError: true
        })
    }

    /**
    * 取消勾选跳过重名警告
    */
    protected handleUnCheckSkip() {
        this.setState({
            skipAllRenameError: false
        })
    }

    /**
     * 全部还原成功
     */
    protected handleRestoreSuccess() {
        this.context.toast(__('还原成功'), { code: '\uf063', size: 24, color: '#2aa879' });
        this.props.onSuccess();
    }

    /**
     * 关闭进度条窗口
     */
    protected handleCloseProgressDialog() {
        this.setState({
            progressDialogShow: false
        })
    }
}