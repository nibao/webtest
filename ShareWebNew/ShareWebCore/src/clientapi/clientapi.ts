/**
 * 客户端接口模块
 */

import { isFunction, isString, isArray, pick, assign } from 'lodash';
import { access, evaluate } from '../../util/accessor/accessor';
import { post, joinURL } from '../../util/http/http';

interface Config {
    // 服务器地址
    host: string;

    // 网络错误时触发
    onNetworkError?: () => void;

    // 抛出逻辑异常时触发
    onException?: (ex) => void;
}

/**
 * OpenAPI配置
 */
const Config: Config = {
    host: `http://localhost:7001`
}

/**
 * 客户端API调用
 * @param resource 资源
 * @param method 方法 
 * @param body 请求体
 * @param options 可选参数 
 * @param options.readAs 返回数据的读取方式
 */
export const clientAPI: Core.ClientAPI.ClientAPI = function (resource: string, method: string, body, { readAs = 'json' } = {}) {
    const url = joinURL(`${Config.host}/${resource}`, { method });

    return post(url, body, { sendAs: 'json', readAs }).then(({ status, response }) => {
        if (status >= 400) {
            if (isFunction(Config.onException)) {
                Config.onException(response);
            }

            return Promise.reject(response);
        }
        else {
            return Promise.resolve(response);
        }
    }, ex => {
        isFunction(Config.onNetworkError) && Config.onNetworkError();

        return Promise.reject(ex);
    });
}

/**
 * 设置参数
 */
export function setup(...config: Array<Partial<Config>>) {
    access(Config, ...config)
}

/**
 * 获取OpenAPI配置
 * @param options 要获取的配置项，为空返回全部配置，传递字符串返回单个配置，传递数组返回配置对象
 * @description 如果options传递userid／tokenid，则返回evaluate的结果，其他配置项返回原值
 */
export function getConfig(options?: string | Array<string>): Config | any {
    // 不传递参数，返回所有配置
    if (!options) {
        return assign({}, Config);
    }
    // 传递数组返回配置对象
    else if (isArray(options)) {
        return assign({}, pick(Config, options))
    }
    // options 传递单个字符串，则返回单个配置
    else if (isString(options)) {
        return Config[options];
    }
}