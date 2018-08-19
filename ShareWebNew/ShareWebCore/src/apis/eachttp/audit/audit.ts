import { eachttp } from '../../../openapi/openapi';

/**
 * 获取我的共享申请
 */
export const getApplys: Core.APIs.EACHTTP.Audit.GetApplys = function ({ } = {}, options?) {
    return eachttp('audit', 'getapplys', {}, options);
}

/**
 * 获取待审核的共享申请
 */
export const getPendingApprovals: Core.APIs.EACHTTP.Audit.GetPendingApprovals = function ({ } = {}, options?) {
    return eachttp('audit', 'getpendingapprovals', {}, options);
}

/**
 * 获取待审核的共享申请数(只针对特定客户有效，数据库中用户名需要有后缀：@csic719.net)
 */
export const getPendingApprovalsCount: Core.APIs.EACHTTP.Audit.GetPendingApprovalsCount = function ({ } = {}, options?) {
    return eachttp('audit', 'getpendingapprovalscount', {}, options);
}

/**
 *获取待审流程信息
 */
export const getDocApprovals: Core.APIs.EACHTTP.Audit.GetDocApprovals = function ({ } = {}, options?) {
    return eachttp('audit', 'getdocapprovals', {}, options);
}

/**
 *获取所有流程信息
 */
export const getDocProcesses: Core.APIs.EACHTTP.Audit.GetDocProcesses = function ({ } = {}, options?) {
    return eachttp('audit', 'getdocprocesses', {}, options);
}

/**
 *发起流程申请
 */
export const publishDoc: Core.APIs.EACHTTP.Audit.PublishDoc = function ({ processid, docid, applymsg, dstdocname }, options?) {
    return eachttp('audit', 'publishdoc', { processid, docid, applymsg, dstdocname }, options);
}

/**
 *获取申请中的流程信息
 */
export const getDocApplys: Core.APIs.EACHTTP.Audit.GetDocApplys = function ({ } = {}, options?) {
    return eachttp('audit', 'getdocapplys', {}, options);
}

/**
 *获取流程申请历史总数量
 */
export const getApplyHistoryCount: Core.APIs.EACHTTP.Audit.GetApplyHistoryCount = function ({ } = {}, options?) {
    return eachttp('audit', 'getapplyhistorycount', {}, options);
}

/**
 *获取流程申请历史
 */
export const getApplyHistory: Core.APIs.EACHTTP.Audit.GetApplyHistory = function ({ start, limit }, options?) {
    return eachttp('audit', 'getapplyhistory', { start, limit }, options);
}

/**
 *获取流程审核历史总数量
 */
export const getApproveHistoryCount: Core.APIs.EACHTTP.Audit.GetApproveHistoryCount = function ({ } = {}, options?) {
    return eachttp('audit', 'getapprovehistorycount', {}, options);
}

/**
 *获取流程审核历史
 */
export const getApproveHistory: Core.APIs.EACHTTP.Audit.GetApproveHistory = function ({ start, limit }, options?) {
    return eachttp('audit', 'getapprovehistory', { start, limit }, options);
}

/**
 *获取共享申请历史数量
 */
export const getShareApplyHistoryCount: Core.APIs.EACHTTP.Audit.GetShareApplyHistoryCount = function ({ } = {}, options?) {
    return eachttp('audit', 'getshareapplyhistorycount', {}, options);
}

/**
 *获取共享申请历史
 */
export const getShareApplyHistory: Core.APIs.EACHTTP.Audit.GetShareApplyHistory = function ({ start, limit }, options?) {
    return eachttp('audit', 'getshareapplyhistory', { start, limit }, options);
}

/**
 *获取共享审核历史数
 */
export const getShareApproveHistoryCount: Core.APIs.EACHTTP.Audit.GetShareApproveHistoryCount = function ({ } = {}, options?) {
    return eachttp('audit', 'getshareapprovehistorycount', {}, options);
}

/**
 *获取共享审核历史
 */
export const getShareApproveHistory: Core.APIs.EACHTTP.Audit.GetShareApproveHistory = function ({ start, limit }, options?) {
    return eachttp('audit', 'getshareapprovehistory', { start, limit }, options);
}

/**
 * 共享审核
 */
export const approve: Core.APIs.EACHTTP.Audit.Approve = function (applyid: string, result: boolean, msg: string, options?) {
    return eachttp('audit', 'approve', {applyid, result, msg}, options);
}

/**
 * 流程审核
 */
export const approveDoc: Core.APIs.EACHTTP.Audit.ApproveDoc = function (applyid: string, result: boolean, msg: string, options?) {
    return eachttp('audit', 'approvedoc', {applyid, result, msg}, options);
}

/**
 * 获取待审核的条目
 */
export const getpendingapprovalscounts: Core.APIs.EACHTTP.Audit.Getpendingapprovalscounts = function ({ } = {}, options?) {
    return eachttp('audit', 'getpendingapprovalscounts', {}, options);
}
