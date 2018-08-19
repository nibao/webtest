import { isFunction } from 'lodash';
import { access } from '../../util/accessor/accessor';
import { ECMSManagerClient } from '../thrift2/thrift2';

const Config = {

}

export function setup(...config) {
    access(Config, ...config);
}

/**
 * 判断应用服务是否可用
 */
export async function appStatusReady() {
    // 获取应用系统主节点ip
    const appIp = await ECMSManagerClient.get_app_master_node_ip();

    if (appIp === '') {
        // 应用服务不可用
        if (isFunction(Config.onAppSysNotAvailable)) {
            Config.onAppSysNotAvailable();
        }
    }
    return appIp;  
}