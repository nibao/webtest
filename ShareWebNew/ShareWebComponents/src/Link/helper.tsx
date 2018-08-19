/**
 * 外链状态
 */
export enum Status {
    // 外链有效且密码正确
    OK,

    // 密码不正确
    PASSWORD_INVALID = 401002,

    // 外链已失效
    EXPIRED = 404008,

    // 外链达到上限
    LIMITED,

    // 需要密码
    NEED_PASSWORD,

    // 没有输入密码
    NO_PASSWORD
}