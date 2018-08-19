import * as React from 'react'
import ExceptionsBase from './component.base'
import MessageDialog from '../../../ui/MessageDialog/ui.desktop'
import SimpleDialog from '../../../ui/SimpleDialog/ui.desktop'
import RadioBoxOption from '../../../ui/RadioBoxOption/ui.desktop'
import { isDir, docname } from '../../../core/docs/docs'
import { ErrorCode } from '../../../core/apis/openapi/errorcode'
import { getErrorMessage } from '../../../core/errcode/errcode'
import { OnDup } from '../../../core/rename/rename'
import __ from './locale'
import * as commonStyles from '../../styles.desktop.css'

export default class Exceptions extends ExceptionsBase {

    /**
     * 根据错误码获取错误信息
     * @param param0 
     */
    getErrorMessage({ errcode, target, nativeEvent, newName }) {
        switch (errcode) {
            case ErrorCode.AccountFrozen:
                return __('您的帐号已被冻结')
            case ErrorCode.DocumentFrozen:
                return __('该文档已被冻结')
            case ErrorCode.FileLocked:
                return __('文件“${name}”已被“${locker}”锁定', { name: docname(target), locker: nativeEvent.detail.locker })
            case ErrorCode.FileTypeRestricted:
                return __('文件“${name}”的格式已被管理员禁用', { name: newName })
            case ErrorCode.PermissionRestricted:
                return isDir(target) ?
                    __('您对文件夹“${name}”没有修改权限', { name: docname(target) }) :
                    __('您对文件“${name}”没有修改权限', { name: docname(target) })
            case ErrorCode.GNSInaccessible:
                return isDir(target) ?
                    __('文件夹“${name}”不存在，可能其所在路径发生变更', { name: docname(target) }) :
                    __('文件“${name}”不存在，可能其所在路径发生变更', { name: docname(target) })
            case ErrorCode.CSFLevelMismatch:
                return __('您对文件“${name}”的密级权限不足', { name: docname(target) })
            case ErrorCode.NameInvalid:
                return isDir(target) ?
                    __('文件夹名称不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符') :
                    __('文件名称不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符')
            default:
                return getErrorMessage(errcode)
        }
    }

    render() {
        const { events: [event], ondup } = this.state
        if (event) {
            const { errcode, target, suggestName } = event as any
            switch (errcode) {
                case ErrorCode.FullnameDuplicated:
                case ErrorCode.NameDuplicatedReadonly:
                case ErrorCode.DiffTypeNameDuplicated:
                    return (
                        <SimpleDialog onConfirm={this.confirm}>
                            <div className={commonStyles['warningHeader']}>{__('在云端已存在同名文档')}</div>
                            <form>
                                <div className={commonStyles['warningContent']}>
                                    {
                                        isDir(target) ?
                                            __('您可以将当前文件夹“${name}”做如下处理：', { name: docname(target) }) :
                                            __('您可以将当前文件“${name}”做如下处理：', { name: docname(target) })
                                    }
                                </div>
                                <div>
                                    <RadioBoxOption
                                        value={OnDup.Check}
                                        checked={ondup === OnDup.Check}
                                        onChange={this.toggleOnDup}
                                    >
                                        {
                                            isDir(target) ?
                                                __('同时保留两个文档，当前文件夹重命名为“${suggestName}”', { suggestName }) :
                                                __('同时保留两个文档，当前文件重命名为“${suggestName}”', { suggestName })
                                        }
                                    </RadioBoxOption>
                                </div>
                                <div>
                                    <RadioBoxOption
                                        value={OnDup.Skip}
                                        checked={ondup === OnDup.Skip}
                                        onChange={this.toggleOnDup}
                                    >
                                        {
                                            isDir(event.target) ?
                                                __('取消本次重命名操作，当前文件恢复原名') :
                                                __('取消本次重命名操作，当前文件恢复原名')
                                        }
                                    </RadioBoxOption>
                                </div>
                            </form>
                        </SimpleDialog>
                    )
                default:
                    return (
                        <MessageDialog onConfirm={this.confirm}>
                            <div className={commonStyles['warningHeader']}>{__('无法执行重命名操作')}</div>
                            <div className={commonStyles['warningContent']}>
                                {this.getErrorMessage(event)}
                            </div>
                        </MessageDialog>
                    )
            }
        }
        return null
    }
}