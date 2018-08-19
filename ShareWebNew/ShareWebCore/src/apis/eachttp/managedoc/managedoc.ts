import { eachttp } from '../../../openapi/openapi';

/**
 * 获取用户管理的文档
 */
export const get: Core.APIs.EACHTTP.ManageDoc.GetDocs = function () {
    return eachttp('managedoc', 'get', {});
}