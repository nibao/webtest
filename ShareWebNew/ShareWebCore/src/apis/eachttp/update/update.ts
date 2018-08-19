import { eachttp } from '../../../openapi/openapi';

/**
 * 检查客户端是否需要更新
 */
export const check: Core.APIs.EACHTTP.Update.Check = function ({ platform, arch, version, softwaretype }) {
    return eachttp('update', 'check', { platform, arch, version, softwaretype });
}

/**
 * 下载客户端
 */
export const download: Core.APIs.EACHTTP.Update.Download = function ({ osType, reqhost, usehttps }) {
    return eachttp('update', 'download', { osType, reqhost, usehttps }, { userid: null, tokenid: null });
}