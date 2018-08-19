/**
 * 表单状态
 */
export enum ErrorStatus {
    /**
     * 无错误
     */
    Normal,

    /**
     * 注册号为空
     */
    RegisterIdEmpty,

    /**
     * 身份证号为空
     */
    CertIdEmpty,

    /**
     * 真实姓名为空
     */
    RealNameEmpty,

    /**
     * 密码为空
     */
    PasswordEmpty,

    /**
     * 确认密码为空
     */
    PasswordConfirmEmpty,

    /**
     * 两次输入的密码不一致
     */
    PasswordDifferent,

    /**
     * 密码格式错误
     */
    PasswordFormErr,


};