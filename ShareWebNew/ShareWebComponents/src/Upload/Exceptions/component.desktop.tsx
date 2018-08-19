import * as React from 'react'
import ExceptionsBase from './component.base'
import { ErrorCode, OnDup, EventType } from '../../../core/upload/upload'
import MessageDialog from '../../../ui/MessageDialog/ui.desktop'
import SimpleDialog from '../../../ui/SimpleDialog/ui.desktop'
import CheckBoxOption from '../../../ui/CheckBoxOption/ui.desktop'
import RadioBoxOption from '../../../ui/RadioBoxOption/ui.desktop'
import { docname, isDir } from '../../../core/docs/docs'
import { formatSize } from '../../../util/formatters/formatters'
import { getErrorMessage } from '../../../core/errcode/errcode'
import __ from './locale'
import * as commonStyles from '../../styles.desktop.css'

export default class Exceptions extends ExceptionsBase {
    render() {
        const { type, event, ondup, setDefault } = this.state
        if (event) {
            const { target, errcode, suggestName } = event as any
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
                        <SimpleDialog onConfirm={this.confirmDup} onClose={this.closeDup}>
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
                            {
                                suggestName && typeof suggestName === 'string' ?
                                    <div>
                                        <RadioBoxOption
                                            value={OnDup.Rename}
                                            checked={ondup === OnDup.Rename}
                                            onChange={this.toggleOnDup}
                                        >
                                            {
                                                isDir(target) ?
                                                    __('同时保留两个文档，当前文件夹重命名为“${suggestName}”', { suggestName }) :
                                                    __('同时保留两个文档，当前文件重命名为“${suggestName}”', { suggestName })
                                            }
                                        </RadioBoxOption>
                                    </div> :
                                    null
                            }
                            {
                                errcode === ErrorCode.SameTypeDup ?
                                    <div>
                                        <RadioBoxOption
                                            value={OnDup.Cover}
                                            checked={ondup === OnDup.Cover}
                                            onChange={this.toggleOnDup}
                                        >
                                            {
                                                isDir(target) ?
                                                    __('使用当前文件夹合并已存在的同名文件夹') :
                                                    __('上传并替换，使用当前文件覆盖同名文件')
                                            }
                                        </RadioBoxOption>
                                    </div> : null
                            }
                            <div>
                                <RadioBoxOption
                                    value={OnDup.Skip}
                                    checked={ondup === OnDup.Skip}
                                    onChange={this.toggleOnDup}
                                >
                                    {
                                        isDir(target) ?
                                            __('取消当前文件夹的上传') :
                                            __('取消当前文件的上传')
                                    }
                                </RadioBoxOption>
                            </div>
                            <div className={commonStyles['warningFooter']}>
                                <CheckBoxOption checked={setDefault} onChange={this.toggleSetDefault}>
                                    {__('为之后所有的相同冲突执行此操作')}
                                </CheckBoxOption>
                            </div>
                        </SimpleDialog>
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
                            {
                                <div className={commonStyles['warningFooter']}>
                                    <CheckBoxOption onChange={this.toggleSetDefault}>
                                        {__('跳过之后所有的相同冲突提示')}
                                    </CheckBoxOption>
                                </div>
                            }
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