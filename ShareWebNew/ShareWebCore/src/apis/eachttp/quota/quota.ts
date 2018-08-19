import { eachttp } from '../../../openapi/openapi';

/**
 * 获取用户配额
 */
export const getUserQuota: Core.APIs.EACHTTP.Quota.GetUserQuota = function ({ } = {}, options?) {
    return eachttp('quota', 'getuserquota', {}, options);
}

/**
 * 获取cid路径获取配额信息
 */
export const getByCid: Core.APIs.EACHTTP.Quota.GetByCid = function ({ cid }, options?) {
    return eachttp('quota', 'getbycid', { cid }, options);
}

