import { eachttp, CacheableOpenAPIFactory } from '../../../openapi/openapi';

/**
 * 获取入口文档
 */
export const get: Core.APIs.EACHTTP.EntryDoc.Get = CacheableOpenAPIFactory(eachttp, 'entrydoc', 'get')

/**
 * 根据文档类型获取入口文档
 */
export const getByType: Core.APIs.EACHTTP.EntryDoc.GetByType = CacheableOpenAPIFactory(eachttp, 'entrydoc', 'getbytype')

/**
 * 获取顶层文档入口视图
 */
export const getViews: Core.APIs.EACHTTP.EntryDoc.GetViews = function ({ } = {}, options?) {
    return eachttp('entrydoc', 'getviews', null, options);
}

/**
 * 获取文档类型
 */
export const getDocType: Core.APIs.EACHTTP.EntryDoc.GetDocType = function ({ docid }, options?) {
    return eachttp('entrydoc', 'getdoctype', { docid }, options)
}

/**
 * 退出入口文档
 */
export const quit: Core.APIs.EACHTTP.EntryDoc.Quit = function ({ docid }, options?) {
    return eachttp('entrydoc', 'quit', { docid }, options)
}

/**
 * 加入入口文档
 */
export const join: Core.APIs.EACHTTP.EntryDoc.Join = function ({ docid }, options?) {
    return eachttp('entrydoc', 'join', { docid }, options)
}

/**
 * 获取已退出的入口文档
 */
export const getQuitInfos: Core.APIs.EACHTTP.EntryDoc.GetQuitInfos = function ({ } = {}, options?) {
    return eachttp('entrydoc', 'getquitinfos', {}, options)
}

/**
 * 获取入口文档信息（根据文档ID）
 */
export const getByDocId: Core.APIs.EACHTTP.Entrydoc.GetByDocId = function ({ docid }, options) {
    return eachttp('entrydoc', 'getbydocid', { docid }, options)
}