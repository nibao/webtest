import { clientAPI } from '../../../clientapi/clientapi';

/**
 * 获取用户配置通过用户唯一标识
 * @param param0 userId
 */
export const getLocalUserById: Core.APIs.Client.Config.GetLocalUserById = function ({ userId }) {
    return clientAPI('config', 'GetLocalUserById', { userId })
}

/**
 * 获取全局服务配置
 */
export const getGlobalServer: Core.APIs.Client.Config.GetGlobalServer = function () {
    return clientAPI('config', 'GetGlobalServer')
}

/**
 * 获取本地服务配置
 */
export const getLocalServerById: Core.APIs.Client.Config.GetLocalServerById = function ({ serverId }) {
    return clientAPI('config', 'GetLocalServerById', { serverId })
}

/**
 * 获取版本信息
 */
export const getVersionInfo: Core.APIs.Client.Config.GetVersionInfo = function () {
    return clientAPI('config', 'GetVersionInfo')
}

/**
 * 获取语言信息
 */
export const getLanguageInfo: Core.APIs.Client.Config.GetLanguageInfo = function () {
    return clientAPI('config', 'GetLanguageInfo')
}