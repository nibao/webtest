import { clientAPI } from '../../../clientapi/clientapi';

/**
 * 获取tokenid
 */
export const getTokenId: Core.APIs.Client.Tmp.GetTokenId = function () {
    return clientAPI('tmp', 'GetTokenId');
}

/**
 * 运行一个外部程序
 * @param url 任意链接地址
 */
export const defaultExecute: Core.APIs.Client.Tmp.DefaultExecute = function ({ url }) {
    return clientAPI('tmp', 'DefaultExecute', { url });
}

/**
 * 使用谷歌浏览器打开指定url
 * @param url 任意链接地址
 */
export const openUrlByChrome: Core.APIs.Client.Tmp.OpenUrlByChrome = function ({ url }) {
    return clientAPI('tmp', 'OpenUrlByChrome', { url });
}

/**
 * 设置剪贴板url
 */
export const setClipboard: Core.APIs.Client.Tmp.SetClipboard = function ({ url }) {
    return clientAPI('tmp', 'SetClipboard', { url });
}