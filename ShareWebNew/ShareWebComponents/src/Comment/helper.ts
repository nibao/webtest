export enum Status{
    NORMAL,
    WARNING,
    CONFIRM_DELETE_COMMENT
}

export enum Mode{
    /**
     * 禁用评分和评论
     */
    DISABLE = 0,

    /**
     * 仅启用评论
     */
    ENABLE_COMMENT = 1,

    /**
     * 仅启用评分
     */
    ENABLE_RATE = 2,

    /**
     * 启用评分和评论
     */
    ENABLE_BOTH = 3
}