import * as React from 'react'
import * as classnames from 'classnames'
import OWAPreviewBase from './component.base'
import MessageDialog from '../../ui/MessageDialog/ui.desktop'
import UIIcon from '../../ui/UIIcon/ui.desktop'
import { getErrorMessage } from '../../core/errcode/errcode'
import { docname } from '../../core/docs/docs'
import { findType } from '../../core/extension/extension'
import { ErrorCode } from '../../core/owas/owas'
import * as commonStyles from '../styles.desktop.css'
import __ from './locale'
import * as styles from './styles.desktop.css'
import * as restore from './assets/restore.png'

export default class OWAPreview extends OWAPreviewBase {

    /**
     * 错误信息显示
     * @param error 
     */
    getErrorMessage(error) {
        const { doc } = this.props
        switch (error.errcode) {
            case ErrorCode.Locked:
                return __('文件“${filename}”已被 ${username} 锁定', { filename: docname(doc), username: error.lockInfo.lockername })
            case ErrorCode.NoPermission:
                return __('您对文件“${filename}”没有修改权限', { filename: docname(doc) })
            case ErrorCode.NotSupport:
                return __('当前文件格式不支持在线编辑')
            default:
                return getErrorMessage(error.errcode)
        }
    }

    render() {
        const { doc, className, doSaveTo, doDownload, doRevisionRestore } = this.props
        const { canEdit, editing, error, resolveError } = this.state
        const fileType = findType(docname(doc))

        return (
            <div className={classnames(styles['container'], className)}>
                {
                    <div className={styles['header']}>
                        <div className={classnames(styles['tip'], styles[fileType], {
                            [styles['show']]: this.state.showTip
                        })}>
                            {__('Office Online 会自动保存更改（快捷键Ctrl + S）')}
                        </div>
                    </div>
                }
                <iframe className={styles['iframe']} ref={this.ref} />
                <div className={styles['menu']}>
                    {
                        canEdit ?
                            <div className={styles['button']}>
                                <UIIcon
                                    title={editing ? __('预览') : __('编辑')}
                                    code={editing ? '\uf01d' : '\uf01c'}
                                    color="#fff"
                                    size="36px"
                                    onClick={this.toggleEdit}
                                />
                            </div> :
                            null
                    }
                    {
                        !!doDownload && (
                            <div className={styles['button']}>
                                <UIIcon
                                    title={__('下载')}
                                    code={'\uf01b'}
                                    color="#fff"
                                    size="36px"
                                    onClick={this.download}
                                />
                            </div>
                        )
                    }
                    {
                        !!doSaveTo && (
                            <div title={__('转存到我的云盘')} className={styles['button']}>
                                <UIIcon
                                    code={'\uf0d1'}
                                    color="#fff"
                                    size="36px"
                                    onClick={this.saveTo.bind(this)}
                                />
                            </div>
                        )
                    }
                    {
                        !!doRevisionRestore && (
                            <div title={__('还原')} className={styles['button']}>
                                <UIIcon
                                    code={'\uf05a'}
                                    color="#fff"
                                    size="36px"
                                    className={styles['restore-icon']}
                                    fallback={restore}
                                    onClick={this.restoreRevision.bind(this)}
                                />
                            </div>
                        )
                    }
                </div>
                {
                    error ?
                        <MessageDialog onConfirm={resolveError}>
                            <div className={commonStyles['warningHeader']}>{__('无法执行修改操作')}</div>
                            <div className={commonStyles['warningContent']}>
                                {
                                    this.getErrorMessage(error)
                                }
                            </div>
                        </MessageDialog> :
                        null
                }
            </div>
        )
    }
}