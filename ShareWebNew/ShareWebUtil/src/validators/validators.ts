/**
 * 验证数字
 * @params input 输入值
 * @return 返回是否是数字
 */
export function number(input: any): boolean {
    return /^[\-]?[0-9]+(\.[0-9])?$/.test(String(input));
}

/**
 * 验证自然数
 * @params input 输入值
 * @return 返回是否是自然数
 */
export function natural(input: any): boolean {
    return /^[0-9]+$/.test(String(input));
}

/**
 * 验证正数（包括0）
 * @params input 输入值
 * @return 返回是否是正数
 */
export function positive(input: any): boolean {
    return /^[0-9]+(\.[0-9]+)?$/.test(String(input));
}

/**
 * 验证正整数
 * @params input 输入值
 * @return 返回是否是正整数
 */
export function positiveInteger(input: any): boolean {
    return /^[1-9]\d*$/.test(String(input));
}

/**
 * 验证邮箱
 * @params input 输入值
 * @return 返回是否是邮箱
 */
export function mail(input: any): boolean {
    return /^[\w\-]+(\.[\w\-]+)*@[\w\-]+(\.[\w\-]+)+$/.test(input);
}

/**
 * 验证是否是时间
 * @params input 输入值
 * @return 返回是否是时间
 */
export function clock(input: any): boolean {
    return natural(input) && input < 60;
}
/***
 * 验证是否超过字数限制
 * @params input 输入值
 * @return 是否超出限制 
 */
export function tweet(value: any) {
    return value.length <= 140;
}

/**
 * 限制输入最大长度
 * @params input 输入值
 * @return 是否超出限制 
 */
export function maxLength(maxLength: number, trim: boolean = true) {
    return function (input) {
        input = String(input);
        return (trim ? input.trim() : input).length <= maxLength;
    }
}

/**
 * 限制输入范围(自然数)
 */
export function range(from: number, to: number) {
    return function (input) {
        return natural(input) && input >= from && input <= to;
    }
}

/**
 * 颜色
 */
export function validateColor(input: string | number) {
    return /^#?[0-9A-Fa-f]{6}$/.test(String(input))
}

/**
 * 子网掩码
 */
export function subNetMask(input: string | number) {
    return !!String(input) && /^((128|192|224|240|248|252|254|255)\.0\.0\.0)|(255\.(((0|128|192|224|240|248|252|254|255)\.0\.0)|(255\.(((0|128|192|224|240|248|252|254|255)\.0)|255\.(0|128|192|224|240|248|252|254|255)))))$/.test(String(input))
}

/**
 * IP
 */
export function IP(input: string | number) {
    return !!String(input) && /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(String(input))
}

/**
 * 验证正整数并且有位数限制
 * @params input 输入值
 * @return 返回是否是正整数
 */
export function positiveIntegerAndMaxLength(maxLength: number) {
    return function (input) {
        input = String(input);
        return positiveInteger(input) && input.length <= maxLength;
    }
}

/**
 * 验证邮箱格式并且有长度限制
 * @params input 输入值
 * @return 返回是否是正整数
 */
export function mailAndLenth(input, minLength, maxLength): boolean {
    return /^[\w\-]+(\.[\w\-]+)*@[\w\-]+(\.[\w\-]+)+$/.test(input) && minLength < input.length && maxLength > input.length;

}


export function isURL(str) {
    const urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$'
    const url = new RegExp(urlRegex, 'i')
    return str.length < 2083 && url.test(str);
}

/**
 * 匹配域名
 * @params input 输入值 (只能包含 英文、数字 及 -. 字符，长度范围 3~100 个字符)
 */
export function isDomain(input): boolean {
    return /^[a-zA-Z0-9\-(\.)?]+([a-zA-Z])+$/.test(input) && input.length >= 3 && input.length <= 100;
}

/**
 * 验证Mac地址
 * @export
 * @param {string} input 输入值（只能是由6组数字和字母（不区分大小写），每组一个数字一个字母组成，并且组与组之间使用-进行连接）
 * @returns {boolean} 
 */
export function isMac(input: string): boolean {
    return /^[A-Fa-f0-9]{2}(\-[A-Fa-f0-9]{2}){5}$/.test(input);
}

/**
 * 验证文件后缀是否正确
 * @export
 * @param {string} input 输入值（不允许包含.\|/*?"<>:）
 * @returns {boolean} 
 */
export function isSuffix(input: string): boolean {
    return /^\.([^\.\\\|\/\*\?"<>:])+$/.test(input);
}

/**
 * 匹配英文和数字
 */
export function isLetterOrNumber(input: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(input);
}

/*
 * 验证文本输入
 */
export function isUserName(input: string) {
    return /^[^\/\\:*?"<>|\s]+$/.test(input);
}

/**
 * 验证授权码格式
 * @params input 输入值 且每段子码位数为 5，只能包含数字和大写字母
 * @return 返回是否是正整数
 */
export function validLicense(input): boolean {
    return /^[A-Z0-9]{5}(\-[A-Z0-9]{5}){5}$/.test(input);

}

/**
 * 验证激活码格式
 * @params input 输入值 只包含数字和大写字母
 * @return 返回是否是正整数
 */
export function validActiveCode(input): boolean {
    return /^[A-Z0-9]+$/.test(input);
}

/*
 * 限制输入范围(自然数)
 * @param value 输入电话号码
 * @returns boolean 符合格式为真
 */
export function cellphone(value) {
    return /^[\d]{11}$/i.test(value)
}

/**
 * 验证正数（包括0）
 * @params input 输入值支持小数
 * @return 返回是否是正数
 */
export function decimal(input: any): boolean {
    return /^[0-9]+(\.[0-9]{0,2})?$/.test(String(input));
}
