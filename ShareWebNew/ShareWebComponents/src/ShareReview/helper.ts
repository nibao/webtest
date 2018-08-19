import { ReviewType, AppType, ApplyOpType } from '../../core/audit/audit';
import { CSFSYSID } from '../../core/csf/csf';
import { buildSelectionText, SharePermissionOptions, LinkSharePermissionOptions } from '../../core/permission/permission';
import { formatTime } from '../../util/formatters/formatters';
import __ from './locale';

export const ReviewStatus = {
    [ReviewType.ShareApvAll]: __('全部审核'),
    [ReviewType.ShareApvUnreview]: __('待审核'),
    [ReviewType.ShareApvReviewed]: __('已审核')
}

/**
 * 渲染密级
 * @export
 * @param {number} csf 密级值
 * @param {string} csfSysId 标密系统id
 * @param {Array<string>} csfTextArray 密级枚举数组
 * @returns {string}
 */
export function buildCSFInfo(csf: number, csfSysId: string, csfTextArray: Array<string>) {
    // 对接时代亿信标密系统
    if (csfSysId === CSFSYSID.SDYX) {
        return '---'
    } else {
        return csf === 0 ? '---' : csfTextArray[csf - 5] // 系统密级值从5开始
    }
}

/**
 * 渲染申请类型
 */
export function buildApplyType(type: number) {
    switch (type) {
        case AppType.InternalShare:
        case AppType.OwnerConfig:
            return __('内链共享')

        case AppType.ExternalShare:
            return __('外链共享')

        case AppType.SecurityLevelChange:
            return __('密级更改')
    }
}

/**
 * 获取最后一级文档名称或gns
 * @param fullpath 完整路径
 */
export function lastDoc(fullpath: string) {
    return fullpath.split(/[\/\\]{1,2}/).pop();
};

/**
 * 获取权限
 */
export function getPermission(applyInfo) {
    switch (applyInfo.apptype) {
        case AppType.InternalShare:
            return buildSelectionText(SharePermissionOptions, { allow: applyInfo.detail.allowvalue, deny: applyInfo.detail.denyvalue });
        case AppType.ExternalShare:
            return buildSelectionText(LinkSharePermissionOptions, { allow: applyInfo.detail.perm });
        case AppType.OwnerConfig:
            return buildSelectionText(SharePermissionOptions, { isowner: true });
    }

}

/**
 * 构造共享详情
 */
export function shareContent(applyInfo) {
    return {
        shareText: __('给${name}', { name: applyInfo.detail.accessorname }),
        permText: applyInfo.detail.optype === ApplyOpType.Delete ? 
        __('共享：${perm} 至：${time}', {
            perm: getPermission(applyInfo),
            time: (applyInfo.detail.endtime === -1 ? __('永久有效') : formatTime(applyInfo.detail.endtime / 1000)),
            name: applyInfo.detail.accessorname
        })
        :
        __(' 共享：${perm} 至：${time}', {
            perm: getPermission(applyInfo),
            time: (applyInfo.detail.endtime === -1 ? __('永久有效') : formatTime(applyInfo.detail.endtime / 1000)),
            name: applyInfo.detail.accessorname
        })
    }
}

/**
 * 右键菜单操作
 */
export enum ContextMenuOperation {
    /**
     * 下载
     */
    Download,

    /**
     * 审核
     */
    Review,

    /**
     * 刷新
     */
    Refresh
}