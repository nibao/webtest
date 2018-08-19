/**
 * 文件操作时间类型
 */
export enum DateType {
    /**
     * 不限
     */
    UNLIMITED,

    /**
     * 创建时间
     */
    CREATED,

    /**
     * 修改时间
     */
    MODIFIED
}

/**
 * 菜单时间类型
 */
export enum TimeType {
    /**
     * 秒
     */
    SECONDS,

    /**
     * 分钟
     */
    MINUTES,

    /**
     * 小时
     */
    HOURS
}

/**
 * 分享类型
 */
export enum ShareType {
    /**
     * 无
     */
    NOOP,

    /**
     * 外链
     */
    LINKSHARE,

    /**
     * 内链
     */
    SHARE
}

/**
 * 错误信息
 */
export enum ErrorType {
    /**
     * 无错误
     */
    NULL

}
