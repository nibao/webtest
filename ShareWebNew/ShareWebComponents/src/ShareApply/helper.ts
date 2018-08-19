import { buildSelectionText, LinkSharePermissionOptions, SharePermissionOptions } from '../../core/permission/permission';
import { formatTime } from '../../util/formatters/formatters';
import __ from './locale';

/**
 * 申请类型
 */
export enum REQUESTTYPE {
    // 全部申请
    ALL,

    // 待审核
    PENDING,

    // 已审核
    AUDITED,
}

/**
 * 审核状态
 */
export enum AUDITSTATUS {
    // 待审核
    PENDING,

    // 已通过
    PASSED,

    // 已否决
    VETOED,

    // 免审核
    FREEAUDIT,
}

/**
 * 根据type属性，展示相应的权限申请类型
 */
export function showType(type: number): string {
    switch (type) {
        case REQUESTTYPE.ALL:
            return __('全部申请');

        case REQUESTTYPE.PENDING:
            return __('待审核');

        case REQUESTTYPE.AUDITED:
            return __('已审核');
    }
}

/**
 * 根据apptype属性，展示相应的申请类型
 * @param apptype 
 */
export function convertAccessType(apptype: number): string {
    switch (apptype) {
        case 1:
        case 3:
            return __('内链共享');

        case 2:
            return __('外链共享');

        case 5:
            return __('密级更改');
    }
}

/**
 * 根据审核状态auditStatus属性，展示相应的审核状态
 * @param auditStatus 
 */
export function convertAuditStatus(auditStatus: number): string {
    switch (auditStatus) {
        case AUDITSTATUS.PENDING:
            return __('待审核');

        case AUDITSTATUS.PASSED:
            return __('已通过');

        case AUDITSTATUS.VETOED:
            return __('已否决');

        case AUDITSTATUS.FREEAUDIT:
            return __('免审核');
    }
}

/**
 * 根据apptype和detail属性，展示相应的申请内容
 * @param apptype 
 */
export function convertAccessContent(applyinfo, applyCsfName): string {
    const { apptype, detail } = applyinfo
    let accessContent = {}
    switch (apptype) {
        case 1:
            if (detail.optype === 3) {
                return accessContent = `${
                    __('给${accessorname}取消共享：${perm} 至：${time}', {
                        accessorname: detail.accessorname,
                        perm: buildSelectionText(SharePermissionOptions, { allow: detail.allowvalue, deny: detail.denyvalue, isowner: false }),
                        time: detail.endtime === -1 ? __('永久有效') : formatTime(detail.endtime / 1000),
                    })}`
            } else {
                return accessContent = `${
                    __('给${accessorname}共享：${perm} 至：${time}', {
                        accessorname: detail.accessorname,
                        perm: buildSelectionText(SharePermissionOptions, { allow: detail.allowvalue, deny: detail.denyvalue, isowner: false }),
                        time: detail.endtime === -1 ? __('永久有效') : formatTime(detail.endtime / 1000)
                    })}`
            }

        case 2:
            return accessContent = `${
                __('给外部用户共享：${perm} 至：${time} ${accessLimit}', {
                    perm: buildSelectionText(LinkSharePermissionOptions, { allow: detail.perm }),
                    time: detail.endtime === -1 ? __('永久有效') : formatTime(detail.endtime / 1000),
                    accessLimit: detail.accessLimit === -1 ? '' : detail.accessLimit === 1 ? __('限制打开次数：1次') : __('限制打开次数：${accessLimit}次', {
                        accessLimit: detail.accessLimit
                    })
                })}`

        case 3:
            if (detail.optype === 3) {
                return accessContent = `${
                    __('给${accessorname}取消共享：${perm} 至：${time}', {
                        accessorname: detail.accessorname,
                        perm: buildSelectionText(SharePermissionOptions, { allow: detail.allowvalue, deny: detail.denyvalue, isowner: true }),
                        time: detail.endtime === -1 ? __('永久有效') : formatTime(detail.endtime / 1000)
                    })}`
            } else {
                return accessContent = `${
                    __('给${accessorname}共享：${perm} 至：${time}', {
                        accessorname: detail.accessorname,
                        perm: buildSelectionText(SharePermissionOptions, { allow: detail.allowvalue, deny: detail.denyvalue, isowner: true }),
                        time: detail.endtime === -1 ? __('永久有效') : formatTime(detail.endtime / 1000)
                    })}`
            }

        case 5:
            return accessContent = `${
                __('将文件密级更改为：${applyCsfName}', {
                    applyCsfName: applyCsfName
                })}`
    }
}