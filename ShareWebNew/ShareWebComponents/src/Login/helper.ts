/**
 * 登录状态
 */
export enum Status {
    // 无异常
    NORMAL,

    // 无用户名
    NO_ACCOUNT,

    // 无密码
    NO_PASSWORD,

    // 客户端超时退出
    CLIENT_LOGOUT,

    // 验证码不存在
    NO_VCODE,

    // 初始密码登录
    ORGIN_PASSWORD = 401017,

    // 密码系数过低
    LOW_PASSWORD = 401013,

    // 密码已失效
    EXPIRED_PASSWORD = 401012,

    // 账号已被锁定
    ACCOUNT_LOCK = 401020,

    // 账号需要激活
    NEED_ACTION = 401040
}