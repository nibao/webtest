import { eachttp } from '../../../openapi/openapi';

/**
 * 获取CA信息
 */
export const get: Core.APIs.EACHTTP.CA.Get = function ({ } = {}, options?) {
    return eachttp('ca', 'get', {}, { userid: null, tokenid: null })
}