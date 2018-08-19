import * as React from 'react'
import ExceptionsBase from './component.base'
import { ErrorCode, EventType } from '../../../core/upload/upload'
import Dialog from '../../../ui/Dialog/ui.mobile'
import LinkButton from '../../../ui/LinkButton/ui.mobile'
import MessageDialog from '../../../ui/MessageDialog/ui.mobile'
import { docname, isDir } from '../../../core/docs/docs'
import { formatSize } from '../../../util/formatters/formatters'
import { getErrorMessage } from '../../../core/errcode/errcode'
import __ from './locale'
import * as commonStyles from '../../styles.mobile.css'
import * as styles from './styles.mobile.css'

export default class Exceptions extends ExceptionsBase {
    render() {
        const { type, event } = this.state
        if (event) {
            const { target, errcode, suggestName, uploadWithSuggestName, cover, skip } = event as any
            switch (type) {
                case EventType.UPLOAD_RUNTIME_ERROR:
                    return (
                        <MessageDialog onConfirm={this.close}>
                            <h1>
                                {__('您的浏览器未安装Flash插件，将无法使用上传功能。')}
                            </h1>
                        </MessageDialog>
                    )
                case EventType.UPLOAD_DUP:
                    return (
                        <Dialog>
                            <Dialog.Main>
                                <div className={commonStyles['warningHeader']}>
                                    {__('目标位置已存在同名文档')}
                                </div>
                                <div className={commonStyles['warningContent']}>
                                    {
                                        isDir(target) ?
                                            __('您可以将当前文件夹“${name}”做如下处理：', { name: docname(target) }) :
                                            __('您可以将当前文件“${name}”做如下处理：', { name: docname(target) })
                                    }
                                </div>
                            </Dialog.Main>
                            <Dialog.Footer>
                                {
                                    suggestName && typeof suggestName === 'string' ?
                                        <div className={styles['ondup-option']}>
                                            <LinkButton
                                                onClick={() => {
                                                    uploadWithSuggestName()
                                                    this.close()
                                                }}
                                            >
                                                {__('保留两者')}
                                            </LinkButton>
                                        </div> :
                                        null
                                }
                                {
                                    errcode === ErrorCode.SameTypeDup ?
                                        <div className={styles['ondup-option']}>
                                            <LinkButton
                                                onClick={() => {
                                                    cover()
                                                    this.close()
                                                }}>
                                                {__('替换')}
                                            </LinkButton>
                                        </div> :
                                        null
                                }
                                <div className={styles['ondup-option']}>
                                    <LinkButton
                                        onClick={() => {
                                            skip()
                                            this.close()
                                        }}
                                    >
                                        {__('取消')}
                                    </LinkButton>
                                </div>
                            </Dialog.Footer>
                        </Dialog>
                    )
                case EventType.UPLOAD_ERROR:
                    return (
                        <MessageDialog onConfirm={this.confirmError}>
                            <div className={commonStyles['warningHeader']}>
                                {
                                    errcode === ErrorCode.FileLocked ?
                                        __('无法执行覆盖操作') :
                                        __('无法执行上传操作')
                                }
                            </div>
                            <div className={commonStyles['warningContent']}>
                                {this.getErrorMessage(event)}
                            </div>
                        </MessageDialog>
                    )
                default: return null
            }
        }
        return null
    }

    getErrorMessage(event) {
        const { errcode, target, dest, locker, fileSizeLimit } = event
        switch (errcode) {
            case ErrorCode.FileNotExist:
                return __('您选择的目标文件夹不存在，可能其所在路径发生变更。')
            case ErrorCode.NoCreatePermission:
                return isDir(target) ?
                    __('您对选择的目标文件夹“${name}”没有新建权限。', { name: docname(dest) }) :
                    __('您对选择的目标文件夹“${name}”没有上传权限。', { name: docname(dest) })
            case ErrorCode.NoSpace:
                return __('您选择的目标位置配额空间不足。')
            case ErrorCode.ArchiveCover:
                return __('您无法修改归档库的文件。')
            case ErrorCode.NoStorage:
                return __('物理磁盘剩余空间不足，请联系管理员。')
            case ErrorCode.FileLocked:
                return __('文件“${name}已被用户“${user}”锁定”。', { name: target.suggestName || docname(target), user: locker })
            case ErrorCode.LargeFileLimit:
                return __('文件 “${name}” 已大于${limit}文件大小的限制。', { name: docname(target), limit: formatSize(fileSizeLimit) })
            case ErrorCode.LinkNotExist:
                return __('外链地址不存在。')
            case ErrorCode.LowerCSFLevel:
                return __('您对同名文件“${name}”的密级权限不足。', { name: target.suggestName || docname(target) })
            case ErrorCode.ExceedSizeLimit:
                return __('文件“${name}”的大小超出 ${fileSizeLimit}, 无法上传。', { name: docname(target), fileSizeLimit: formatSize(fileSizeLimit) })
            case ErrorCode.IllegalName:
                return isDir(target) ?
                    __('文件夹名不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符。') :
                    __('文件名不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符。')
            case ErrorCode.UserFreezed:
                return __('您的账号已被冻结')
            case ErrorCode.DocFreezed:
                return __('该文档已被冻结')
            case ErrorCode.SiteRemoved:
                return __('目标站点已经离线。')
            case ErrorCode.FileTypeLimited:
                return __('文件 “${name}” 的格式已被禁止上传。', { name: docname(target) })
            default:
                return getErrorMessage(errcode)
        }
    }
}