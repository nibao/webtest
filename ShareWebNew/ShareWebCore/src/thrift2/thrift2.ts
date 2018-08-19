import { merge } from 'lodash';
import { evaluate } from '../../util/accessor/accessor';
import thrift from '../../libs/thrift';
import '../../gen-js/EThriftException_types';
import '../../gen-js/ECMSManager_types';
import '../../gen-js/ShareMgnt_types';
import '../../gen-js/ShareSite_types';
import '../../gen-js/ECMSAgent_types';
import '../../gen-js/ECMSUpgrade_types';
import '../../gen-js/EThriftException_types';
import '../../gen-js/EKeyScanMonitor_types';
import '../../gen-js/EInfoworksLogger_types';
import '../../gen-js/ECNJY_types';
import '../../gen-js/EFAST_types';
import '../../gen-js/EOFS_types';
import '../../gen-js/EVFS_types';
import '../../gen-js/ESearchMgnt_types';
import '../../gen-js/EACPLog_types';
import '../../gen-js/ncTECMSManager';
import '../../gen-js/ncTShareMgnt';
import '../../gen-js/ncTShareSite';
import '../../gen-js/ncTEVFS';
import '../../gen-js/ncTESearchMgnt';
import '../../gen-js/ncTEACPLog';
import '../../gen-js/ncTECMSUpgradeManager'


/**
 * 可配置参数
 */
interface Settings {
    proxyTemplate?: string;

    CSRFToken?: () => string | string;

    onNetworkError?: Function;
}

/**
 * 全局配置项
 */
const Config: Settings = {
    proxyTemplate: '/api/{module}',

    CSRFToken: undefined
}

/**
 * 配置Thrift
 * @param param0 配置参数
 */
export function setup({ proxyTemplate, CSRFToken }: Settings) {
    merge(Config, { proxyTemplate, CSRFToken })
}

/**
 * Thrift具体接口调用方法
 * @param ...params 调用thrift接口的参数
 */
type ThriftMethod = ([...params]?: any) => Promise<any>;

/**
 * Thrift客户端
 */
interface ThriftClient {
    /**
     * Thrift具体接口调用方法
     */
    [method: string]: ThriftMethod;
}

/**
 * Thrift模块
 */
type ThriftModule = (options?: { ip?: string; timeout?: number }) => ThriftClient

/**
 * Thrift模块工厂函数
 * @param module 模块名，用作server路由匹配
 * @param client gen-js导入的模块Client
 * @return 返回封装好的Thrift模块
 * @usage
 * ```js
 * const ECMS = ThriftModuleFactory('ECMSManager', ncTECMSManagerClient)
 * const ecms = ECMS({ip: '192.168.138.37'});
 * const result = await ecms.get_sys_status();
 * ```
 */
type ThriftModuleFactory = (module: string, client: any) => ThriftModule;

const ThriftModuleFactory: ThriftModuleFactory = (module, client) => {
    const url = Config.proxyTemplate.replace('{module}', module);

    return function (options?) {
        return new ThriftClient(url, client, options)
    }
}

class ThriftClient implements ThriftClient {
    constructor(url, client, { ip = '127.0.0.1' } = {}) {
        this.client = client;
        for (const method in client.prototype) {
            this[method] = function (...params): ThriftMethod {
                const transport = new thrift.TXHRTransport(url, {
                    customHeaders: {
                        'x-tclient-addr': ip,
                        'X-CSRFToken': evaluate(Config.CSRFToken)
                    }
                });
                const protocol = new thrift.TJSONProtocol(transport);
                const client = new this.client(protocol);

                return new Promise((resolve, reject) => {
                    const args = [...params, (res) => {
                        if (res instanceof ncTException) {
                            return reject(res)
                        } else if (typeof (res) === 'object' && res.code !== 'undefined' && res.code === 0) {
                            // thrift接口连接错误,构造一个类似ncTException的对象，返回res.message
                            return reject({ expMsg: res.message })
                        } else {
                            return resolve(res)
                        }
                    }]
                    client[method].call(client, ...args)
                })

            }
        }
    }
}

export const createShareMgntClient = ThriftModuleFactory('ShareMgnt', ncTShareMgntClient);
export const createECMSManagerClient = ThriftModuleFactory('ECMSManager', ncTECMSManagerClient);
export const createShareSiteClient = ThriftModuleFactory('ShareSite', ncTShareSiteClient);
export const createEVFSClient = ThriftModuleFactory('EVFS', ncTEVFSClient);
export const createESearchMgntClient = ThriftModuleFactory('ESearchMgnt', ncTESearchMgntClient);
export const createEACPLogClient = ThriftModuleFactory('EACPLog', ncTEACPLogClient);
export const createECMSUpgradeClient = ThriftModuleFactory('ECMSUpgrade', ncTECMSUpgradeManagerClient);

export const ShareMgntClient = createShareMgntClient();
export const ECMSManagerClient = createECMSManagerClient();
export const ShareSiteClient = createShareSiteClient();
export const EVFSClient = createEVFSClient();
export const ESearchMgntClient = createESearchMgntClient();
export const EACPLogClient = createEACPLogClient();
export const ECMSUpgradeClient = createECMSUpgradeClient();
