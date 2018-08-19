import { efshttp, CacheableOpenAPIFactory } from '../../../openapi/openapi';

/**
 * 添加收藏
 */
export const add: Core.APIs.EFSHTTP.Favorites.Add = function ({ docid }, options?) {
    return efshttp('favorites', 'add', { docid }, options);
}

/**
 * 获取收藏列表
 */
export const list: Core.APIs.EFSHTTP.Favorites.List = CacheableOpenAPIFactory(efshttp, 'favorites', 'list', )

/**
 * 删除收藏
 */
export const del: Core.APIs.EFSHTTP.Favorites.Del = function ({ docid }, options?) {
    return efshttp('favorites', 'delete', { docid }, options);
}

/**
 * 批量查询收藏状态
 */
export const check: Core.APIs.EFSHTTP.Favorites.Check = CacheableOpenAPIFactory(efshttp, 'favorites', 'check', )