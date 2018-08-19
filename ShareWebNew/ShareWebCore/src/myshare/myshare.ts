import { pick } from 'lodash';
import { get as getPermInfos } from '../apis/eachttp/perm/perm';
import { ErrorCode } from '../apis/openapi/errorcode';
import { getErrorMessage } from '../errcode/errcode';
import { docname, isDir } from '../docs/docs';
import { getConfig } from '../config/config';
import { convertPath } from '../apis/efshttp/file/file';
import __ from './locale';

/**
 * 共享类型
 */
export enum SHARETYPE {
    // 内链
    Share,

    // 外链
    LinkShare,
}

/**
 * 根据type属性，展示相应的共享类型名称
 */
export function showType(type: number): string {
    switch (type) {
        case SHARETYPE.Share:
            return __('内链共享');

        case SHARETYPE.LinkShare:
            return __('外链共享');
    }
}

/**
 * 根据文件路径返回文件名称（带有文件后缀）
 * @param path 文件路径（当没有\或/时，直接作为文件名返回；当有\或/时，截取最后一个\或/后面的内容作为文件名返回）
 */
export function getBasename(path: string) {
    let slashPosition
    if (path.lastIndexOf('\\') !== -1) {
        slashPosition = path.lastIndexOf('\\')
    } else if (path.lastIndexOf('/') !== -1) {
        slashPosition = path.lastIndexOf('/')
    } else {
        slashPosition = -1
    }

    return slashPosition === -1 ? path : path.substr(slashPosition + 1)
}

/**
 * 取消共享发生错误时，处理错误
 * @param {number} errorCode 错误码
 * @param {(Core.APIs.EACHTTP.SharedDocs | Core.APIs.EFSHTTP.GetLinkedResult)} doc 发生错误的文件或者文件夹
 * @returns {string} 
 */
export function formatterErrorMessage(errorCode: number, doc: Core.APIs.EACHTTP.SharedDocs | Core.APIs.EFSHTTP.GetLinkedResult): string {
    switch (errorCode) {
        // 共享文件不存在时(错误码：404006)，提示文件不存在
        case ErrorCode.GNSInaccessible: {
            return isDir(doc) ? __('文件夹“${docname}”不存在，可能其所在路径发生变更。', { docname: docname(doc) }) : __('文件“${docname}”不存在，可能其所在路径发生变更。', { docname: docname(doc) })
        }

        // 共享不存在时，提示共享不存在
        case 10: {
            return isDir(doc) ? __('文件夹“${docname}”的共享不存在。', { docname: docname(doc) }) : __('文件“${docname}”的共享不存在。', { docname: docname(doc) })
        }

        default: {
            return getErrorMessage(errorCode)
        }
    }
}

/**
 * 获取用户访问权限
 * @param {Core.APIs.EACHTTP.SharedDocs} doc 查看详情的内链文件
 */
export function getPermConfigs(doc: Core.APIs.EACHTTP.SharedDocs) {
    return getPermInfos({ docid: doc.docid }).then(({ perminfos }) => {
        // 将perminfos转换成PermConfig类型的数组
        const newPermInfos = perminfos.reduce((prev, perminfo) => {
            const { isallowed, permvalue, accessorid, inheritpath } = perminfo;
            const key = accessorid + inheritpath

            if (prev.find((perm) => (perm.accessorid + perm.inheritpath) === key)) {
                // prev中含有与perminfo相同key的数据
                return prev.map((perm) => {
                    if ((perm.accessorid + perm.inheritpath) === key) {
                        return { ...perm, allow: perm.allow ? perm.allow : perminfo.permvalue, deny: perm.deny ? perm.deny : perminfo.permvalue }
                    }
                    return perm
                })
            }

            return [
                ...prev, {
                    ...perminfo,
                    allow: isallowed ? permvalue : 0,
                    deny: isallowed ? 0 : permvalue,
                    isowner: false,
                }
            ]
        }, []).map((perm) => pick(perm, 'createtime', 'modifytime', 'allow', 'deny', 'isowner', 'accessorid', 'accessorname', 'accessortype', 'endtime', 'inheritpath'))
        return [...newPermInfos]
    })
}

/**
 * 为详情信息添加namepath字段
 * @param {any} perminfos 
 */
export async function addNamePath(perminfos) {
    return await Promise.all(perminfos.map(async perminfo => {
        let pathResult
        if (perminfo.inheritpath !== '') {
            const [{ namepath }, prefix] = await Promise.all([
                convertPath({ docid: perminfo.inheritpath }),
                getConfig('internal_link_prefix')
            ])
            pathResult = prefix + namepath
        } else {
            pathResult = __('当前文档')
        }
        return { ...perminfo, namepath: pathResult }
    }))
}

/**
 * 过滤取消共享的文件
 * @param docs 
 * @param cancelDoc 
 */
export function filterCancelResult(docs, cancelDoc) {
    return docs.filter(doc => {
        return doc.docid !== cancelDoc.docid
    })
}
