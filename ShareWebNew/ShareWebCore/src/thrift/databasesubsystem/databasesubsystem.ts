/// <reference path="./databasesubsystem.d.ts" />
import { ECMSManager } from '../thrift';

/**
 * 判断数据库是否配置为第三方数据库
 */
export function isExternalDBOfApp({ }): PromiseLike<boolean> {
    return ECMSManager('is_external_db_of_app', {});
}

/**
 * 测试第三方数据库
 */
export function isAvailableExternalDB(info: Core.DatabaseSubsystem.ncTExternalDBInfo): PromiseLike<boolean> {
    return ECMSManager('is_available_external_db', { info });
}

/**
 * 更新第三方数据库
 * @param info 
 */
export function updateExternalDBOfApp(info: Core.DatabaseSubsystem.ncTExternalDBInfo): PromiseLike<void> {
    return ECMSManager('update_external_db_info_of_app', { info });
}

/**
 * 获取第三方数据库
 * @param info 
 */
export function getExternalDBInfo({ }): PromiseLike<Core.DatabaseSubsystem.ncTExternalDBInfo> {
    return ECMSManager('get_external_db_info_of_app', {});
}