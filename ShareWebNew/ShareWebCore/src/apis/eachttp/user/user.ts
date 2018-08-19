import { eachttp, CacheableOpenAPIFactory } from '../../../openapi/openapi';

/**
 * 获取用户信息
 */
export const get: Core.APIs.EACHTTP.User.GetUser = CacheableOpenAPIFactory(eachttp, 'user', 'get', { expires: 60 * 1000 })

/**
 * 同意用户使用协议
 */
export const agreedToTermsOfUse: Core.APIs.EACHTTP.User.AgreedToTermsOfUse = function ({ } = {}, options?) {
    return eachttp('user', 'agreedtotermsofuse', {}, options);
}


/**
 * 修改邮箱
 */
export const editeMailAddress: Core.APIs.EACHTTP.User.EditeMailAddress = function ({ emailaddress }, options?) {
    return eachttp('user', 'editemailaddress', { emailaddress }, options);
}
