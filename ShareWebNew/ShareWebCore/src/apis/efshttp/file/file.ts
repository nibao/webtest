import { efshttp, CacheableOpenAPIFactory } from '../../../openapi/openapi';

/**
 * 获取文件属性协议
 */
export const attribute: Core.APIs.EFSHTTP.File.Attribute = CacheableOpenAPIFactory(efshttp, 'file', 'attribute', )

/**
 * 视频播放信息
 */
export const playInfo: Core.APIs.EFSHTTP.File.PlayInfo = function ({ docid, rev, definition }, options?) {
    return efshttp('file', 'playinfo', { docid, rev, definition }, options);
}

/**
 * 文档预览
 */
export const previewOSS: Core.APIs.EFSHTTP.File.PreviewOSS = function ({ docid, rev, type, reqhost, usehttps, watermark }, options?) {
    return efshttp('file', 'previewoss', { docid, rev, type, reqhost, usehttps, watermark }, options);
}

/**
 * 文件下载
 */
export const OSDownload: Core.APIs.EFSHTTP.File.OSDownload = function ({ docid, rev, authtype, reqhost, usehttps, savename }, options) {
    return efshttp('file', 'osdownload', { docid, rev, authtype, reqhost, usehttps, savename }, options);
}

/**
 * 获取元数据
 */
export const metaData: Core.APIs.EFSHTTP.File.MetaData = CacheableOpenAPIFactory(efshttp, 'file', 'metadata', )

/** 
 * 获取重名冲突对象的建议名称
*/
export const getSuggestName: Core.APIs.EFSHTTP.File.GetSuggestName = function ({ docid, name }, options?) {
    return efshttp('file', 'getsuggestname', { docid, name }, options);
}

/**
 * 正式开始上传前，调用osbeingupload获取上传信息
 */
export const OSBeginUpload: Core.APIs.EFSHTTP.File.OSBeginUpload = function ({ docid, length, name, client_mtime, ondup, reqmethod, reqhost, usehttps, csflevel }, options?) {
    return efshttp('file', 'osbeginupload', { docid, length, name, client_mtime, ondup, reqmethod, reqhost, usehttps, csflevel }, options);
}
/**
 * OSS上传完成
 */
export const OSEndUpload: Core.APIs.EFSHTTP.File.OSEndUpload = function ({ docid, rev, md5, crc32, slice_md5, csflevel }, options?) {
    return efshttp('file', 'osendupload', { docid, rev, md5, crc32, slice_md5, csflevel }, options)
}

/**
 * 获取外部文件下载
 */
export const OSDownloadEXT: Core.APIs.EFSHTTP.File.OSDownloadEXT = function ({ docid, rev, authtype, reqhost, usehttps, savename }, options?) {
    return efshttp('file', 'osdownloadext', { docid, rev, authtype, reqhost, usehttps, savename }, options);

}

/**
 * 获取自定义属性值
 */
export const customAttributeValue: Core.APIs.EFSHTTP.File.CustomAttributeValue = CacheableOpenAPIFactory(efshttp, 'file', 'customattributevalue', )

/**
 * 获取文件自定义属性
 */
export const getFileCustomAttribute: Core.APIs.EFSHTTP.File.GetFileCustomAttribute = CacheableOpenAPIFactory(efshttp, 'file', 'getfilecustomattribute', )

/**
 * 设置文件属性值
 */
export const setFileCustomAttribute: Core.APIs.EFSHTTP.File.SetFileCustomAttribute = function ({ docid, attribute }, options?) {
    return efshttp('file', 'setfilecustomattribute', { docid, attribute }, options);
}

/**
 * 设置文件密级
 */
export const setCsfLevel: Core.APIs.EFSHTTP.File.setCsfLevel = function ({ docid, csflevel }, options?) {
    return efshttp('file', 'setcsflevel', { docid, csflevel }, options);
}

/**
 * 新增标签
 */
export const addTag: Core.APIs.EFSHTTP.File.AddTag = function ({ docid, tag }, options?) {
    return efshttp('file', 'addtag', { docid, tag }, options);
}

/**
 *删除标签
 */
export const deleteTag: Core.APIs.EFSHTTP.File.DeleteTag = function ({ docid, tag }, options?) {
    return efshttp('file', 'deletetag', { docid, tag }, options);
}

/**
 * 获取文件点评
 */
export const getComment: Core.APIs.EFSHTTP.File.GetComment = function ({ docid }, options?) {
    return efshttp('file', 'getcomment', { docid }, options);
}


/**
 * 提交文件点评
 */
export const submitComment: Core.APIs.EFSHTTP.File.SubmitComment = function ({ docid, answertoid, score, comment }, options?) {
    return efshttp('file', 'submitcomment', { docid, answertoid, score, comment }, options);
}

/**
 * 删除文件点评
 */
export const deleteComment: Core.APIs.EFSHTTP.File.DeleteComment = function ({ docid, commentid }, options?) {
    return efshttp('file', 'deletecomment', { docid, commentid }, options);
}

/**
 * 删除文件
 */
export const del: Core.APIs.EFSHTTP.File.Del = function ({ docid }, options?) {
    return efshttp('file', 'delete', { docid }, options)
}

/**
 * 重命名文件
 */
export const rename: Core.APIs.EFSHTTP.File.Rename = function ({ docid, name, ondup }, options?) {
    return efshttp('file', 'rename', { docid, name, ondup }, options)
}

/**
 * 移动文件
 */
export const move: Core.APIs.EFSHTTP.File.Move = function ({ docid, destparent, ondup }, options?) {
    return efshttp('file', 'move', { docid, destparent, ondup }, options)
}

