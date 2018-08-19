import * as React from 'react'
import * as classnames from 'classnames'
import { includes } from 'lodash'
import { MessageDialog, ConfirmDialog, Dialog } from '../../../ui/ui.mobile'
import { getErrorMessage } from '../../../core/errcode/errcode'
import { docname, isDir } from '../../../core/docs/docs'
import { ErrorCode } from '../../../core/apis/openapi/errorcode'
import ExceptionsBase from './component.base'
import * as commonStyles from '../../styles.desktop.css'
import * as styles from './styles.mobile.css'
import __ from './locale'

/**
 * 中断复制的错误码数组
 */
const InterruptErrorArray = [
    ErrorCode.MissingDestination,
    ErrorCode.PermissionMismath,
    ErrorCode.QuotaExhausted,
    ErrorCode.CopyToSelfDisabled,
    ErrorCode.AccountFrozen,
    ErrorCode.DocumentFrozen
]

export default class Exceptions extends ExceptionsBase {
    /**
     * 根据错误码获取错误信息 
     */
    private getErrorMessage({ errcode, dest, doc }) {
        const isdir = isDir(doc)
        const name = docname(doc)

        switch (errcode) {
            // 源文件夹不存在
            case ErrorCode.GNSInaccessible:
                return isdir
                    ? __('文件夹“${name}”不存在，可能其所在路径发生变更', { name })
                    : __('文件“${name}”不存在，可能其所在路径发生变更', { name })

            // 对源文件没有复制权限
            case ErrorCode.PermissionRestricted:
                return isdir
                    ? __('您对文件夹“${name}”没有复制权限', { name })
                    : __('您对文件“${name}”没有复制权限', { name })

            // 目标文件夹不存在，中断整个复制
            case ErrorCode.MissingDestination:
                return __('您选择的目标文件夹不存在，可能其所在路径发生变更')

            // 目标文件夹没有新建权限，中断整个复制
            case ErrorCode.PermissionMismath:
                return __('您对选择的目标文件夹“${name}”没有新建权限', { name: docname(dest) })

            // 目标位置配额空间不足,中断整个复制
            case ErrorCode.QuotaExhausted:
                return __('您选择的目标位置配额空间不足')

            // 用户被冻结，中断整个复制
            case ErrorCode.AccountFrozen:
                return __('您的账号已被冻结')

            // 文档被冻结，中断整个复制
            case ErrorCode.DocumentFrozen:
                return __('该文档已被冻结')

            // 复制到自身或其的子文件夹,中断整个操作
            case ErrorCode.CopyToSelfDisabled:
                return __('您选择的目标文件夹“${targetname}”是当前文件夹“${name}”自身或其子文件夹', { targetname: docname(dest), name })

            // 复制文件夹，对该文件夹下的有些文件密级不足，无法复制
            case ErrorCode.CSFLevelMismatch:
                return isdir
                    ? __('您对文件夹“${name}”下某些子文件的密级权限不足', { name })
                    : __('您对文件“${name}”的密级权限不足', { name })

            // 无法将文件复制到水印文档库
            case ErrorCode.CopyToWatermarkLibraryDisabled:
                return __('您对水印目录下的文件“${name}”没有修改权限，无法将水印文件复制到水印目录范围外', { name })

            default:
                return getErrorMessage(errcode)
        }
    }

    render() {
        const { events: [event] } = this.state

        if (event) {
            const { errcode } = event as any

            // 中断复制的错误码
            if (includes(InterruptErrorArray, errcode)) {
                return (
                    <MessageDialog onConfirm={this.break}>
                        <div className={commonStyles['warningHeader']}>{__('无法执行复制操作')}</div>
                        <div className={commonStyles['warningContent']}>
                            {this.getErrorMessage(event)}
                        </div>
                    </MessageDialog>
                )
            }

            // 非中断的错误码
            return (
                <Dialog>
                    <Dialog.Main>
                        <div className={styles['main']}>
                            <div className={commonStyles['warningHeader']}>{__('无法执行复制操作')}</div>
                            <div className={commonStyles['warningContent']}>
                                {this.getErrorMessage(event)}
                            </div>
                        </div>
                    </Dialog.Main>
                    <Dialog.Footer>
                        <div className={classnames(styles['button-wrapper'], styles['left-btn'])}>
                            <Dialog.Button
                                onClick={() => this.confirm()}
                            >
                                {__('我知道了')}
                            </Dialog.Button>
                        </div>
                        <div className={styles['button-wrapper']}>
                            <Dialog.Button
                                onClick={() => this.confirm(true)}
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