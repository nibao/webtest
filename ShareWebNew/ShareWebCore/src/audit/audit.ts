import { getPendingApprovals, getShareApproveHistory, getDocApprovals, getApproveHistory, getpendingapprovalscounts } from '../apis/eachttp/audit/audit';

/**
 * 审核类型
 */
export enum ApprovalType {
    /**
     * 全部类型
     */
    All,
    /**
     * 共享审核
     */
    ShareReview,
    /**
     * 流程审核
     */
    FlowReview
}

/**
 * 审核信息筛选类型
 */
export enum ReviewType {
    /**
     * 全部共享审核
     */
    ShareApvAll,

    /**
     * 共享审核已审核
     */
    ShareApvReviewed,

    /**
     * 共享审核未审核
     */
    ShareApvUnreview,

    /**
     * 全部流程审核
     */
    FlowApvAll,

    /**
     * 流程审核未审核
     */
    FlowApvUnreview,

    /**
     * 流程审核已审核
     */
    FlowApvReviewed,

    /**
     * 所有待审核
     */
    AllUnreview
}

/**
 * 待审核数目
 */
let ApprovalsCounts = {
    /**
     * 全部数目
     */
    counts: 0,
    
    /**
     * 共享待审核数目
     */
    shareCounts: 0,

    /**
     * 流程待审核数目
     */
    flowCounts: 0
}

/**
 * 订阅回调列表
 */
let Handlers = [];

/**
 * 申请类型
 */
export enum AppType {
    /**
     * 共享申请
     */
    InternalShare = 1,

    /**
     * 外链申请
     */
    ExternalShare = 2,

    /**
     * 所有者申请
     */
    OwnerConfig = 3,

    /**
     * 密级更改
     */
    SecurityLevelChange = 5
}

export enum ApplyOpType {
    /**
     * 新增
     */
    Add = 1,

    /**
     * 编辑
     */
    Edit = 2,

    /**
     * 删除
     */
    Delete = 3
}

/**
 * 获取待审核数目
 */
export async function fetchApprovalsCounts() {
    const { counts, pemcount, docauditcount } = await getpendingapprovalscounts()

    ApprovalsCounts = {
        ...ApprovalsCounts,
        counts,
        shareCounts: pemcount,
        flowCounts: docauditcount
    }

    Handlers.forEach(handler => {
        handler.call(null, ApprovalsCounts)
    })
}

/**
 * 重置待审核数目
 */
export function resetApprovalsCounts() {
    ApprovalsCounts = {
        counts: 0,
        shareCounts: 0,
        flowCounts: 0
    }

    Handlers.forEach(handler => {
        handler.call(null, ApprovalsCounts)
    })
}

/**
 * 按照时间由近及远排序
 */
function sortApprovals(prev, last) {
    const prevDate = prev.createdate ? prev.createdate : prev.requestdate
    const lastDate = last.createdate ? last.createdate : last.requestdate

    return lastDate - prevDate
}

/**
 * 按类型获取待审核数目
 */
export function getApprovalsCountsByType(type) {
    switch (type) {
        case ReviewType.AllUnreview:
            return ApprovalsCounts.counts

        case ReviewType.ShareApvUnreview:
            return ApprovalsCounts.shareCounts

        case ReviewType.FlowApvUnreview:
            return ApprovalsCounts.flowCounts
    }
}

export async function getApprovalsData(type) {
    switch (type) {
        case ReviewType.ShareApvAll:
            // 按申请时间顺序由近及远排序
            const [pendingShareApprovals,
                shareApproveHistory
            ] = await Promise.all([
                getPendingApprovals(),
                getShareApproveHistory({ start: 0, limit: -1 })
            ])
            return [...pendingShareApprovals.applyinfos, ...shareApproveHistory.applyinfos].sort(sortApprovals)

        case ReviewType.FlowApvAll:
            // 按申请时间顺序由近及远排序
            const [pendingDocApprovals,
                docApproveHistory
            ] = await Promise.all([
                getDocApprovals(),
                getApproveHistory({ start: 0, limit: -1 })
            ])
            return [...pendingDocApprovals.applyinfos, ...docApproveHistory.applyinfos].sort(sortApprovals)
    }
}

/**
 * 订阅消息，返回取消订阅方法
 * @export
 * @param {any} callback 订阅回调函数
 * @returns 
 */
export function subscribe(callback) {
    Handlers = [...Handlers, callback]
    return function unsubscribe() {
        Handlers = Handlers.filter(handler => handler !== callback)
    }
}

/**
 * 流程审核模式
 */
export enum FlowAuditType {
    /**
     * 同级审核
     */
    ParallelApproval = 1,

    /**
     * 汇签审核
     */
    UnanimousApproval = 2,

    /**
     * 逐级审核
     */
    SerialApproval = 3
}