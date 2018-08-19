import * as React from 'react'
import ExceptionsBase from './component.base'
import MessageDialog from '../../../ui/MessageDialog/ui.mobile'
import { getErrorMessage, getErrorTemplate } from '../../../core/errcode/errcode'
import { OpType } from '../../../core/optype/optype'
import { ErrorCode } from '../../../core/download/download'
import { formatSize } from '../../../util/formatters/formatters'
import { docname } from '../../../core/docs/docs'
import session from '../../../util/session/session'
import * as commonStyles from '../../styles.desktop.css'
import __ from './locale'

export default class Exceptions extends ExceptionsBase {

    render() {
        const { error, close } = this.state
        if (!error) {
            return null
        }
        const { errcode, target, nativeEvent } = error as any
        switch (errcode) {
            case ErrorCode.FILE_NOT_EXISTED:
                return (
                    <MessageDialog onConfirm={close}>
                        <h1 className={commonStyles['warningHeader']}>
                            {__('无法执行下载操作')}
                        </h1>
                        <p className={commonStyles['warningContent']}>
                            {getErrorTemplate(ErrorCode.FILE_NOT_EXISTED)({ filename: docname(target) })}
                        </p>
                    </MessageDialog>
                )

            case ErrorCode.FILE_NO_PERMISSION:
                return (
                    <MessageDialog onConfirm={close}>
                        <h1 className={commonStyles['warningHeader']}>
                            {__('无法执行下载操作')}
                        </h1>
                        <p className={commonStyles['warningContent']}>
                            {getErrorMessage(ErrorCode.FILE_NO_PERMISSION, OpType.DOWNLOAD)}
                        </p>
                    </MessageDialog>
                )

            case ErrorCode.No_COPY_PERMISSION:
                return (
                    <MessageDialog onConfirm={close}>
                        <h1 className={commonStyles['warningHeader']}>
                            {__('无法执行下载操作')}
                        </h1>
                        <p className={commonStyles['warningContent']}>
                            {__('您对文件“${filename}”没有复制权限, 不允许将数据从云盘下载到本地磁盘。', { filename: docname(target) })}
                        </p>
                    </MessageDialog>
                )

            case ErrorCode.FILE_SIZE_LIMITED:
                return (
                    <MessageDialog onConfirm={close}>
                        <h1 className={commonStyles['warningHeader']}>
                            {__('无法执行下载操作')}
                        </h1>
                        <p className={commonStyles['warningContent']}>
                            {
                                __('文件 “${filename}” 已大于${fileSize}文件大小的限制。', {
                                    filename: docname(target),
                                    fileSize: formatSize(nativeEvent.detail.file_limit_size)
                                })
                            }
                        </p>
                    </MessageDialog>
                )

            case ErrorCode.SECURITY_INSUFICIENT:
                return (
                    <MessageDialog onConfirm={close}>
                        <h1 className={commonStyles['warningHeader']}>
                            {__('无法执行下载操作')}
                        </h1>
                        <p className={commonStyles['warningContent']}>
                            {getErrorMessage(ErrorCode.SECURITY_INSUFICIENT)}
                        </p>
                    </MessageDialog>
                )

            case ErrorCode.DOWNLOADS_LIMIT:
                return (
                    <MessageDialog onConfirm={close}>
                        <h1 className={commonStyles['warningHeader']}>
                            {__('无法执行下载操作')}
                        </h1>
                        <p className={commonStyles['warningContent']}>
                            {getErrorMessage(ErrorCode.DOWNLOADS_LIMIT)}
                        </p>
                    </MessageDialog>
                )

            case ErrorCode.WATERMARKING_FAILED:
                return (
                    <MessageDialog onConfirm={close}>
                        <h1 className={commonStyles['warningHeader']}>
                            {__('无法下载文件“${filename}”', { filename: docname(target) })}
                        </h1>
                        <p className={commonStyles['warningContent']}>{__('水印制作失败')}</p>
                    </MessageDialog>
                )
            case ErrorCode.SITE_REMOVED:
                return (
                    <MessageDialog onConfirm={close}>
                        <h1 className={commonStyles['warningHeader']}>{__('无法执行下载操作')}</h1>
                        <p className={commonStyles['warningContent']}>
                            {
                                __('文件“${filename}”的归属站点已经离线。', {
                                    filename: docname(target)
                                })
                            }</p>
                    </MessageDialog>
                )
            case ErrorCode.WATERMARK_BATCH_DENIED:
                return (
                    <MessageDialog onConfirm={close}>
                        <h1 className={commonStyles['warningHeader']}>{__('无法执行下载操作')}</h1>
                        <p className={commonStyles['warningContent']}>
                            {
                                __('水印范围内的文件不支持批量下载')
                            }
                        </p>
                    </MessageDialog>
                )

            // iOS不允许下载
            case ErrorCode.FAIL_IOS:
                return (
                    <MessageDialog onConfirm={close}>
                        <h1 className={commonStyles['warningHeader']}>{__('无法执行下载操作')}</h1>
                        <p className={commonStyles['warningContent']}>
                            {
                                __('您正在使用苹果设备访问此页面，仅支持文件预览，不支持文件下载。')
                            }
                        </p>
                    </MessageDialog>
                )

            // 微信不允许下载
            case ErrorCode.FAIL_WECHAT:
                return (
                    <MessageDialog onConfirm={close}>
                        <h1 className={commonStyles['warningHeader']}>{__('无法执行下载操作')}</h1>
                        <p className={commonStyles['warningContent']}>
                            {
                                __('您正在使用微信访问此页面，仅支持文件预览，不支持文件下载。')
                            }
                        </p>
                    </MessageDialog>
                )
            default:
                return null
        }
    }
}