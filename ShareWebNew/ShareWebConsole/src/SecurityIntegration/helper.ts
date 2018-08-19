export enum Status {
    // 验证合格
    OK,

    // 密码错误锁定次数超出范围
    COUNT_RANGE_ERROR,

    // 自定义密级名称含有特殊字符
    FORBIDDEN_SPECIAL_CHARACTER,

    //  密级个数超出限制
    SECU_OUT_SUM,

    // 密级名重名
    DUPLICATE_NAMES_ERROR,

    // 密级名为空
    EMPTY_NAME
}

/**
 * 验证自定义密级等级名称
 * @params input 输入值
 * @return 是否输入不合法
 */
export function customedSecuName(input: any): boolean {
    return /[\*\:\/\?\"\<\>\|]/.test(input);
}