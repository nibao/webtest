import { eachttp, CacheableOpenAPIFactory } from '../../../openapi/openapi';

/**
 * 获取地址信息
 * @return 返回地址信息
 */
export const getHostInfo: Core.APIs.EACHTTP.Redirect.GetHostInfo = CacheableOpenAPIFactory(eachttp, 'redirect', 'gethostinfo', { expires: 60 * 60 * 1000 }).bind(null, null, { userid: null, tokenid: null })