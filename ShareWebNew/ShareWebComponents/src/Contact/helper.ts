/**
 * 点击按钮事件
 */
export enum Action {
    /**
     * 无操作
     */
    NOOP,
    /**
     * 批量添加联系人
     */
    BATCHADD,
    /**
     * 添加单个联系人
     */
    SINGLEADD,
    /**
     * 创建联系人分组
     */
    CREATE,
    /**
     * 编辑联系人分组
     */
    EDIT,
    /**
     * 删除联系人分组
     */
    DELETE
}

/**
 * 警告状态
 */
export enum VerifyStatus {

    /**
     * 合法
     */
    Legal,

    /**
     * 非法
     */
    Illegal
}