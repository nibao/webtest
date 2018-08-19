import * as React from 'react';
import { isFunction } from 'lodash'
import { docname } from '../../core/docs/docs'
import * as fs from '../../core/filesystem/filesystem'
import { restoreRevision } from '../../core/apis/efshttp/file/file';
import { MessageDialog } from '../../ui/ui.desktop';
import ConfirmRestore from './ConfirmRestore/component.desktop';
import ErrorMessage from './ErrorMessage/component.desktop'
import RestoreRevisionsBase from './component.base';
import __ from './locale';

export default class RestoreRevisions extends RestoreRevisionsBase {
    // 文档的锁定者
    locker: string = ''

    static contextTypes = {
        toast: React.PropTypes.func
    }

    /**
     * 还原历史版本
     */
    private async restore() {
        try {
            const newDoc = await restoreRevision({ docid: this.props.doc.docid, rev: this.props.revision.rev });

            if (newDoc.name !== this.props.revision.name) {
                // 在还原的时候，遇到同名文件，且自动重命名了
                this.setState({
                    restoreNewName: newDoc.name
                })
                // 更新fs
                fs.update(this.props.doc, newDoc)
            } else {
                this.context.toast(__('还原成功'))
                // 更新fs
                fs.update(this.props.doc, newDoc)
                isFunction(this.props.onRevisionRestoreSuccess) && this.props.onRevisionRestoreSuccess(this.props.doc, this.props.revision);
            }
        } catch ({ errcode, detail }) {
            if (errcode === 403031 && detail && detail.locker) {
                this.locker = detail.locker
            }
            this.setState({
                errorCode: errcode
            })
        }
    }

    /**
     * 关闭错误提示窗口
     */
    private confirmError() {
        this.setState({
            errorCode: 0
        })
        isFunction(this.props.onRevisionRestoreCancel) && this.props.onRevisionRestoreCancel()
    }

    /**
     * 关闭‘还原操作已成功，但存在某些系统限制，该文件已被重命名为XXX（2）.XXX’提示窗口
     */
    private closeTipDialog() {
        this.setState({
            restoreNewName: ''
        })
        isFunction(this.props.onRevisionRestoreSuccess) && this.props.onRevisionRestoreSuccess(this.props.doc, this.props.revision);
    }

    render() {
        const { doc, revision, onRevisionRestoreCancel } = this.props
        const { errorCode, restoreNewName } = this.state

        return (
            <div>
                {
                    !errorCode && !restoreNewName && (
                        <ConfirmRestore
                            revision={revision}
                            onConfirm={this.restore.bind(this)}
                            onCancel={onRevisionRestoreCancel}
                        />
                    )
                }
                {
                    !!errorCode && (
                        <ErrorMessage
                            name={docname(doc)}
                            errorCode={errorCode}
                            locker={this.locker}
                            onConfirm={this.confirmError.bind(this)}
                        />
                    )
                }
                {
                    !!restoreNewName && (
                        <MessageDialog onConfirm={this.closeTipDialog.bind(this)}>
                            {__('还原操作已成功，但存在某些系统限制，该文件已被重命名为“${restoreNewName}”', { restoreNewName })}
                        </MessageDialog>
                    )
                }
            </div>
        )
    }
}