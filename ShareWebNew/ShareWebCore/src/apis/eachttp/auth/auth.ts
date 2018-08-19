import { eachttp } from '../../../openapi/openapi';

/**
 * 获取服务器时间
 */
export const servertime: Core.APIs.EACHTTP.Auth.ServerTime = function (options?) {
    return eachttp('auth', 'servertime', {}, options)
}
