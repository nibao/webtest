import * as React from 'react';
import WebComponent from '../webcomponent';
import { ShareType, ErrorType } from './FullTextSearch/helper';
import { checkPermItem, SharePermission } from '../../core/permission/permission';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import __ from './locale';

export default class FullSearchBase extends WebComponent<Components.FullSearch.Props, Components.FullSearch.State> {
    static defaultProps = {
        searchKeys: '',
        searchRange: { docid: '', root: true },
        searchTags: ''
    }

    state = {
        shareType: ShareType.NOOP,
        shareDoc: null,
        errorCode: ErrorType.NULL,
        errorDoc: null,
        previewDoc: null,
    }

    /**
     * 分享对象或者类型发生改变 
     */
    protected handleShareDocChange(type, doc) {
        this.setState({
            shareType: type,
            shareDoc: doc
        })
    }

    /**
     * 关闭分享对话框
     */
    protected handleCloseShareDialog() {
        this.setState({
            shareType: ShareType.NOOP,
            shareDoc: null,
        })
    }

    /**
     * 错误触发
     */
    protected handleError(errorCode, errorDoc) {
        this.setState({
            errorCode,
            errorDoc
        })
    }

    /**
     * 关闭错误提示框
     */
    protected handleCloseErrorDialog() {
        this.setState({
            errorCode: ErrorType.NULL,
            errorDoc: null
        })
    }

    /**
     * 点击前往文件目录
     */
    protected async handleOpenDir(doc) {
        try {
            await checkPermItem(doc.docid, SharePermission.DISPLAY, (getOpenAPIConfig('userid')))
            this.props.doDirOpen(doc);
        } catch (error) {
            error.errcode ?
                this.setState({
                    errorCode: error.errcode,
                    errorDoc: doc
                })
                :
                this.context.toast(__('AnyShare 客户端已离线'));
        }
    }

    /**
     * 点击预览文件
     */
    protected async handlePreviewFile(doc) {
        try {
            await checkPermItem(doc.docid, SharePermission.PREVIEW, (getOpenAPIConfig('userid')))
            this.props.doFilePreview(doc);
        } catch (error) {
            this.setState({
                errorCode: error.errcode,
                errorDoc: doc
            })
        }

    }

    /**
     * 点击打开文件
     */
    protected async handleOpenFile(doc) {
        try {
            let downloadPerm = await checkPermItem(doc.docid, SharePermission.DOWNLOAD, (getOpenAPIConfig('userid')))
            downloadPerm ?
                this.props.doFilePreview(doc)
                :
                this.setState({
                    previewDoc: doc
                })
        } catch (error) {
            error.errcode ?
                this.setState({
                    errorCode: error.errcode,
                    errorDoc: doc
                })
                :
                this.context.toast(__('AnyShare 客户端已离线'));
        }
    }

    /**
     * 关闭预览窗口
     */
    protected handleClosePreivewDialog() {
        this.setState({
            previewDoc: null
        })
    }



}