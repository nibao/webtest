/**
 * 操作类型
 */
export enum OperationType {
    /**
     * 无操作
     */
    NOOP,
    /**
     * 查看大小
     */
    VIEWSIZE,
    /**
     * 设置回收站策略
     */
    STORATEGY,
    /**
     * 删除文档
     */
    DELETE,
    /**
     * 清空回收站
     */
    EMPTY,
    /**
     * 还原
     */
    RESTORE

}
