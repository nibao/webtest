/// <reference path="./recycle.d.ts" />

import { efshttp } from '../../../openapi/openapi';

/**
 * 浏览回收站资源协议
 */
export const list: Core.APIs.EFSHTTP.Recycle.List = function ({ docid, by, sort, name, path, editor, start, limit }, options?) {
    return efshttp('recycle', 'list', { docid, by, sort, name, path, editor, start, limit }, options);
}

/**
 * 删除回收站资源协议
 */
export const del: Core.APIs.EFSHTTP.Recycle.Del = function ({ docid }, options?) {
    return efshttp('recycle', 'delete', { docid }, options);
}

/**
 * 还原回收站资源协议
 */
export const restore: Core.APIs.EFSHTTP.Recycle.Restore = function ({ docid, ondup }, options?) {
    return efshttp('recycle', 'restore', { docid, ondup }, options);
}

/**
 * 获取回收站还原后的建议名称协议
 */
export const getSuggestName: Core.APIs.EFSHTTP.Recycle.GetSuggestName = function ({ docid }, options?) {
    return efshttp('recycle', 'getsuggestname', { docid }, options);
}

/**
 * 设置回收站资源保留天数
 */
export const setRetentionDays: Core.APIs.EFSHTTP.Recycle.SetRetentionDays = function ({ docid, days }, options?) {
    return efshttp('recycle', 'setretentiondays', { docid, days }, options);
}

/**
 * 获取回收站资源保留天数
 */
export const getRetentionDays: Core.APIs.EFSHTTP.Recycle.GetRetentionDays = function ({ docid }, options?) {
    return efshttp('recycle', 'getretentiondays', { docid }, options);
}


