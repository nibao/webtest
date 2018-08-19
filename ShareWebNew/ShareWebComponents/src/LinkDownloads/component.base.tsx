/// <reference path="./component.base.d.ts" />

import * as React from 'react';
import { noop } from 'lodash';
import { opFiles, opStatistics } from '../../core/apis/efshttp/link/link'
import WebComponent from '../webcomponent';
import { ReqStatus } from './helper'

export default class LinkDownloadBase extends WebComponent<LinkDownloads.LinkDownloads.Props, any> implements Components.LinkDownloads.Base {

    static defaultProps = {
        onConfirmError: noop,
        onCloseDialog: noop,
    }

    state = {
        files: [],
        statistics: [],
        reqStatus: ReqStatus.OK,
        activeFile: null
    }

    async componentWillMount() {
        try {
            const { files } = await opFiles({
                docid: this.props.doc.docid,
                start: 0,
                limit: 200
            })
            if (files.length) {
                // 为files添加isdir字段，用于在显示缩略图是不被判断为文件夹
                this.setState({
                    files: files.map((file) => {
                        return { ...file, isdir: false }
                    })
                });
            } else {
                this.setState({
                    reqStatus: ReqStatus.NO_FILE_VISITED
                })
            }
        } catch (e) {
            this.setState({
                reqStatus: e.errcode
            })
        }

    }

    /**
     * 默认选择首行文件
     */
    handleDefaultSelection(nextData) {
        if (nextData.length) {
            this.setState({
                activeFile: nextData[0].docid
            });
        }
    }

    /**
     * 文件列表翻页
     * @param page 页数
     * @param limit 每页条数
     */
    async handleFilesPageChange(page, limit) {
        const { files } = await opFiles({
            docid: this.props.doc.docid,
            start: page * limit,
            limit: 200
        })
        this.setState({
            files: files.map((file) => {
                return { ...file, isdir: false }
            })
        })
    }

    /**
     * 访问详情列表翻页
     * @param page 页数
     * @param limit 每页条数
     */
    async handleStatisticsPageChange(page, limit) {
        const { statistics } = await opStatistics({
            link_docid: this.props.doc.docid,
            file_docid: this.state.activeFile,
            start: page * limit,
            limit: 200
        })
        this.setState({
            statistics: statistics
        })
    }

    /**
     * 查看某文件的访问详情
     * @param file 文件参数
     */
    async handleSelectFile(file) {
        if (file) {
            const { statistics } = await opStatistics({
                link_docid: this.props.doc.docid,
                file_docid: file.docid,
                start: 0,
                limit: 200
            })
            this.setState({
                statistics,
                activeFile: file.docid

            })
        }
    }
}