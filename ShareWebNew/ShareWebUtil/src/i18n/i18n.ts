import { find } from 'lodash';
import { envLanguage, getSupportedLanguage } from '../browser/browser';

/**
 * i18n工厂函数
 * @param options.translations 支持的语言
 * @param options.locale 当前语言
 */
export default function I18NFactory({ translations, locale = envLanguage() }: Utils.I18n.Settings) {

    let useLocale = locale;

    const i18n: Utils.I18n.I18N = <Utils.I18n.I18N>function (resources = []) {
        const KeyIndex = 0;

        /**
         * 在资源中查找匹配项
         * @params key 查找关键字
         */
        const findMatch = function (key: string): string {
            const match = find(resources, item => item[KeyIndex] === key) || []; // 书写语言下标
            const result = match[translations.indexOf(getSupportedLanguage(useLocale))];

            return result !== undefined ? result : (match[KeyIndex] || ''); // 返回匹配项或Config.key对应的语言
        }

        return function (key, replacements = {}) {
            return findMatch(key).replace(/\${(.+?)}/g, (match, cap) => {
                if (!match || !cap) {
                    return '';
                }

                return replacements[cap] !== undefined ? replacements[cap] : '';
            });
        };
    };

    i18n.setup = function ({ locale }) {
        useLocale = locale;
    }

    return i18n;
}