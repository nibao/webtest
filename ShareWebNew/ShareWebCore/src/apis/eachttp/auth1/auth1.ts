import { eachttp, CacheableOpenAPIFactory } from '../../../openapi/openapi';

/**
 * 获取服务器配置信息
 */
export const getConfig: Core.APIs.EACHTTP.Auth1.GetConfig = CacheableOpenAPIFactory(eachttp, 'auth1', 'getconfig', { expires: 60 * 1000 }).bind(null, null, { userid: null, tokenid: null })

/**
 * 获取OAuth信息
 */
export const getOAuthInfo: Core.APIs.EACHTTP.Auth1.GetOAuthInfo = CacheableOpenAPIFactory(eachttp, 'auth1', 'getoauthinfo', { expires: 60 * 1000 }).bind(null, null, { userid: null, tokenid: null })

/**
 * 认证用户
 */
export const getNew: Core.APIs.EACHTTP.Auth1.GetNew = function ({ account, deviceinfo: { name, ostype, version, devicetype, udid }, password, vcodeinfo }) {
    return eachttp('auth1', 'getnew', { account, deviceinfo: { name, ostype, version, devicetype, udid }, password, vcodeinfo }, { userid: null, tokenid: null });
}

/**
 * 登录（使用第三方凭证）
 */
export const getByThirdParty: Core.APIs.EACHTTP.Auth1.GetByThirdParty = function ({ thirdpartyid, params, deviceinfo: { name, ostype, devicetype, udid } }) {
    return eachttp('auth1', 'getbythirdparty', { thirdpartyid, params, deviceinfo: { name, ostype, devicetype, udid } }, { userid: null, tokenid: null });
}

/**
 * 登录（西电ticket）
 */
export const getByTicket: Core.APIs.EACHTTP.Auth1.GetByTicket = function ({ ticket, service }) {
    return eachttp('auth1', 'getbyticket', { ticket, service }, { userid: null, tokenid: null });
}

/**
 * 登录（使用windows登录凭据）
 */
export const getByADSession: Core.APIs.EACHTTP.Auth1.GetByADSession = function ({ adsession }) {
    return eachttp('auth1', 'getbyadsession', { adsession }, { userid: null, tokenid: null });
}

/**
 * 信任的第三方应用appid登录
 */
export const extLoginClient: Core.APIs.EACHTTP.Auth1.ExtLoginClient = function ({ account, appid, key }) {
    return eachttp('auth1', 'extloginclient', { account, appid, key }, { userid: null, tokenid: null });
}

/**
 * 登录web(信任的第三方应用appid登录)
 */
export const extLoginWeb: Core.APIs.EACHTTP.Auth1.ExtLoginWeb = function ({ account, appid, key }) {
    return eachttp('auth1', 'extloginweb', { account, appid, key }, { userid: null, tokenid: null });
}

/**
 * 登录外部应用（集成到anyshare）
 */
export const getExtAppInfo: Core.APIs.EACHTTP.Auth1.GetExtAppInfo = function ({ apptype, params }) {
    return eachttp('auth1', 'getextappinfo', { apptype, params });
}

/**
 * 刷新身份凭证有效期
 */
export const refreshToken: Core.APIs.EACHTTP.Auth1.RefreshToken = function ({ userid, tokenid, expirestype }) {
    return eachttp('auth1', 'refreshtoken', { userid, tokenid, expirestype });
}

/**
 * 回收身份凭证
 */
export const revokeToken: Core.APIs.EACHTTP.Auth1.RevokeToken = function ({ tokenid }) {
    return eachttp('auth1', 'revoketoken', { tokenid });
}

/**
 * 修改用户密码
 */
export const modifyPassword: Core.APIs.EACHTTP.Auth1.ModifyPassword = function ({ account, oldpwd, newpwd }) {
    return eachttp('auth1', 'modifypassword', { account, oldpwd, newpwd });
}

/**
 * 本地登出
 */
export const logout: Core.APIs.EACHTTP.Auth1.Logout = function ({ ostype }, options?) {
    return eachttp('auth1', 'logout', { ostype }, options);
}

/**
 * 二次验证
 */
export const validateSecurityDevice: Core.APIs.EACHTTP.Auth1.ValidateSecurityDevice = function ({ thirdpartyid, params: { account, key } }) {
    return eachttp('auth1', 'validatesecuritydevice', { thirdpartyid, params: { account, key } })
}

/**
 * PC客户端卸载输入口令
 */
export const checkUninstallPwd: Core.APIs.EACHTTP.Auth1.CheckUninstallPwd = function ({ uninstallpwd }) {
    return eachttp('auth1', 'checkuninstallpwd', { uninstallpwd })
}

/**
 * 获取验证码
 */
export const getVcode: Core.APIs.EACHTTP.Auth1.GetVcode = function ({ uuid }) {
    return eachttp('auth1', 'getvcode', { uuid })
}

/**
 * 获取验证码
 */
export const sendsMS: Core.APIs.EACHTTP.Auth1.SendsMS = function ({ account, password, tel_number }) {
    return eachttp('auth1', 'sendsms', { account, password, tel_number })
}

/**
 * 获取验证码
 */
export const smsActivate: Core.APIs.EACHTTP.Auth1.SMSActivate = function ({ account, password, tel_number, mail_address, verify_code }) {
    return eachttp('auth1', 'smsactivate', { account, password, tel_number, mail_address, verify_code })
}