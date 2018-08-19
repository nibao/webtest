export const enum ErrorCode {
    /**
     * 验证码过期
     */
    VcodeExpired = 20150,
    /**
     * 验证码输入错误
     */
    VcodeError = 20151,
    /**
     * 密码失效了
     */
    PwdInValid = 20127,
    /**
     * 密码安全系数过低
     */
    PwdUnSafe = 20128,
    /**
     * 密码已过期
     */
    PwdExpired = 20137,
    /**
     * 第一次输入密码错误
     */
    PwdFirstError = 20131,
    /**
     * 第二次输入密码错误
     */
    PwdSecError = 20132,
    /**
     * 账号被锁定
     */
    AccountLocked = 20130,
    /**
     * 连续3次输入错误密码
     */
    ContinuousErrPwd3Times = 20135,
    /**
     * 用户名或密码不正确
     */
    AccountOrPwdInError = 20108,
    /**
     * 输入错误次数超过限制
     */
    OverErrCount = 20143 | 20144,
    /**
     * 限速对象未设置
     */
    LimitRateObjectNotSet = 21901,
    /**
     * 该条限速配置不存在
     */
    LimitRateNotExist = 21902,
    /**
     * 限速值不合法
     */
    InvalidLimitRateValues = 21903,
    /**
     * 限速类型不合法
     */
    InvalidLimitRateType = 21904,
    /**
     * 只允许设置一个限速对象
     */
    OnlyOneLimitRateObject = 21905,
    /**
     * 用户已存在于列表中
     */
    LimitUserExist = 21906,
    /**
     * 部门已存在于列表中
     */
    LimitDepartExist = 21907,
    /**
     * 至少设置一种最大传输速度
     */
    AtLeastSetOneSpeed = 21908,

    /**
     * 普通用户登录控制台
     */
    LimitUserLogin = 20414
}