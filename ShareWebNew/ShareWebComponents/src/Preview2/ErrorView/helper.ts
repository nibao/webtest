export enum ErrorCode {
    /**
     * 格式错误
     */
    InvalidFormat = -1,

    /**
     * 浏览器不支持
     */
    BrowserIncompatiable = -2,

    /**
     * 预览失败
     */
    Failed = 3,

    /**
     * 没有预览权限
     */
    NOPermission = 403002,

    /**
     * 外链密码不正确
     */
    LinkPwdError = 401002,

    /**
     * 添加水印失败
     */
    WatermarkingFailed = 403170,

    /**
     * 正在制作水印
     */
    MakingWatermark = 503005,

    /**
     * 密级不足
     */
    SecurityLower = 403065,

    /**
     * 文件不存在
     */
    GnsNotExist = 404006,

    /**
     * 没有权限执行此操作
     */
    PermissionRestricted = 403002
}