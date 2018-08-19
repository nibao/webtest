import { getOEMConfByOptions } from '../oem/oem'
import { pairs } from 'lodash';
import { getEnvLanguage } from '../language/language';
import { getConfig } from '../config/config';
import { ClientUpdateStrategy } from '../siteupgrade/siteupgrade'
import __ from './locale';
/**
 * 客户端下载类型
 */
export enum ClientTypes {
    WIN_32,
    WIN_64,
    ANDROID,
    MAC,
    WIN_32_ADVANCED,
    WIN_64_ADVANCED,
    IOS,
    OFFICE_PLUGIN,
}

/**
 * get客户端名
 */
export function clientName(type: ClientTypes) {
    switch (type) {
        case ClientTypes.WIN_32:
            return __('Windows');

        case ClientTypes.WIN_64:
            return __('Windows');

        case ClientTypes.MAC:
            return __('Mac');

        case ClientTypes.ANDROID:
            return __('Android');

        case ClientTypes.IOS:
            return __('iOS');

        case ClientTypes.OFFICE_PLUGIN:
            return __('Office插件');

        case ClientTypes.WIN_32_ADVANCED:
            return __('Windows');

        case ClientTypes.WIN_64_ADVANCED:
            return __('Windows');

    }
}

/**
 * 获取windows客户端悬浮内容
 */
export const WindowTitle = {
    [ClientTypes.WIN_32]: __('推荐配置 CPU i3，内存2GB，操作系统XP/win7/win8/win10及以上 使用'),
    [ClientTypes.WIN_64]: __('推荐配置 CPU i3，内存2GB，操作系统XP/win7/win8/win10及以上 使用'),
    [ClientTypes.WIN_32_ADVANCED]: __('推荐配置 CPU i3，内存4GB，操作系统win7/win8/win10及以上 使用'),
    [ClientTypes.WIN_64_ADVANCED]: __('推荐配置 CPU i3，内存4GB，操作系统win7/win8/win10及以上 使用')
}

/**
 * 获取客户端OEM配置
 */
export async function buildClientList() {
    const result = Object.assign({ ios: true, android: true, office: true, mac: true, windows: true },
        await getOEMConfByOptions(['ios', 'android', 'office', 'mac', 'windows']));

    // list结果格式=>{ClientTypes.WIN_32: true, ClientTypes.WIN_64: true, ClientTypes.ANDROID: false, ...}
    return pairs(result).reduce((previousValue, [type, enabled]) => {
        switch (type) {
            case 'ios':
                return { ...previousValue, [ClientTypes.IOS]: enabled }
            case 'android':
                return { ...previousValue, [ClientTypes.ANDROID]: enabled }
            case 'office':
                return { ...previousValue, [ClientTypes.OFFICE_PLUGIN]: enabled }
            case 'mac':
                return { ...previousValue, [ClientTypes.MAC]: enabled }
            case 'windows':
                return { ...previousValue, [ClientTypes.WIN_32]: enabled, [ClientTypes.WIN_64]: enabled, [ClientTypes.WIN_32_ADVANCED]: enabled, [ClientTypes.WIN_64_ADVANCED]: enabled }
        }
    }, {});
}

/**
 *AnyShare AppStore 地址
 */
const ANYSHARE_IOS_LINK = 'https://itunes.apple.com/cn/app/anyshare/id724109340';

/**
 *易享云 AppStore 地址
 */
const ESHARE_IOS_LINK = 'https://itunes.apple.com/cn/app/yi-xiang-yun3/id898177190';

/**
 *获取office插件地址
 */
export function getOffice() {
    let dlHref = {
        'zh-cn': '/download/AnyShare_for_Office_CN.exe',
        'zh-tw': '/download/AnyShare_for_Office_CN.exe',
        'en-us': '/download/AnyShare_for_Office_EN.exe'
    };
    let language = getEnvLanguage();
    return dlHref[language];
}