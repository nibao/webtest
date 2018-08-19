/**
 * 文档状态
 */
export enum Status {
    /**
     * 正在获取
     */
    Fetching = 1,

    /**
     * 获取成功
     */
    OK = 2,

    /**
     * 预览失败
     */
    Failed = 3,

    /**
     * 需要密码
     */
    PasswordRequired,
}