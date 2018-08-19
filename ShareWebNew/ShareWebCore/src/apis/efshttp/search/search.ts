import { efshttp, CacheableOpenAPIFactory } from '../../../openapi/openapi';

/**
 * 全文检索
 */
export const search: Core.APIs.EFSHTTP.Search.Search = function ({ start, rows, hlpre, hlpost, style, range, begin, end, keys, keysfields, ext, sort, tags, size, customattr, createtime }, options?) {
    return efshttp('search', 'search', { start, rows, hlpre, hlpost, style, range, begin, end, keys, keysfields, ext, sort, tags, size, customattr, createtime }, options);
}

/**
 * 标签补全协议
 */
export const tagSuggest: Core.APIs.EFSHTTP.Search.TagSuggest = function ({ prefix, count }, options?) {
    return efshttp('search', 'tagsuggest', { prefix, count }, options);
}


/**
 * 获取自定义属性协议
 */
export const customAttribute: Core.APIs.EFSHTTP.Search.CustomAttribute = CacheableOpenAPIFactory(efshttp, 'search', 'customattribute')