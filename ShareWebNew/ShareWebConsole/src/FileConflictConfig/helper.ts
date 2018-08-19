import __ from './locale';
export const timeOutI18n = {
    '180': __('超过3分钟'),
    '600': __('超过10分钟'),
    '1800': __('超过30分钟'),
    '3600': __('超过1小时'),
    '18000': __('超过5小时'),
    '43200': __('超过12小时'),
    '86400': __('超过24小时'),
    '-1': __('永不')
}

/**
 * 将分钟、小时、天转为秒数,单位不传默认为分钟,传入<0的数则直接返回
 * @export
 * @example toSeconds(1,'hou') // 3600
 * @example toSeconds(-1) // -1 
 * @param {number} [value=3] 
 * @param {string} [timeUnit] 
 * @returns {number}
 */
export function toSeconds(value: number = 3, timeUnit?: string) {
    if (value < 0) return value;
    switch (timeUnit) {
        case 'min':
            return value * 60;
        case 'hou':
            return value * 3600;
        case 'day':
            return value * 24 * 3600;
        default:
            return value * 60;
    }
}