/// <reference path="../apis/eachttp/config/config.d.ts" />

import { find, pick, reduce, assign } from 'lodash';
import { get } from '../../util/http/http';
import { getSupportedLanguage, envLanguage, setTitle, insertStyle } from '../../util/browser/browser';
import { getOemConfigBySection } from '../apis/eachttp/config/config';
import { ClassName } from '../../ui/helper';

/**
 * 获取OEM配置
 */
async function getOEMSection(lang = envLanguage()): Promise<Core.APIs.EACHTTP.OEMInfo> {
    const supportedLanguage = getSupportedLanguage(lang);
    const [AnyShareOEM, LanguageSpecifiedOEM] = await Promise.all([
        getOemConfigBySection({ section: 'anyshare' }),
        getOemConfigBySection({ section: `shareweb_${supportedLanguage}` }),
    ]);

    return { ...LanguageSpecifiedOEM, ...AnyShareOEM }
}

/**
 * 获取指定OEM配置
 * @params options 指定选项的数组
 * @return {Promise<Object>} 以option为属性的键值对象
 */
export function getOEMConfByOptions(options: Array<string>): PromiseLike<any> {
    return getOEMSection().then(OEMConf => {

        return reduce(pick(OEMConf, options), (result, value, key) => {
            if (value === 'true' || value === 'false') {
                result[key] = eval(value)
                return result;
            } else {
                result[key] = value
                return result;
            }
        }, {});
    });
}

/**
 * 设置网页标签title
 */
export async function setOEMtitle() {
    const { product } = await getOEMConfByOptions(['product']);
    setTitle(product);
}

/**
 * 设置OEM图片资源
 */
export async function applyOEMImage() {
    try {
        const imageResource = await getOEMConfByOptions(['background.png', 'logo.png', 'title.png', 'org.png'])

        insertStyle({
            [`.${ClassName.OemBackground}`]: {
                backgroundImage: `url('data:image/png;base64,${imageResource['background.png']}')`
            },
            [`.${ClassName.OemLogo}`]: {
                backgroundImage: `url('data:image/png;base64,${imageResource['logo.png']}')`
            },
            [`.${ClassName.OemWelcome}`]: {
                backgroundImage: `url('data:image/png;base64,${imageResource['title.png']}')`
            },
            [`.${ClassName.OemProduct}`]: {
                backgroundImage: `url('data:image/png;base64,${imageResource['org.png']}')`
            }          
        })
    } catch (e) {}
}