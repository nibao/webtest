/// <reference path="./sharesite.d.ts" />

import { ShareSite } from '../thrift';

/**
 * 获取本地站点信息
 */
export const getLocalSiteInfo: Core.ShareSite.GetLocalSiteInfo = function () {
    return ShareSite('GetLocalSiteInfo');
}

/**
 * 获取所有站点信息
 */
export const getSiteInfo: Core.ShareSite.GetSiteInfo = function () {
    return ShareSite('GetSiteInfo');
}

/**
 * 获取站点开启/关闭状态
 */
export const getMultSiteStatus: Core.ShareSite.GetMultSiteStatus = function ({ } = {}) {
    return ShareSite('GetMultSiteStatus', {});
}

/**
 * 开启/关闭站点
 * @param status 
 */
export const setMultSiteStatus: Core.ShareSite.SetMultSiteStatus = function (status: boolean) {
    return ShareSite('SetMultSiteStatus', [status]);
}

/**
 * 添加分站点
 * @param ncTAddSiteParam 
 */
export const addSite: Core.ShareSite.AddSite = function (ncTAddSiteParam: Core.ShareSite.ncTAddSiteParam) {
    return ShareSite('AddSite', [{ ncTAddSiteParam }]);
}

/**
 * 编辑站点
 * @param ncTAddSiteParam 
 */
export const editSite: Core.ShareSite.EditSite = function (ncTAddSiteParam: Core.ShareSite.ncTAddSiteParam) {
    return ShareSite('EditSite', [{ ncTAddSiteParam }]);
}

/**
 * 删除分站点
 * @param siteId 
 */
export const deleteSite: Core.ShareSite.DeleteSite = function (siteId: string) {
    return ShareSite('DeleteSite', [siteId]);
}
