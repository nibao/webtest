import __ from './locale';

/**
 * 登录验证结果
 */
export enum AuthResults {
    /**
     * 无异常
     */
    Normal,

    /**
     * 用户名或密码错误
     */
    UserOrPwdError,

    /**
     * 没有输入用户名
     */
    NoLoginName,

    /**
     * 没有输入密码
     */
    NoPassword,

    /**
     * 没有输入验证码
     */
    NoVcode,

    /**
     * 验证码过期
     */
    VcodeExpired,

    /**
     * 验证码输入错误
     */
    VcodeError,

    /**
     * 密码失效了
     */
    PwdInValid,

    /**
     * 密码安全系数过低
     */
    PwdUnSafe,

    /**
     * 密码已过期
     */
    PwdExpired,

    /**
     * 第一次输入密码错误
     */
    PwdFirstError,

    /**
     * 第二次输入密码错误
     */
    PwdSecError,

    /**
     * 账号被锁定
     */
    AccountLocked,

    /**
     * 连续3次输入错误密码
     */
    ContinuousErrPwd3Times,

    /**
     * 用户名或密码不正确
     */
    AccountOrPwdInError,

    /**
     * 输入错误次数超过限制且身份是admin
     */
    OverErrCount,

    /**
     * 输入错误次数超过限制
     */
    OverErrCountElse,

    /**
     * 登录用户非系统管理员
     */
    NotSystemAdmin,

    /**
     * 普通用户登录控制台
     */
    CommonUserLogin
}

/**
 * 输入框类型
 */
export enum InputType {
    LoginName,
    PassWord
}

/**
 * 登录状态
 */
export enum LoginStatus {
    /**
     * 就绪
     */
    Ready,

    /**
     * 加载中
     */
    Loading
}