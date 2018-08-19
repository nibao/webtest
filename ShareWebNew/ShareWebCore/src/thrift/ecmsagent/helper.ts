/**
 * 服务状态
 */
export const enum ncTServiceStatus {
    SS_STOPPED = 0,                     // 服务已停止
    SS_STARTED = 1,                     // 服务已启动
    SS_OTHER = 2,                       // 其他，比如部分停止
}