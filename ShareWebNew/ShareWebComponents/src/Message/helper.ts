
/**
 * 审核模式
 */
export enum Audittype {
    //同级审核
    ONE = 1,
    //汇签审核
    ALL = 2,
    //逐级审核
    LEVEL = 3

}

/**
 * 消息显示分类
 */
export enum MsgshowMode {
    //全部消息
    ALL = 1,
    //未读消息
    UNREAD = 2,
    //已读消息
    READ = 3
}