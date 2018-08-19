import { merge, isFunction } from 'lodash';
import { post } from '../../util/http/http';
import { currify } from '../../util/currify/currify';
import { evaluate } from '../../util/accessor/accessor';

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
    proxyTemplate: '/api/{module}/{method}',

    CSRFToken: undefined
}

/**
 * 获取配置参数
 * @param option 要获取的配置参数
 */
export function getConfig(option?: string): any {
    return option === void (0) ? Config : evaluate(Config[option]);
}

/**
 * 配置Thrift
 * @param param0 配置参数
 */
export function setup({ proxyTemplate, CSRFToken }: Settings) {
    merge(Config, { proxyTemplate, CSRFToken })

}

/**
 * thrift协议代理
 * @param module 模块名
 * @param method 方法名
 * @param params 参数，按顺序传递
 */
function thrift(module: string, method: string, params: Array<any> = [], { ip= '127.0.0.1', timeout = 60 * 1000 } = {}): Promise<any> {
    const url = Config.proxyTemplate.replace('{module}', module).replace('{method}', method);

    return post(url, params, { sendAs: 'json', readAs: 'json', timeout, headers: { 'x-tclient-addr': ip, 'X-CSRFToken': evaluate(Config.CSRFToken) } }).then(({ response, status }) => {
        if (status >= 400) {
            return Promise.reject(response);
        } else {
            return Promise.resolve(response);
        }
    }, ex => {
        isFunction(Config.onNetworkError) && Config.onNetworkError();

        return Promise.reject(ex);
    });
}

export const ShareMgnt = currify(thrift, 'ShareMgnt');
export const EACP = currify(thrift, 'EACP');
export const EVFS = currify(thrift, 'EVFS');
export const ESearchMgnt = currify(thrift, 'ESearchMgnt');
export const ShareSite = currify(thrift, 'ShareSite');
export const SysAgent = currify(thrift, 'SysAgent');
export const ECMSManager = currify(thrift, 'ECMSManager');
export const EACPLog = currify(thrift, 'EACPLog');
