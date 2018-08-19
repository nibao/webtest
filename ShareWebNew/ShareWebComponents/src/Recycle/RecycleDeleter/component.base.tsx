import * as React from 'react';
import { noop } from 'lodash';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { del } from '../../../core/apis/efshttp/recycle/recycle';
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


interface Props {
    docs: Core.Docs.Docs;    // 需要删除的文档
    onSingleSuccess(item: any): void; // 删除单个成功
    onSuccess: () => void;
    onCancel: () => void;
}

interface State {
    recycleDeleteShow: boolean;  // 是否显示删除文件提示
    progressDialogShow: boolean; // 是否显示删除进度弹框
    errorCode: number;           // 错误码
    errorDoc: Core.Docs.Doc;     // 错误对象
}

export default class RecycleDeleterBase extends WebComponent<any, any> {
    state: State = {
        recycleDeleteShow: false,
        progressDialogShow: false,
        errorCode: -1,
        errorDoc: null
    }

    static defaultProps: Props = {
        docs: null,
        onSingleSuccess: noop,
        onSuccess: noop,
        onCancel: noop,
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    progressDialogShowWindow: UI.NWWindow.NWWindow;

    componentWillMount() {
        this.setState({
            recycleDeleteShow: true
        })
    }

    /**
     * 删除选中的文件
     * @param docs 选中的文件
     */
    deleteFiles(docs: Core.Docs.Docs = this.props.docs) {
        if (docs && docs.length) {
            this.setState({
                progressDialogShow: true,
                recycleDeleteShow: false
            })
        } else {
            this.props.onSuccess()
        }
    }

    /**
     * 删除文件
     * @param doc 要删除的文件
     */
    loader(doc: any) {
        return del({ docid: doc.docid });
    }

    /**
     * 处理错误
     */
    handleError(err: any, data): void {

        this.setState({
            errorCode: err.errcode,
            errorDoc: data,
            progressDialogShow: false
        });

    }

    /**
     * 全部删除成功回调
     */
    protected handleDeleteSuccess() {
        this.context.toast(__('删除成功'), { code: '\uf063', size: 24, color: '#2aa879' });
        this.props.onSuccess()
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