import { get } from 'lodash';
import { getConfig as getAuthConfig } from '../apis/eachttp/auth1/auth1';
import { getHostInfo } from '../apis/eachttp/redirect/redirect';
import { queryString } from '../../util/http/http'

/**
 * 获取配置文件
 * @param [item] {string} 要获取的指定项，使用.进行深度搜索，如get('thirdauth.id')
 * @return {Promise} 返回item 值，如果未指定item ，则返回整个JSON对象
 */
export function getConfig(item?): Promise<Core.APIs.EACHTTP.Config | any> {
    return getAuthConfig().then(config => item !== undefined ? get(config, item) : config);
}

/**
 * 获取OEM配置
 * @param [item] {string} 返回指定项
 */
export function getOEMConfig(item?) {
    return getConfig('oemconfig').then((config = {}) => {
        return item !== undefined ? get(config, item) : config;
    });
}

/**
 * 获取第三方认证配置
 * @param [item] {string} 返回指定项
 */
export function getThirdAuth(item?) {
    return getConfig('thirdauth').then((config = {}) => {
        return item !== undefined ? get(config, item) : config;
    });
}

/**
 * 获取Web客户端访问端口
 */
export async function getWebClientHostInfo() {
    const [
        { https },
        { host, port, https_port }
    ] = await Promise.all([
        getConfig(),
        getHostInfo(),
    ])

    return {
        protocol: https ? 'https:' : 'http:',
        host,
        port: https ? https_port : port,
    }
}

/**
 * 构建Web客户端访问地址
 * @param param0 
 */
export async function buildWebClientURI({ path = '', query = {} }) {
    const { protocol, host, port } = await getWebClientHostInfo()
    const qs = queryString(query)

    return `${protocol}//${host}:${port}${path.startsWith('/') ? `${path}` : `/${path}`}?${qs}`
}