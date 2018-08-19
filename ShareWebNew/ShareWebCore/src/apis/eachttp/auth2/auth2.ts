import { eachttp } from '../../../openapi/openapi';

/**
 * 登录
 */
export const login: Core.APIs.EACHTTP.Auth2.Login = function ({ grant_type = 'anyshare_plain', token_type = 'short-lived', params } = { params: {} }, options?) {
    return eachttp('auth2', 'login', { grant_type, token_type, params }, { userid: null, tokenid: null })
}

/**
 * 获取新的token
 */
export const refresh: Core.APIs.EACHTTP.Auth2.Refresh = function ({ refresh_token }, options?) {
    return eachttp('auth2', 'refresh', { refresh_token }, { userid: null, tokenid: null })
}