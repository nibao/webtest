/**
 * 还原/删除隔离区文件错误场景
 */
export enum CASE {
    // 文档库配额不足
    QUOTAS_INSUFFICIENT = 10019,

    // 管理对象不存在
    CID_OBJECT_NOT_EXIST = 10041,

    // gns對象不存在
    GNS_OBJECT_NOT_EXIST = 10042,

    // 文件不存在
    ILLEGALDOC_NOT_EXIST = 10001

};

/**
 * 审核意见
 */
export enum ApprovalStatus {
    // 同意还原
    Approval,

    // 否决
    Rejection
}