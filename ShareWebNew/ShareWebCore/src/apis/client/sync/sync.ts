import { clientAPI } from '../../../clientapi/clientapi';

/**
 * 请求下载本地缓存文件
 * @param relPath 本地路径
 */
export const requestDownloadFile: Core.APIs.Client.Sync.RequestDownloadFile = function ({ relPath }) {
    return clientAPI('sync', 'RequestDownloadFile', { relPath });
}

/**
 * 请求下载本地缓存目录
 * @param relPath 本地路径
 */
export const requestDownloadDir: Core.APIs.Client.Sync.RequestDownloadDir = function ({ relPath }) {
    return clientAPI('sync', 'RequestDownloadDir', { relPath });
}

/**
 * 请求清除本地缓存目录
 * @param relPath 本地路径
 */
export const requestLocalCleanDir: Core.APIs.Client.Sync.RequestLocalCleanDir = function ({ relPath }) {
    return clientAPI('sync', 'RequestLocalCleanDir', { relPath });
}

/**
 * 请求清除本地缓存目录
 * @param relPath 本地路径
 */
export const requestLocalCleanFile: Core.APIs.Client.Sync.RequestLocalCleanFile = function ({ relPath }) {
    return clientAPI('sync', 'RequestLocalCleanFile', { relPath });
}

/**
 * 是否有同步任务
 * @param param0 
 */
export const hasSyncTask: Core.APIs.Client.Sync.HasSyncTask = function ({ } = {}) {
    return clientAPI('sync', 'HasSyncTask', {});
}

/**
 * 获取正在同步任务数
 * @param param0 
 */
export const getSyncTaskNum: Core.APIs.Client.Sync.GetSyncTaskNum = function ({ } = {}) {
    return clientAPI('sync', 'GetSyncTaskNum', {});
}

/**
 * 获取同步详情
 * @param begin 起始参数 end 最终参数 
 */
export const getSyncDetailByInterval: Core.APIs.Client.Sync.GetSyncDetailByInterval = function ({ begin, end }) {
    return clientAPI('sync', 'GetSyncDetailByInterval', { begin, end });
}

/**
 * 暂停某个同步任务通过任务id
 * @param taskId 任务id 
 */
export const pauseTaskById: Core.APIs.Client.Sync.PauseTaskById = function ({ taskId }) {
    return clientAPI('sync', 'PauseTaskById', { taskId });
}

/**
 * 取消某个同步任务通过任务id
 * @param taskId 任务id 
 */
export const cancelTaskById: Core.APIs.Client.Sync.CancelTaskById = function ({ taskId }) {
    return clientAPI('sync', 'CancelTaskById', { taskId });
}

/**
 * 恢复某个同步任务通过任务id
 * @param taskId 任务id 
 */
export const resumeTaskById: Core.APIs.Client.Sync.ResumeTaskById = function ({ taskId }) {
    return clientAPI('sync', 'ResumeTaskById', { taskId });
}

/**
 * 暂停所有同步任务
 * @param taskId 任务id 
 */
export const pauseAllTask: Core.APIs.Client.Sync.PauseAllTask = function ({ } = {}) {
    return clientAPI('sync', 'PauseAllTask', {});
}

/**
 *取消所有同步任务
 * @param taskId 任务id 
 */
export const cancelAllTask: Core.APIs.Client.Sync.CancelAllTask = function ({ } = {}) {
    return clientAPI('sync', 'CancelAllTask', {});
}

/**
 *恢复所有同步任务
 * @param taskId 任务id 
 */
export const resumeAllTask: Core.APIs.Client.Sync.ResumeAllTask = function ({ } = {}) {
    return clientAPI('sync', 'ResumeAllTask', {});
}

/**
 * 请求转移未同步文件
 * @param absPaths 未同步路径集合，为空表示转移所有未同步文件
 * @param dirPath 转移至目标目录
 */
export const requestTransferUnsync: Core.APIs.Client.Sync.RequestTransferUnsync = function ({ absPaths, dirPath }) {
    return clientAPI('sync', 'RequestTransferUnsync', { absPaths, dirPath });
}

/**
 * 请求上传未同步文件
 * @param absPaths 未同步路径集合，为空表示转移所有未同步文件
 * @param dirPath 转移至目标目录
 */
export const requestUploadUnsync: Core.APIs.Client.Sync.RequestUploadUnsync = function ({ absPaths }) {
    return clientAPI('sync', 'RequestUploadUnsync', { absPaths });
}