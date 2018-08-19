/// <reference path="./quarantine.d.ts" />

import { efshttp } from '../../../openapi/openapi';

/**
 * 获取文件信息
 */
export const list: Core.APIs.EFSHTTP.Quarantine.List = function ({ } = {}, options?) {
    return efshttp('quarantine', 'list', {}, options);
}

/**
 * 获取文件历史版本信息
 */
export const listReversion: Core.APIs.EFSHTTP.Quarantine.ListReversion = function ({ docid }, options?) {
    return efshttp('quarantine', 'listreversion', { docid }, options);
}

/**
 * 文件申诉
 */
export const appeal: Core.APIs.EFSHTTP.Quarantine.Appeal = function ({ docid, reason }, options?) {
    return efshttp('quarantine', 'appeal', { docid, reason }, options);
}

/**
 * 历史文件预览
 */
export const preview: Core.APIs.EFSHTTP.Quarantine.Preview = function ({ docid, rev, reqhost, usehttps = true }, options?) {
    return efshttp('quarantine', 'preview', { docid, rev, reqhost, usehttps }, options);
}




