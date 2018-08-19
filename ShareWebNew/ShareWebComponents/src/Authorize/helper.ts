export enum AuthorizeStatus {
    // 密码已失效
    EXPIRED_PASSWORD = 401012,

    // 密码系数过低
    LOW_PASSWORD = 401013,

    // 初始密码登录
    ORGIN_PASSWORD = 401017
}