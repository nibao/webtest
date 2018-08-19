import __ from './locale';

/**
 * 等待提示类别
 */
export enum LoadingStatus {
    NOVISIBLE,                   // 不可见
    LOADING,                     // 正在加载
}

/**
 * 错误信息类别
 */
export enum ErrorStatus {
    NOVISIBLE,                   // 不可见
    UNACCESS_SETTING,            // 测试配置不可用
    SAVE_FAILED                  // 保存失败
}

/**
 * 验证状态
 */
export enum ValidateState {
    Normal,
    InvalidPort,
}

/**
 * 验证提示信息
 */
export const ValidateMessages = {
    [ValidateState.InvalidPort]: __('端口号必须是 1~65535 之间的整数，请重新输入')
}

/**
 * 存储模式
 */
export enum StorageMode {
    ASU,                        // 本地ASU存储
    SWIFT,                      // 本地Swift存储
    THIRD                       // 第三方存储
}