/**
 * 复制文件
 */
export const copy: Core.APIs.EFSHTTP.File.Copy = function ({ docid, destparent, ondup }, options?) {
    return efshttp('file', 'copy', { docid, destparent, ondup }, options)
}

/**
 * 获取应用元数据
 */
export const getAppmetadata: Core.APIs.EFSHTTP.File.GetAppmetadata = function ({ docid, appid }, options?) {
    return efshttp('file', 'getappmetadata', { docid, appid }, options)
}

/**
 * 转换路径协议
 */
export const convertPath: Core.APIs.EFSHTTP.File.ConvertPath = function ({ docid }, options?) {
    return efshttp('file', 'convertpath', { docid }, options)
}

/**
 * 添加文件多个标签
 */
export const addTags: Core.APIs.EFSHTTP.File.AddTags = function ({ docid, tags }, options?) {
    return efshttp('file', 'addtags', { docid, tags }, options)
}

/**
 * 批量下载
 */
export const batchDownload: Core.APIs.EFSHTTP.File.BatchDownload = function ({ name, reqhost, usehttps, files, dirs }, options?) {
    return efshttp('file', 'batchdownload', { name, reqhost, usehttps, files, dirs }, options)
}

/**
 * 大文件切片上传
 */
export const OSInitMultiUpload: Core.APIs.EFSHTTP.File.OSInitMultiUpload = function ({ docid, length, name, ondup = 0, client_mtime, csflevel }, options?) {
    return efshttp('file', 'osinitmultiupload', { docid, length, name, ondup, client_mtime, csflevel }, options)
}

/**
 * 文件分片上传完成
 */
export const OSCompleteUpload: Core.APIs.EFSHTTP.File.OSCompleteUpload = function ({ partinfo, docid, rev, uploadid, usehttps, reqhost }, options) {
    return efshttp('file', 'oscompleteupload', { partinfo, docid, rev, uploadid, usehttps, reqhost }, options)
}

/**
 * 上传大文件的分块协议
 */
export const OSUploadPart: Core.APIs.EFSHTTP.File.OSUploadPart = function ({ docid, rev, uploadid, usehttps, parts, reqhost }, options?) {
    return efshttp('file', 'osuploadpart', { docid, rev, uploadid, usehttps, parts, reqhost }, options)
}

/**
* 获取文件历史版本
*/
export const revisions: Core.APIs.EFSHTTP.File.Revisions = function ({ docid }, options?) {
    return efshttp('file', 'revisions', { docid }, options)
}

/**
 * 还原文件历史版本
 */
export const restoreRevision: Core.APIs.EFSHTTP.File.RestoreRevision = function ({ docid, rev }, options?) {
    return efshttp('file', 'restorerevision', { docid, rev }, options)
}

/**
 * 对象存储的选项值
 */
export const osOption: Core.APIs.EFSHTTP.File.OsOption = function ({ } = {}, options?) {
    return efshttp('file', 'osoption', {}, options)
}


/**
 * 上传文件更新协议
 */
export const osUploadRefresh: Core.APIs.EFSHTTP.File.OsUploadRefresh = function ({ docid, rev, length, multiupload, reqmethod, reqhost, usehttps }, options?) {
    return efshttp('file', 'osuploadrefresh', { docid, rev, length, multiupload, reqmethod, reqhost, usehttps }, options)
}

/**
 * 秒传校验码协议
 */
export const predUpload: Core.APIs.EFSHTTP.File.PredUpload = function ({ length, slice_md5 }, options?) {
    return efshttp('file', 'predupload', { length, slice_md5 }, options)
}

/**
 * 秒传校验码协议
 */
export const dupload: Core.APIs.EFSHTTP.File.Dupload = function ({ docid, length, md5, crc32, name, ondup, client_mtime, csflevel }, options?) {
    return efshttp('file', 'dupload', { docid, length, md5, crc32, name, ondup, client_mtime, csflevel }, options)
}

/**
 * 图片缩略图协议
 */
export const thumbnail: Core.APIs.EFSHTTP.File.Thumbnail = function ({ docid, height, width, rev, quality }, options?) {
    return efshttp('file', 'thumbnail', { docid, height, width, rev, quality }, options)
}

/**
 * 在线播放协议
 */
export const play: Core.APIs.EFSHTTP.File.Play = function ({ docid, reqhost, usehttps }, options?) {
    return efshttp('file', 'play', { docid, reqhost, usehttps }, options)
}

/**
 * 获取视频缩略图协议
 */
export const playthumbnail: Core.APIs.EFSHTTP.File.PlayThumbnail = function ({ docid, rev }, options?) {
    return efshttp('file', 'playthumbnail', { docid, rev }, options)
}

/**
 * 发送文件协议
 */
export const send: Core.APIs.EFSHTTP.File.Send = function ({ docid, recipients }, options?) {
    return efshttp('file', 'send', { docid, recipients }, options)
}

/**
 * 由名字路径获取对象信息协议
 */
export const getInfoByPath: Core.APIs.EFSHTTP.File.GetInfoByPath = function ({ namepath }, options?) {
    return efshttp('file', 'getinfobypath', { namepath }, options)
}

/**
 * 设置应用元数据
 */
export const setAppMetaData: Core.APIs.EFSHTTP.File.SetAppMetaData = function ({ docid, appid, appmetadata }, options?) {
    return efshttp('file', 'setappmetadata', { docid, appid, appmetadata }, options)
}

/**
 * 批量获取文件操作统计
 */
export const opStatistics: Core.APIs.EFSHTTP.File.OpStatistics = function ({ docid }, options?) {
    return efshttp('file', 'opstatistics', { docid }, options)
}