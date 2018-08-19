import { eachttp } from '../../../openapi/openapi';

/**
 * 获取文档发现状态
 */
export const getStatus: Core.APIs.EACHTTP.Finder.GetStatus = function ({ docid }, options?) {
    return eachttp('finder', 'getstatus', { docid }, options);
}

/**
 * 开启文档发现状态
 */
export const enable: Core.APIs.EACHTTP.Finder.Enable = function ({ docid }, options?) {
    return eachttp('finder', 'enable', { docid }, options);
}

/**
 * 关闭文档发现状态
 */
export const disable: Core.APIs.EACHTTP.Finder.Disable = function ({ docid }, options?) {
    return eachttp('finder', 'disable', { docid }, options);
}

/**
 * 获取用户开启发现的文档
 */
export const getEnabled: Core.APIs.EACHTTP.Finder.GetEnabled = function ({ } = {}, options?) {
    return eachttp('finder', 'getenabled', {}, options);
}

