import { clientAPI } from '../../../clientapi/clientapi';

/**
 * 获取同步日志通过日志唯一标示和日志类型
 * @param logType 同步日志类型
 * @param logId 同步日志唯一标示
 */
export const getSyncLogByIdAndType: Core.APIs.Client.Log.GetSyncLogByIdAndType = function ({ logType, logId }) {
    return clientAPI('cache', 'GetSyncLogByIdAndType', { logType, logId });
}

/**
 * 隐藏所有日志通过日志类型
 * @param logType 同步日志类型
 */
export const hideAllSyncLogByType: Core.APIs.Client.Log.HideAllSyncLogByType = function ({ logType }) {
    return clientAPI('cache', 'HideAllSyncLogByType', { logType });
}

/**
 * 隐藏同步日志通过日志id
 * @param logId 日志id
 */
export const hideSyncLogById: Core.APIs.Client.Log.HideSyncLogById = function ({ logId }) {
    return clientAPI('cache', 'HideSyncLogById', { logId });
}