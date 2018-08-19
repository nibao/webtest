/// <reference path="./downloadlimit.d.ts" />
import { ShareMgnt } from '../thrift';

//增加一条限制信息
export function addDocDownloadLimitInfo(ncTDocDownloadLimitInfo: Core.DownloadLimit.ncTDocDownloadLimitInfo): PromiseLike<string> {
    return ShareMgnt('Usrm_AddDocDownloadLimitInfo', [{ncTDocDownloadLimitInfo}]);
}

//编辑一条限制信息中的限制对象
export function editDocDownloadLimitObject(id: string, userInfos: Core.DownloadLimit.ncTDocDownloadLimitObject, depInfos: Core.DownloadLimit.ncTDocDownloadLimitObject): PromiseLike<void> {
    return ShareMgnt('Usrm_EditDocDownloadLimitObject', [id, userInfos, depInfos]);
}

//编辑一条限制信息中的文档上限配置
export function editDocDownloadLimitValue(id: string, limitValue: string): PromiseLike<void> {
    return ShareMgnt('Usrm_EditDocDownloadLimitValue', [id, parseInt(limitValue)]);
}

//删除一条限制信息
export function deleteDocDownloadLimitInfo(id: string): PromiseLike<void> {
    return ShareMgnt('Usrm_DeleteDocDownloadLimitInfo', [id]);
}

//获取文档下载限制信息总数
export function getDocDownloadLimitInfoCnt(): PromiseLike<number> {
    return ShareMgnt('Usrm_GetDocDownloadLimitInfoCnt', []);
}

//获取文档下载限制信息总数
export function getDocDownloadLimitInfoByPage(start: number, limit: number): PromiseLike<Array<Core.DownloadLimit.ncTDocDownloadLimitInfo>> {
    return ShareMgnt('Usrm_GetDocDownloadLimitInfoByPage', [start, limit]);
}

//搜索文档下载限制信息
export function searchDocDownloadLimitInfoByPage(searchKey: string, start: number, limit: number): PromiseLike<Array<Core.DownloadLimit.ncTDocDownloadLimitInfo>> {
    return ShareMgnt('Usrm_SearchDocDownloadLimitInfoByPage', [searchKey, start, limit]);
}

//搜索文档下载限制信息总数
export function searchDocDownloadLimitInfoCnt(searchKey: string): PromiseLike<number> {
    return ShareMgnt('Usrm_SearchDocDownloadLimitInfoCnt', [searchKey]);
}