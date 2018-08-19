import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { getErrorMessage } from '../../core/errcode/errcode';
import { docname } from '../../core/docs/docs'
import __ from './locale'

/**
 * 格式化错误信息
 * @param errorCode 
 * @param doc 
 */
export function formatterErrorMessage(errorCode: number, doc: Core.Docs.Doc): string {
    switch (errorCode) {
        case ErrorCode.GNSInaccessible: {
            // 文件不存在
            return __('文件或文件夹“${docname}”不存在，可能其所在路径发生变更。', { docname: docname(doc) })
        }

        case ErrorCode.PermissionRestricted: {
            // 没有显示权限
            return __('无法执行收藏操作，您对文件夹"${docname}"没有显示权限', { docname: docname(doc) })
        }

        default: {
            return getErrorMessage(errorCode)
        }
    }
}