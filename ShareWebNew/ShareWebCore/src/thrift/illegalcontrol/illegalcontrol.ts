import { EVFS, ShareMgnt } from '../thrift';

/**
 * 隔离区文件类型
 */
export enum QuarantineState {
    /**
     * 所有文件
     */
    ALL = 1,

    /**
     * 只看申诉文件
     */
    APPEAL = 2,
}

/**
 * 列举隔离区文件
 */
export function getIllegalFileList(ncTFiltrationParam: Core.IllegalControl.FiltrationParam, start: number, limit: number): PromiseLike<Array<Core.IllegalControl.IllegalFileInfo>> {
    return EVFS('GetIllegalFileList', [{ 'ncTFiltrationParam': ncTFiltrationParam }, start, limit]);
}

/**
 * 根据文件docid获取文件在隔离区中的版本
 */
export function getFileVersionList(docid: string, key: string): PromiseLike<Array<Core.IllegalControl.IllegalFileInfo>> {
    return EVFS('GetFileVersionList', [docid, key]);
}

/**
 * 获取非法隔离区文件数量
 */
export function getIllegalFileCount(ncTFiltrationParam: Core.IllegalControl.FiltrationParam): PromiseLike<number> {
    return EVFS('GetIllegalFileCount', [{ 'ncTFiltrationParam': ncTFiltrationParam }]);
}

/**
 * 下载隔离区文件, 使用与openApI中接口相同
 */
export function oSDownload(gns: string, versionId: string, name: string): PromiseLike<Core.IllegalControl.OSDowndloadRetParam> {
    return Promise.all([ShareMgnt('GetGlobalConsoleHttpsStatus'), ShareMgnt('GetHostName')]).then(([usehttps, reqHost]) => {
        return EVFS('OSDownload', [gns, versionId, 'QUERY_STRING', reqHost, usehttps, name]).then(({ auth_request: [, url] }) => {
            window.location.assign(url);
        })
    })
}

/**
 * 还原隔离区文件
 * @param ondup:1:检查是否重命名，重名则抛异常,2:如果重名冲突，自动重名
 * 返回值为重命名之后的名字
 */
export function restoreQuarantineFile(gns: string, ondup: number): PromiseLike<string> {
    return EVFS('RestoreQuarantineFile', [gns, ondup]);
}

/**
 * 删除隔离区文件
 */
export function deleteQuarantineFile(gns: string): PromiseLike<void> {
    return EVFS('DeleteQuarantineFile', [gns]);
}

/**
 * 审核申诉
 * @param ondup:
 * 1:检查是否重命名，重名则抛异常
 * 2:如果重名冲突，自动重名
 * 返回值为重命名之后的名字
 */
export function qRTAppealApproval(docid: string, approvalResult: boolean, ondup: number): PromiseLike<string> {
    return EVFS('QRT_AppealApproval', [docid, approvalResult, ondup]);
}

/**
 * 构建下载词库url
 */
export function buildDownloadDictHref(name: string, dictid?: string): PromiseLike<string> {
    return Promise.all([ShareMgnt('GetGlobalConsoleHttpsStatus'), ShareMgnt('GetHostName')]).then(([consoleHttps, hostName]) => {
        return `${consoleHttps ? 'https:' : 'http:'}//${hostName}:8000/interface/illegalcontrol/downloadict?name=${name}&id=${dictid ? dictid : 'default'}`
    })
}