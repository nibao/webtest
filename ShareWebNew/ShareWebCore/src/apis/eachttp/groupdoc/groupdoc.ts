import { eachttp } from '../../../openapi/openapi';

/**
 * 删除群组
 */
export const del: Core.APIs.EACHTTP.GroupDoc.Delete = function ({ docid }) {
    return eachttp('groupdoc', 'delete', { docid });
}

/**
 * 新建群组
 */
export const add: Core.APIs.EACHTTP.GroupDoc.Create = function ({ name, quota }) {
    return eachttp('groupdoc', 'add', { name, quota });
}


/**
 * 编辑群组名称
 */
export const edit: Core.APIs.EACHTTP.GroupDoc.Edit = function ({ docid, name }) {
    return eachttp('groupdoc', 'edit', { docid, name });
}

/**
 * 编辑群组配额
 */
export const editQuota: Core.APIs.EACHTTP.GroupDoc.EditQuota = function ({ docid, quota }) {
    return eachttp('groupdoc', 'editquota', { docid, quota });
}