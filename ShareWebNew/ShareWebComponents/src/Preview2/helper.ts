export enum PreviewMethod {
    /**
     * 文档类预览
     */
    PDF,

    /**
     * CAD预览
     */
    CAD,

    /**
     * owa预览
     */
    OWA,

    /**
     * 视频预览
     */
    Video,

    /**
     * 音频播放
     */
    Audio,

    /**
     * 图片预览
     */
    Image,
}

/**
 * 文档状态
 */
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
     * 外链密码不正确
     */
    LinkPwdError = 401002,
}