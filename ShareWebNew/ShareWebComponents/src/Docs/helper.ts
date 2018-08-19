import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { getErrorMessage } from '../../core/errcode/errcode'
import { formatterErrorText } from '../../core/permission/permission'
import { docname } from '../../core/docs/docs'
import __ from './locale'


export enum Layout {
    List,
    Grid
}

export const SortRule = {
    NameUp: { by: 'name', sort: 'asc' },
    NameDown: { by: 'name', sort: 'desc' },
    TypeUp: { by: 'type', sort: 'asc' },
    TypeDown: { by: 'type', sort: 'desc' },
    SizeUp: { by: 'size', sort: 'asc' },
    SizeDown: { by: 'size', sort: 'desc' },
    ClientMTimeUp: { by: 'client_mtime', sort: 'asc' },
    ClientMTimeDown: { by: 'client_mtime', sort: 'desc' },
    ModifiedUp: { by: 'time', sort: 'asc' },
    ModifiedDown: { by: 'time', sort: 'desc' }
}


/**
 * 格式化收藏操作错误信息
 * @param errorCode 
 * @param doc 
 */
export function formatterErrorMessage(errorCode: number, doc: Core.Docs.Doc): string {
    switch (errorCode) {
        case ErrorCode.GNSInaccessible: {
            // 文件不存在
            return formatterErrorText(errorCode, doc)
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