/**
 * 文档状态
 */
export enum Status {
    // 默认状态
    PENDING,
    
    // 正在获取
    FETCHING,

    // 获取成功
    OK,

    // 浏览器不支持
    BROWSER_INCOMPATIABLE,

    // 需要密码
    PASSWORD_REQUIRED,

    // 格式错误
    INVALID_FORMAT,

    // 预览失败
    FAILED,

    // 没有预览权限
    NO_PERMISSION = 403002,

    // 外链密码不正确
    LINK_PWD_ERROR = 401002,

    // 添加水印失败
    WATERMARKING_FAILED = 403170,

    // 正在制作水印
    MAKING_WATERMARK = 503005,

    // 密级不足
    SECURITY_LOWER = 403065,

    // 文件不存在
    GNS_NOT_EXIST = 404006,

    // CAD预览
    CADPreview
}