import { EACPLog } from '../thrift';


/**
 * 获取日志的条数
 * @param 
 */
export const getLogCount: Core.EACPLog.GetLogCount = function ([ncTGetLogCountParam]) {
    return EACPLog('GetLogCount', [{'ncTGetLogCountParam':ncTGetLogCountParam}])
}