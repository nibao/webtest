import { eachttp } from '../../../openapi/openapi';

/**
 * 检查单个权限
 */
export const check: Core.APIs.EACHTTP.Perm.Check = function ({ docid, perm, userid }, options?) {
    return eachttp('perm1', 'check', { docid, perm, userid }, options);
}

/**
 * 获取权限配置信息
 */
export const get: Core.APIs.EACHTTP.Perm.Get = function ({ docid }, options?) {
    return eachttp('perm1', 'get', { docid }, options);
}

/**
 * 批量设置权限
 */
export const set: Core.APIs.EACHTTP.Perm.Set = function ({ docid, permconfigs }, options?) {
    return eachttp('perm1', 'set', { docid, permconfigs }, options);
}

/**
 * 获取内链共享模板
 */
export const getInternalLinkTemplate: Core.APIs.EACHTTP.Perm.GetInternalLinkTemplate = function ({ } = {}, options?) {
    return eachttp('perm1', 'getinternallinktemplate', {}, options)
}

/**
 * 获取外链共享模板
 */
export const getExternalLinkTemplate: Core.APIs.EACHTTP.Perm.GetExternalLinkTemplate = function ({ } = {}, options?) {
    return eachttp('perm1', 'getexternallinktemplate', {}, options);
}

/**
 * 获取各访问者的最终权限 
 */
export const list: Core.APIs.EACHTTP.Perm.List = function ({ docid }, options?) {
    return eachttp('perm1', 'list', { docid }, options);
}

/**
 * 添加权限配置
 */
export const add: Core.APIs.EACHTTP.Perm.Add = function ({ docid, permconfigs }, options?) {
    return eachttp('perm1', 'add', { docid, permconfigs }, options);
}

/**
 * 编辑权限配置
 */
export const edit: Core.APIs.EACHTTP.Perm.Edit = function ({ docid, permconfigs }, options?) {
    return eachttp('perm1', 'edit', { docid, permconfigs }, options);
}

/**
 * 删除权限配置
 */
export const del: Core.APIs.EACHTTP.Perm.Delete = function ({ docid, permids }, options?) {
    return eachttp('perm1', 'delete', { docid, permids }, options);
}

/**
 * 检查所有权限
 */
export const checkAll: Core.APIs.EACHTTP.Perm.CheckAll = function ({ docid, userid }, options?) {
    return eachttp('perm1', 'checkall', { docid, userid }, options);
}

/**
 * 获取用户已共享的文档
 */
export const getShared: Core.APIs.EACHTTP.Perm.GetShared = function ({ } = {}, options?) {
    return eachttp('perm1', 'getshared', {}, options);
}

/**
 * 获取共享文档开关配置
 */
export const getShareDocConfig: Core.APIs.EACHTTP.Perm.GetShareDocConfig = function ({ } = {}, options?) {
    return eachttp('perm1', 'getsharedocconfig', {}, options);
}


