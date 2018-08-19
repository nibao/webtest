import { clientAPI } from '../../../clientapi/clientapi';

/**
 * 通过相对路径获取缓存信息
 * @param param0 参数对象
 * @param param0.relPath 相对路径
 */
export const getInfoByPath: Core.APIs.Client.Cache.GetInfoByPath = function ({ relPath }) {
    return clientAPI('cache', 'GetInfoByPath', { relPath });
}

/**
 * 通过绝对路径获取未同步任务
 * @param absPath 绝对路径 
 * @param countLimit 获取最大限制数 
 */
export const getUnsyncLog: Core.APIs.Client.Cache.GetUnsyncLog = function ({ absPath, countLimit }) {
    return clientAPI('cache', 'GetUnsyncLog', { absPath, countLimit });
}

/**
 * 获取某个路径下的未同步文档个数
 * @param relPath 相对路径 
 */
export const getUnsyncLogNum: Core.APIs.Client.Cache.GetUnsyncLogNum = function ({ absPath }) {
    return clientAPI('cache', 'GetUnsyncLogNum', { absPath });
}



