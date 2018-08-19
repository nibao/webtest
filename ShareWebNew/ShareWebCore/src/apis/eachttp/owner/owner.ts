import { eachttp } from '../../../openapi/openapi';

/**
 * 检查是否文档id的所有者
 */
export const check: Core.APIs.EACHTTP.Owner.Check = function ({ docid }, options?) {
    return eachttp('owner', 'check', { docid }, options);
}

/**
 * 添加所有者（永久有效）
 */
export const addByEndTime: Core.APIs.EACHTTP.Owner.AddByEndTime = function ({ docid, userids }, options?) {
    return eachttp('owner', 'addbyendtime', { docid, userids }, options);
}

/**
 * 获取所有者信息
 */
export const get: Core.APIs.EACHTTP.Owner.Get = function ({ docid }, options?) {
    return eachttp('owner', 'get', { docid }, options);
}

/**
 * 删除所有者
 */
export const del: Core.APIs.EACHTTP.Owner.Delect = function ({ docid, userids }, options?) {
    return eachttp('owner', 'delete', { docid, userids }, options);
}

/**
 *批量设置所有者
 */
export const set: Core.APIs.EACHTTP.Owner.Set = function ({ docid, userconfigs }, options?) {
    return eachttp('owner', 'set', { docid, userconfigs }, options);
}