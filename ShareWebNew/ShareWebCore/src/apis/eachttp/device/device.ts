import { eachttp } from '../../../openapi/openapi';

/**
 * 获取所有设备信息
 */
export const list: Core.APIs.EACHTTP.Device.List = function ({ } = {}, options?) {
    return eachttp('device', 'list', {}, options);
}

/**
 * 禁用设备
 */
export const disable: Core.APIs.EACHTTP.Device.Disable = function ({ udid }, options?) {
    return eachttp('device', 'disable', { udid }, options);
}

/**
 * 启用设备
 */
export const enable: Core.APIs.EACHTTP.Device.Enable = function ({ udid }, options?) {
    return eachttp('device', 'enable', { udid }, options);
}

/**
 * 擦出缓存
 */
export const erase: Core.APIs.EACHTTP.Device.Erase = function ({ udid }, options?) {
    return eachttp('device', 'erase', { udid }, options);
}

/**
 * 获取设备状态（mobile）
 */
export const getStatus: Core.APIs.EACHTTP.Device.GetStatus = function ({ udid }, options?) {
    return eachttp('device', 'getstatus', { udid }, options);
}

/**
 * 通知anyshare缓存擦除成功（mobile）
 */
export const onEraseSuc: Core.APIs.EACHTTP.Device.OnEraseSuc = function ({ udid }, options?) {
    return eachttp('device', 'onerasesuc', { udid }, options);
}