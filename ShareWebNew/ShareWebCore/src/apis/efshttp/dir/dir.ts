import { efshttp, CacheableOpenAPIFactory } from '../../../openapi/openapi';


/**
 * 获取文档目录 
 */
export const list: Core.APIs.EFSHTTP.Dir.List = CacheableOpenAPIFactory(efshttp, 'dir', 'list', )

/**
 * 获取目录属性
 */
export const attribute: Core.APIs.EFSHTTP.Dir.Attribute = CacheableOpenAPIFactory(efshttp, 'dir', 'attribute')

/**
 * 设置目录密级
 */
export const setCsfLevel: Core.APIs.EFSHTTP.Dir.SetCsfLevel = function ({ docid, csflevel }, options?) {
    return efshttp('dir', 'setcsflevel', { docid, csflevel }, options);
}

/**
 * 创建目录
 */
export const create: Core.APIs.EFSHTTP.Dir.Create = function ({ docid, name, ondup }, options?) {
    return efshttp('dir', 'create', { docid, name, ondup }, options)
}

/**
 * 创建多级目录
 */

export const createMultiLevelDir: Core.APIs.EFSHTTP.Dir.CreateMultiLevelDir = function ({ docid, path }, options?) {
    return efshttp('dir', 'createmultileveldir', { docid, path }, options)
}

/**
 * 删除目录
 */
export const del: Core.APIs.EFSHTTP.Dir.Del = function ({ docid }, options?) {
    return efshttp('dir', 'delete', { docid }, options)
}

/**
 * 重命名目录
 */
export const rename: Core.APIs.EFSHTTP.Dir.Rename = function ({ docid, name, ondup }, options?) {
    return efshttp('dir', 'rename', { docid, name, ondup }, options)
}

/**
 * 移动目录
 */
export const move: Core.APIs.EFSHTTP.Dir.Move = function ({ docid, destparent, ondup }, options?) {
    return efshttp('dir', 'move', { docid, destparent, ondup }, options)
}

/**
 * 复制目录
 */
export const copy: Core.APIs.EFSHTTP.Dir.Copy = function ({ docid, destparent, ondup }, options?) {
    return efshttp('dir', 'copy', { docid, destparent, ondup }, options)
}

/**
 * 复制进度查询
 */
export const copyProgress: Core.APIs.EFSHTTP.Dir.CopyProgress = function ({ id }, options?) {
    return efshttp('dir', 'copyprogress', { id }, options)
}

/**
 * 获取目录建议名
 */
export const getSuggestName: Core.APIs.EFSHTTP.Dir.GetSuggestName = function ({ docid, name }, options?) {
    return efshttp('dir', 'getsuggestname', { docid, name }, options)
}

/**
 * 获取文件夹大小
 */
export const size: Core.APIs.EFSHTTP.Dir.Size = CacheableOpenAPIFactory(efshttp, 'dir', 'size', )

/**
 * 检查是否是发件箱协议
 */
export const isFileoutBox: Core.APIs.EFSHTTP.Dir.IsFileoutBox = CacheableOpenAPIFactory(efshttp, 'dir', 'isfileoutbox', )

/**
 * 检查目录水印策略
 */
export const checkWatermark: Core.APIs.EFSHTTP.Dir.CheckWatermark = CacheableOpenAPIFactory(efshttp, 'dir', 'checkwatermark', )