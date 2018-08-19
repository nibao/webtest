import { efshttp, CacheableOpenAPIFactory } from '../../../openapi/openapi';

/**
 * 获取外链
 */
export const get: Core.APIs.EFSHTTP.Link.Get = function ({ link, password, docid }) {
    return efshttp('link', 'get', { link, password, docid }, { userid: null, tokenid: null });
}

/**
 * 获取外链文件信息
 */
export const getInfo: Core.APIs.EFSHTTP.Link.GetInfo = CacheableOpenAPIFactory(efshttp, 'link', 'getinfo', )

/**
 * 获取图片Base64编码
 */
export const thumbnail: Core.APIs.EFSHTTP.Link.Thumbnail = function ({ link, password, docid, rev, height, width, quality }) {
    return efshttp('link', 'thumbnail', { link, password, docid, rev, height, width, quality }, { readAs: 'text', userid: null, tokenid: null });
}

/**
 * 外链列举目录
 */
export const listDir: Core.APIs.EFSHTTP.Link.ListDir = CacheableOpenAPIFactory(efshttp, 'link', 'listdir', )

/**
 * 外链下载
 */
export const OSDownload: Core.APIs.EFSHTTP.Link.OSDownload = function ({ link, password, docid, reqhost, usehttps, savename }) {
    return efshttp('link', 'osdownload', { link, password, docid, reqhost, usehttps, savename }, { userid: null, tokenid: null });
}

/**
 * 外链视频播放信息
 */
export const playInfo: Core.APIs.EFSHTTP.Link.PlayInfo = function ({ link, password, docid, rev, definition }) {
    return efshttp('link', 'playinfo', { link, password, docid, rev, definition }, { userid: null, tokenid: null });
}

/**
 * 文档预览
 */
export const previewOSS: Core.APIs.EFSHTTP.Link.PreviewOSS = function ({ link, password, docid, type, reqhost, usehttps }) {
    return efshttp('link', 'previewoss', { link, password, docid, type, reqhost, usehttps }, { userid: null, tokenid: null });
}

/**
 * 外链上传前，调用osbeingupload获取上传信息
 */
export const OSBeginUpload: Core.APIs.EFSHTTP.Link.OSBeginUpload = function ({ link, docid, password, length, name, ondup, client_mtime, reqhost, reqmethod, usehttps }) {
    return efshttp('link', 'osbeginupload', { link, docid, password, length, name, ondup, client_mtime, reqhost, reqmethod, usehttps }, { userid: null, tokenid: null });
}

/**
 * 获取外部下载链接
 */
export const OSDownloadExt: Core.APIs.EFSHTTP.Link.OSDownloadEXT = function ({ link, password, docid, reqhost, usehttps }) {
    return efshttp('link', 'osdownloadext', { link, password, docid, reqhost, usehttps }, { userid: null, tokenid: null });
}

/**
 * 外链上传完成
 */
export const OSEndUpload: Core.APIs.EFSHTTP.Link.OSEndUpload = function ({ link, docid, rev, md5, crc32, slice_md5 }) {
    return efshttp('link', 'osendupload', { link, docid, rev, md5, crc32, slice_md5 }, { userid: null, tokenid: null });
}

/**
 * 获取外链详细信息
 */
export const getDetail: Core.APIs.EFSHTTP.Link.GetDetail = CacheableOpenAPIFactory(efshttp, 'link', 'getdetail', )

/**
 * 设置外链详细信息
 */
export const set: Core.APIs.EFSHTTP.Link.Set = function ({ docid, open, endtime, perm, limittimes }) {
    return efshttp('link', 'set', { docid, open, endtime, perm, limittimes });
}

/**
 * 开启外链
 */
export const open: Core.APIs.EFSHTTP.Link.Open = function ({ docid, open, endtime, perm, limittimes }) {
    return efshttp('link', 'open', { docid, open, endtime, perm, limittimes });
}

/**
 * 关闭外链
 */
export const close: Core.APIs.EFSHTTP.Link.Close = function ({ docid }) {
    return efshttp('link', 'close', { docid });
}

/**
 * 检查权限
 */
export const checkPerm: Core.APIs.EFSHTTP.Link.ChecPerm = CacheableOpenAPIFactory(efshttp, 'link', 'checkperm', )

/**
 * 由提取码获取外链
 */
export const getLinkByAccessCode: Core.APIs.EFSHTTP.Link.GetLinkByAccessCode = function ({ accesscode }) {
    return efshttp('link', 'getlinkbyaccesscode', { accesscode });
}

/**
 * 批量下载
 */
export const batchDownload: Core.APIs.EFSHTTP.Link.BatchDownload = function ({ name, reqhost, usehttps, files, dirs, link, password }) {
    return efshttp('link', 'batchdownload', { name, reqhost, usehttps, files, dirs, link, password }, { userid: null, tokenid: null })
}

/**
 * 云端复制 
 */
export const copy: Core.APIs.EFSHTTP.Link.Copy = function ({ link, password, docid, destparent, ondup }) {
    return efshttp('link', 'copy', { link, password, docid, destparent, ondup })
}

/**
 * 获取外链访问详情的文件列表
 */
export const opFiles: Core.APIs.EFSHTTP.Link.OpFiles = function ({ docid, start, limit }) {
    return efshttp('link', 'opfiles', { docid, start, limit })
}

/**
 * 获取外链访问详情的文件列表
 */
export const opStatistics: Core.APIs.EFSHTTP.Link.OpStatistics = function ({ link_docid, file_docid, start, limit }) {
    return efshttp('link', 'opstatistics', { link_docid, file_docid, start, limit })
}

/**
 * 获取我的外链
 */
export const getLinked: Core.APIs.EFSHTTP.Link.GetLinked = CacheableOpenAPIFactory(efshttp, 'link', 'getlinked', )

/**
 * 在线播放
 */
export const play: Core.APIs.EFSHTTP.Link.Play = function ({ docid, reqhost, usehttps }) {
    return efshttp('link', 'play', { docid, reqhost, usehttps }, { userid: null, tokenid: null })
}

/**
 * 获取视频缩略图
 */
export const playThumbnail: Core.APIs.EFSHTTP.Link.PlayThumbnail = function ({ docid, rev }) {
    return efshttp('link', 'playthumbnail', { docid, rev }, { userid: null, tokenid: null })
}

/**
 * 复制目录进度查询协议
 */
export const copyProgress: Core.APIs.EFSHTTP.Link.CopyProgress = function ({ id }) {
    return efshttp('link', 'copyprogress', { id })
}

/**
 * 外链检查目录水印策略
 */
export const checkWatermark: Core.APIs.EFSHTTP.Link.CheckWatermark = CacheableOpenAPIFactory(efshttp, 'link', 'checkwatermark', )