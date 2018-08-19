import * as React from 'react';
import { noop } from 'lodash';
import { list, del } from '../../../core/apis/efshttp/recycle/recycle';
import WebComponent from '../../webcomponent';
import __ from './locale';

interface Props {
    doc: Core.Docs.Doc;               // 清空的回收站路径
    onSingleSuccess(item: any): void; // 删除单个成功
    onSuccess: () => void;
    onCancel: (goToEntry?: boolean) => void;
}

interface State {
    recycleEmptyshow: boolean;     // 清空回收站提示是否显示
    docs: Array<any>;              // 要清空的文件
    progressDialogShow: boolean;   // 删除进度弹框是否显示
    errorCode: number;             // 错误码
    duration: number;                 // 请求得到的指定回收站清空时长
    durationSelection: number;        // 选中的指定回收站清空时长
    errorDoc: Core.Docs.Doc;           // 错误对象
}

export default class RecycleEmptyBase extends WebComponent<any, any> {
    state: State = {
        recycleEmptyshow: false,
        docs: [],
        progressDialogShow: false,
        errorCode: -1,
        duration: -1,
        durationSelection: -1,
        errorDoc: null,
    }

    static defaultProps: Props = {
        doc: null,
        onSingleSuccess: noop,
        onSuccess: noop,
        onCancel: noop,
    }

    progressDialogShowWindow: UI.NWWindow.NWWindow;

    componentWillMount() {
        this.setState({
            recycleEmptyshow: true
        })
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    /**
     * 更改回收站删除时长
     */
    protected handleSelectStrategyMenu(item) {
        this.setState({
            durationSelection: item
        })
    }

    /**
     * 清空回收站
     */
    emptyRecycle(doc: Core.Docs.Doc = this.props.doc) {
        let { durationSelection } = this.state;
        list({ docid: doc.docid, sort: 'desc', by: 'time' }).then(({ dirs, files, servertime }) => {

            let docs = [...dirs, ...files];
            if (docs.length === 0) {
                // 如果回收站内文件为空，则提示该回收站为空
                this.context.toast(__('该回收站已为空'));
                this.props.onSuccess()
                return;
            }
            // 如果是清除全部，则不进行时长判断，防止管理员修改服务器时间后出现BUG
            if (durationSelection !== -1) {
                docs = docs.filter(doc => { return (servertime - doc.modified) > durationSelection * 24 * 60 * 60 * 1000 * 1000 })
            }
            if (docs && docs.length) {
                this.setState({
                    progressDialogShow: true,
                    recycleEmptyshow: false,
                    docs
                })
            } else {
                // 如果可清理的回收站文件为空，则提示无可清理内容
                this.context.toast(__('无可清理内容'));
                this.props.onSuccess()
            }
        }, (error) => {
            this.setState({
                progressDialogShow: false,
                recycleEmptyshow: false,
                errorCode: error.errcode,
                errorDoc: doc
            });

        })
    }

    /**
     * 删除文件
     */
    loader(doc: any) {
        return del({ docid: doc.docid })
    }

    /**
     * 处理错误
     */
    handleError(err: any, data): void {
        this.setState({
            errorCode: err.errcode,
            progressDialogShow: false,
            errorDoc: data

        });

    }

    /**
     * 清空成功回调
     */
    protected handleEmptySuccess() {
        this.setState({
            progressDialogShow: false
        }, () => {
            this.context.toast(__('清理成功'), { code: '\uf063', size: 24, color: '#2aa879' });
            this.props.onSuccess()
        })

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