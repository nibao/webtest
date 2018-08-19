import * as React from 'react'
import * as classnames from 'classnames'
import { includes } from 'lodash'
import { MessageDialog, Dialog, CheckBox, ConfirmDialog } from '../../../ui/ui.mobile'
import { getErrorMessage } from '../../../core/errcode/errcode'
import { docname, isDir } from '../../../core/docs/docs'
import { calcGNSLevel } from '../../../core/entrydoc/entrydoc';
import { ErrorCode } from '../../../core/apis/openapi/errorcode'
import { DirLocked } from '../../../core/move/move'
import ExceptionsBase from './component.base'
import * as commonStyles from '../../styles.desktop.css'
import * as styles from './styles.mobile.css'
import __ from './locale'

// 中断整个移动操作的错误码数组
const InterruptErrorArray = [
    ErrorCode.MissingDestination,
    ErrorCode.PermissionMismath,
    ErrorCode.QuotaExhausted,
    ErrorCode.PathInvalid,
    ErrorCode.AccountFrozen,
    ErrorCode.DocumentFrozen
]

export default class Exceptions extends ExceptionsBase {
    /**
     * 根据错误码获取错误信息 
     */
    private getErrorMessage({ errcode, dest, doc, locker }) {
        const isdir = isDir(doc)
        const name = docname(doc)

        switch (errcode) {
            // 源文件不存在
            case ErrorCode.GNSInaccessible:
                return isdir ?
                    __('文件夹“${name}”不存在，可能其所在路径发生变更', { name })
                    :
                    __('文件“${name}”不存在，可能其所在路径发生变更', { name })


            // 对源文件没有复制与删除权限
            case ErrorCode.PermissionRestricted:
                return isdir ?
                    __('您对文件夹“${name}”没有复制与删除权限', { name })
                    :
                    __('您对文件“${name}”没有复制与删除权限', { name })

            // 目标文件夹不存在,中断整个移动
            case ErrorCode.MissingDestination:
                return __('您选择的目标文件夹不存在，可能其所在路径发生变更')

            // 目标文件夹没有新建权限,中断整个移动
            case ErrorCode.PermissionMismath:
                return __('您对选择的目标文件夹“${targetname}”没有新建权限', { targetname: docname(dest) })

            // 目标位置配额空间不足,中断整个移动
            case ErrorCode.QuotaExhausted:
                return __('您选择的目标位置配额空间不足')

            case ErrorCode.PathInvalid:
                if (doc.docid.indexOf(dest.docid) !== -1 && (calcGNSLevel(doc.docid) - calcGNSLevel(dest.docid) === 1)) {
                    // 目标位置和起始位置相同，中断整个移动
                    return __('您无法在同一个位置下移动文档')
                }

                // 移动到自身或其的子文件夹,中断整个操作
                return __('您选择的目标文件夹“${targetname}”是当前文件夹“${name}”自身或其子文件夹', { targetname: docname(dest), name })

            // 移动文件夹，对该文件夹下的有些文件密级不足，无法移动
            case ErrorCode.CSFLevelMismatch:
                return isdir ?
                    __('您对文件夹“${name}”下某些子文件的密级权限不足', { name })
                    :
                    __('您对文件“${name}”的密级权限不足', { name })

            // 禁止移动发送文件箱
            case ErrorCode.DeleteOutboxDisabled:
                return __('您没有对发送文件箱目录的操作权限')

            // 无法将文件/文件夹移动到水印文档库
            case ErrorCode.MoveToWatermarkLibraryDisabled:
                return __('您对水印目录下的文件“${name}”没有修改权限，无法将文件移动到水印目录范围外', { name })

            // 源文件被锁定，无法移动
            case ErrorCode.SourceDocLocked:
                return __('文件“${name}”已被${locker}锁定', { name, locker })

            // 用户被冻结，中断整个操作
            case ErrorCode.AccountFrozen:
                return __('您的账号已被冻结')

            // 文档被冻结,中断整个移动
            case ErrorCode.DocumentFrozen:
                return __('该文档已被冻结')

            default:
                return getErrorMessage(errcode)
        }
    }

    render() {
        const { events: [event], checked } = this.state

        if (event) {
            const { errcode, doc } = event as any

            // 文件夹下有被锁定的子文件，弹出警告窗口
            if (errcode === DirLocked) {
                return (
                    <ConfirmDialog
                        onConfirm={() => this.move(checked)}
                        onCancel={() => this.cancel(checked)}
                    >
                        <div>
                            {__('您确定要移动文件夹“${name}”吗？该文件夹下的某些子文件已被锁定，这些文件无法被移动，所在路径将保留。', { name: docname(doc) })}
                        </div>
                        <div onClick={this.toggleChecked.bind(this)}>
                            <CheckBox checked={checked} />
                            {__('为之后所有相同的冲突执行此操作')}
                        </div>
                    </ConfirmDialog>
                )
            }

            // 中断移动的错误码
            if (includes(InterruptErrorArray, errcode)) {
                return (
                    <MessageDialog onConfirm={this.break}>
                        <div className={commonStyles['warningHeader']}>{__('无法执行移动操作')}</div>
                        <div className={commonStyles['warningContent']}>
                            {this.getErrorMessage(event)}
                        </div>
                    </MessageDialog>
                )
            }

            // 非中断的错误码(我知道了，不再提示)
            return (
                <Dialog>
                    <Dialog.Main>
                        <div className={styles['main']}>
                            <div className={commonStyles['warningHeader']}>{__('无法执行移动操作')}</div>
                            <div className={commonStyles['warningContent']}>
                                {this.getErrorMessage(event)}
                            </div>
                        </div>
                    </Dialog.Main>
                    <Dialog.Footer>
                        <div className={classnames(styles['button-wrapper'], styles['left-btn'])}>
                            <Dialog.Button
                                onClick={this.cancel}
                            >
                                {__('我知道了')}
                            </Dialog.Button>
                        </div>
                        <div className={styles['button-wrapper']}>
                            <Dialog.Button
                                onClick={() => this.cancel(true)}
                            >
                                {__('不再提示')}
                            </Dialog.Button>
                        </div>
                    </Dialog.Footer>
                </Dialog>
            )
        }

        return null
    }
}