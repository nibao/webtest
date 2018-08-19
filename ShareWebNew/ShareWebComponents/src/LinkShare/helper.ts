
/**
 * 外链开启／关闭状态
 */
export enum Status {
    /**
     * 外链已开启
     */
    OPEN,

    /**
     * 外链已关闭
     */
    CLOSED
}

export enum ReqStatus {
    /**
     * 无异常
     */
    OK,

    /**
     * 准备状态
     */
    PENDDING,
}

export enum ErrorStatus {
    /**
     * 无异常
     */
    OK,

    /**
     * 管理员限制了必需输入访问次数
     */
    AccessTimesMissing,

    /**
     * 没有可配置的文件权限
     */
    PermInvalid,
}