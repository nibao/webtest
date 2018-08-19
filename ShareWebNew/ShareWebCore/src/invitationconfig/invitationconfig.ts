import { getHostInfo } from '../apis/eachttp/redirect/redirect';
import { getConfig } from '../config/config';

/**
 * 构建共享邀请链接
 * @export
 * @param {string} link 共享邀请链接后缀码 '72d45ee-d1e5-4159-af6e-a4283922c009'
 * @returns {PromiseLike<string>} 生成的共享邀请链接 Promist.resolve('http://192.168.138.30:80/invitation/d72d45ee-d1e5-4159-af6e-a4283922c009')
 * @example buildInvitationHref('72d45ee-d1e5-4159-af6e-a4283922c009')
 */
export function buildInvitationHref(link: string): PromiseLike<string> {
    return Promise.all([getConfig('https'), getHostInfo(null, )]).then(([https, ipInfo]) => {
        return `${https ? 'https' : 'http'}://${ipInfo.host}:${https ? ipInfo.https_port : ipInfo.port}/invitation/${link}`;
    })
}