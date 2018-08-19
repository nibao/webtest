import { eachttp } from '../../../openapi/openapi';

/**
 * 获取所有联系人分组
 */
export const getGroups: Core.APIs.EACHTTP.Contact.GetGroups = function ({ } = {}, options?) {
    return eachttp('contactor', 'getgroups', {}, options);
}

/**
 * 获取分组下所有联系人
 */
export const get: Core.APIs.EACHTTP.Contact.Get = function ({ groupid }, options?) {
    return eachttp('contactor', 'get', { groupid }, options);
}

/**
 * 在联系人组搜索用户和联系人组信息
 */
export const search: Core.APIs.EACHTTP.Contact.Search = function ({ key }, options?) {
    return eachttp('contactor', 'search', { key }, options);
}

/**
 * 新建联系人分组
 */
export const addGroup: Core.APIs.EACHTTP.Contact.AddGroup = function ({ groupname }, options?) {
    return eachttp('contactor', 'addgroup', { groupname }, options);
}

/**
 * 编辑联系人分组
 */
export const editGroup: Core.APIs.EACHTTP.Contact.EditGroup = function ({ groupid, newname }, options?) {
    return eachttp('contactor', 'editgroup', { groupid, newname }, options);
}

/**
 * 删除联系人分组
 */
export const deleteGroup: Core.APIs.EACHTTP.Contact.DeleteGroup = function ({ groupid }, options?) {
    return eachttp('contactor', 'deletegroup', { groupid }, options);
}

/**
 * 添加联系人到指定分组
 */
export const addPersons: Core.APIs.EACHTTP.Contact.AddPersons = function ({ groupid, userids }, options?) {
    return eachttp('contactor', 'addpersons', { groupid, userids }, options);
}

/**
 * 删除指定联系人
 */
export const deletePersons: Core.APIs.EACHTTP.Contact.DeletePersons = function ({ groupid, userids }, options?) {
    return eachttp('contactor', 'deletepersons', { groupid, userids }, options);
}

/**
 * 获取分组下所有联系人
 */
export const getPersons: Core.APIs.EACHTTP.Contact.GetPersons = function ({ groupid, start, limit }, options?) {
    return eachttp('contactor', 'getpersons', { groupid, start, limit }, options);
}

/**
 * 搜索联系人
 */
export const searchPersons: Core.APIs.EACHTTP.Contact.SearchPersons = function ({ key }, options?) {
    return eachttp('contactor', 'searchpersons', { key }, options);
}


