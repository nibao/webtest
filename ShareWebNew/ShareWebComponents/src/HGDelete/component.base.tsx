import * as React from 'react';
import { noop } from 'lodash';
import * as fs from '../../core/filesystem/filesystem'
import { getLockInfo } from '../../core/apis/eachttp/autolock/autolock'
import { del as deleteFile } from '../../core/apis/efshttp/file/file';
import { del as deleteDir } from '../../core/apis/efshttp/dir/dir';
import { isDir } from '../../core/docs/docs';
import { ErrorCode } from '../../core/apis/openapi/errorcode';

export default class HGDeleteBase extends React.Component<Components.HGDelete.Props, Components.HGDelete.State> {

    static defaultProps = {
        docs: [],
        onSingleDeleteSuccess: noop,
        onDeleteSuccess: noop,
    }

    state = {
        showConfirm: false,
        processingDelete: false,
        errorCode: undefined,
        failedDoc: {},
    }

    resolve = noop

    componentDidMount() {
        if (this.props.docs && this.props.docs.length) {
            this.setState({
                showConfirm: true,
            })
        }
    }
    componentWillReceiveProps({ docs }) {
        this.setState({
            showConfirm: false,
        })
        if (docs && docs !== this.props.docs && docs.length) {
            this.setState({
                showConfirm: true,
            })
        }
    }

    /**
     * 删除选中的文件
     * @param docs 选中的文件
     */
    protected deleteFiles(docs: Core.Docs.Docs) {
        this.setState({
            showConfirm: false,
            processingDelete: true,
        }, async () => {
            await docs.reduce(async (prePromise, doc) => {
                return prePromise.then(() => {
                    return new Promise(async resolve => {
                        try {
                            if (isDir(doc)) {
                                await deleteDir({ docid: doc.docid })
                            } else {
                                await deleteFile({ docid: doc.docid })
                            }

                            fs.del(doc)

                            this.props.onSingleDeleteSuccess(doc)

                            resolve()

                        } catch (err) {

                            this.resolve = resolve

                            this.handleError(err, doc)
                        }
                    })
                })

            }, Promise.resolve())

            this.setState({
                processingDelete: false,
            }, () => {
                this.props.onDeleteSuccess()
            })
        })
    }


    /**
     * 处理错误（发生错误时，关闭加载窗口）
     */
    protected async handleError(err: any, doc: any) {
        if (err.errcode === ErrorCode.GNSInaccessible) {
            // 当文件不存在时，不弹出错误提示
            fs.del(doc)
            this.props.onSingleDeleteSuccess(doc)
            this.resolve()
        } else if (err.errcode === ErrorCode.FileLocked) {
            // 文件被锁定，查询锁定信息

            const { lockername } = await getLockInfo({ docid: doc.docid })

            this.setState({
                errorCode: err.errcode,
                processingDelete: false,
                failedDoc: { ...doc, lockername }
            });

        } else {
            this.setState({
                errorCode: err.errcode,
                processingDelete: false,
                failedDoc: doc
            });
        }
    }

    /**
     * 点击遮罩层或者取消按钮时触发
     */
    protected cancelDelete(): void {
        this.setState({
            showConfirm: false,
            processingDelete: false
        });
    }
}