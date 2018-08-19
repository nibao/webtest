import * as React from 'react'
import ExceptionsBase from './component.base'
import MessageDialog from '../../../ui/MessageDialog/ui.mobile'
import { docname } from '../../../core/docs/docs'
import { ErrorCode } from '../../../core/apis/openapi/errorcode'
import { getErrorMessage } from '../../../core/errcode/errcode'
import { CreateDirErrorCode } from '../../../core/createdir/createdir'
import __ from './locale'
import * as commonStyles from '../../styles.desktop.css'

export default class Exceptions extends ExceptionsBase {

    /**
     * 根据错误码获取错误信息
     * @param param0 
     */
    private getErrorMessage({ errcode, target }) {
        switch (errcode) {
            // 源文件夹不存在
            case ErrorCode.GNSInaccessible:
                return __('文件夹“${name}”不存在，可能其所在路径发生变更', { name: docname(target) })

            // 没有新建权限
            case ErrorCode.PermissionRestricted:
                return __('您对文件夹“${name}”没有新建权限', { name: docname(target) })

            // 配额空间不足
            case ErrorCode.QuotaExhausted:
                return __('空间配额不足')

            // 用户被冻结
            case ErrorCode.AccountFrozen:
                return __('您的账号已被冻结')

            default:
                return getErrorMessage(errcode)
        }
    }

    render() {
        const { events: [event] } = this.state

        if (event) {
            return (
                <MessageDialog onConfirm={this.confirm}>
                    <div className={commonStyles['warningHeader']}>{__('无法执行新建操作')}</div>
                    <div className={commonStyles['warningContent']}>
                        {this.getErrorMessage(event)}
                    </div>
                </MessageDialog>
            )
        }
        return null
    }
}