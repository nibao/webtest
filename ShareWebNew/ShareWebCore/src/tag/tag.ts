import __ from './locale'

export enum ReqStatus {
    /**
     * 准备状态
     */
    Pending = 1,

    /**
     * 无异常
     */
    OK
}

/**
 * 检测字符串中是否含有 # \ / : * ? " < > | 非法字符
 */
export function testIllegalCharacter(value: string): boolean {
    return /[#\\/:*?"<>|]/.test(value)
}

export enum ErrorCode {
    FileNotExist = 404006,                // 文件不存在
    NO_EDIT_PERMISSION = 403002,          // 没有修改权限
    TAGS_REACH_UPPER_LIMIT = 403092,      // 标签个数达到上限
    LACK_OF_CSF = 403065,                 // 密级不足
    ILLEGAL_CHARACTER = 10,               // 非法字符
}

/**
 * 获取对应的errormessage
 */
export function getErrorMessage(errcode: number, maxTagsNumber?: number): string {
    switch (errcode) {
        case ErrorCode.FileNotExist: {
            return __('请求的文件不存在。')
        }
        case ErrorCode.NO_EDIT_PERMISSION: {
            return __('您对选中的文件没有修改权限。')
        }
        case ErrorCode.LACK_OF_CSF: {
            return __('您对选中的文件密级不足。')
        }
        case ErrorCode.TAGS_REACH_UPPER_LIMIT: {
            return __('最多可添加${maxTagNum}个标签。', { maxTagNum: maxTagsNumber })
        }
        case ErrorCode.ILLEGAL_CHARACTER: {
            return __('标签名不能包含 # \\ / : * ? " < > | 特殊字符。')
        }
        default: {
            return '';
        }
    }
}