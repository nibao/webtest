/**
 * 外链开启／关闭状态
 */
export enum Status {
    // 外链已开启
    OPEN,

    // 外链已关闭
    CLOSED
}

/**
 * 上传图片的状态
 */
export enum UploadStatus {
    // 未上传图片
    NO_PICTURE,

    // 上传图片中
    UPLOADING_IMAGE,

    // 已上传图片 
    UPLOAD_COMPELETE
}

/**
 * 
 */
export enum ReqStatus {
    // 无异常
    OK,
    // 状态不确定
    PENDING,
    // 期限异常
    TIMEERROR,

    // 非所有者
    NOT_OWNER,

    // 没有权限
    NO_PERMISSION = 403003,

    // 超出内链模板可设定最大权限
    OVER_ALLOW_PERMS = 403146,

    // 超过内链模板可设定最大有效期
    OVER_MAX_EXPIRE_DAYS = 403147,

    // 用户被冻结
    USER_FREEZED = 403171,

    // 文档被冻结
    DOC_FREEZED = 403172

}