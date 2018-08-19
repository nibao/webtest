import { eachttp } from '../../../openapi/openapi';

/**
 * 获取用户所能访问的根部门信息
 */
export const getRoots: Core.APIs.EACHTTP.Department.GetRoots = function ({ } = {}, options?) {
    return eachttp('department', 'getroots', {}, options);
}

/**
 * 获取子部门信息
 */
export const getSubDeps: Core.APIs.EACHTTP.Department.GetSubDeps = function ({ depid }, options?) {
    return eachttp('department', 'getsubdeps', { depid }, options);
}

/**
 * 获取部门下的子用户信息
 */
export const getSubUsers: Core.APIs.EACHTTP.Department.GetSubUsers = function ({ depid }, options?) {
    return eachttp('department', 'getsubusers', { depid }, options);
}

/**
 * 在组织下搜索用户和部门信息
 */
export const search: Core.APIs.EACHTTP.Department.DepartmentSearchResult = function ({ key }, options?) {
    return eachttp('department', 'search', { key }, options);
}
