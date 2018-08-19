import * as React from 'react';
import { noop, includes } from 'lodash';
import * as fs from '../../core/filesystem/filesystem'
import { getDirLockInfo, getLockInfo } from '../../core/apis/eachttp/autolock/autolock'
import { del as deleteFile } from '../../core/apis/efshttp/file/file';
import { del as deleteDir } from '../../core/apis/efshttp/dir/dir';
import { DirLockedStrategy } from '../../core/dirlocked/dirlocked'
import { isDir } from '../../core/docs/docs';
import WebComponent from '../webcomponent';

export default class DeleteBase extends WebComponent<Components.Delete.Props, any> {

    static defaultProps = {
        onSingleSuccess: noop,
        onStartDelete: noop,
        onSuccess: noop,
        onCancel: noop,
    }

    state: Components.Delete.State = {
        deleteShow: true,
        progressDialogShow: false
    }

    skipLockedDirConflictChecked: boolean = false   // 子文件被锁定的文件夹的警告窗口的复选框的勾选状态

    dirLockedStrategy: DirLockedStrategy = DirLockedStrategy.None   // 子文件被锁定的文件夹的策略

    lockedDirs: Core.Docs.Docs = []   // 子文件被锁定的文件夹, 删除后会保留路径，所以不需要刷新文件列表

    resolve = noop

    reject = noop


    /**
     * 删除选中的文件
     * @param docs 选中的文件
     */
    protected deleteFiles() {
        this.setState({
            progressDialogShow: true,
            deleteShow: false
        }, () => this.props.onStartDelete())
    }

    /**
     * 删除文件
     * @param doc 要删除的文件
     */
    protected async loader(doc: Core.Docs.Doc) {
        if (isDir(doc)) {
            // 在删除文件夹之前，需要检查文件夹的子文件有没有被锁定
            const { islocked } = await getDirLockInfo({ docid: doc.docid })

            if (islocked) {
                this.lockedDirs = [...this.lockedDirs, doc]

                switch (this.dirLockedStrategy) {
                    case DirLockedStrategy.None: {
                        // 查询
                        return new Promise((resolve, reject) => {
                            this.resolve = resolve
                            this.reject = reject

                            this.setState({
                                lockedDir: doc
                            })
                        })
                    }

                    case DirLockedStrategy.Cancel: {
                        // 取消删除
                        return null
                    }

                    case DirLockedStrategy.Continue: {
                        // 继续删除
                        return deleteDir({ docid: doc.docid })
                    }
                }
            } else {
                return deleteDir({ docid: doc.docid })
            }
        }

        return deleteFile({ docid: doc.docid })
    }

    /**
     * 处理错误
     */
    protected async handleError(err: any, doc: any): void {

        if (err.errcode === 403031) {
            // 文件被锁定，查询锁定信息
            const { lockername } = await getLockInfo({ docid: doc.docid })

            this.setState({
                errorCode: err.errcode,
                progressDialogShow: false,
                doc: { ...doc, lockername }
            });
        } else {
            this.setState({
                errorCode: err.errcode,
                progressDialogShow: false,
                doc
            });
        }
    }

    /**
     * 取消删除子文件被锁定的文件夹
     */
    protected cancelDeleteLockedDir() {
        this.setState({
            lockedDir: undefined
        })

        if (this.skipLockedDirConflictChecked) {
            this.dirLockedStrategy = DirLockedStrategy.Cancel
        }

        this.resolve()
    }

    /**
     * 继续删除子文件被锁定的文件夹
     */
    protected async continueDeleteLockedDir() {
        const { lockedDir } = this.state

        this.setState({
            lockedDir: undefined
        })

        if (this.skipLockedDirConflictChecked) {
            this.dirLockedStrategy = DirLockedStrategy.Continue
        }

        try {
            await deleteDir({ docid: lockedDir.docid })
            this.resolve()
        }
        catch (err) {
            this.reject(err)
        }
    }

    /**
     * 删除一个文件成功
     */
    deleteOneFileOrDir(doc: Core.Docs.Doc) {
        if (!includes(this.lockedDirs, doc)) {
            // 当doc不在lockedDirs，触发this.props.onSingleSuccess(doc)
            fs.del(doc)
            this.props.onSingleSuccess(doc)
        }
    }
}