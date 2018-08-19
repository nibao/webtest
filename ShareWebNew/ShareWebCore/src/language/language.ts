/**
 * 语言资源服务
 */
import session from '../../util/session/session';
import { getOEMConfByOptions } from '../oem/oem';


/**
 * 默认语言
 */
const DEFAULT_LANGUAGE = 'en-us';

/**
 * 语言资源列表
 */
export const Languages = [{
    language: 'zh-cn',
    title: '简体中文'
}, {
    language: 'zh-tw',
    title: '繁體中文'
}, {
    language: 'en-us',
    title: 'English'
}];

let languageConfig;

function getLanguageConfig() {
    return languageConfig || (languageConfig = getOEMConfByOptions(['allowTw', 'allowEn', 'allowCn']).then(({ allowTw = true, allowEn = true, allowCn = true }) => ({ allowTw, allowEn, allowCn })));
}

/**
 * 获取当前允许的语言版本列表
 */
export function getLanguageList() {
    return getLanguageConfig().then(({ allowTw, allowEn, allowCn }) => {
        return Languages.filter(({ language }) => !(!allowTw && language === 'zh-tw' || !allowEn && language === 'en-us' || !allowCn && language === 'zh-cn'));
    }, () => {
        return Languages;
    });
}


/**
 * 从Hash参数中获取语言
 * @returns {*}
 */
function getLanguageHash() {
    let hash = window.location.hash;
    let match = /\blang=([a-zA-Z\-]+)\b/.exec(hash);
    let lang;

    if (match) {
        lang = match[1];
        setLanguage(lang);

        return lang;
    }
}


/**
 * 获取当前的语言
 * @returns {Object} 返回当前语言
 */
export function getEnvLanguage(): string {
    return (getLanguageHash() || session.get('lang') || window.navigator['language'] || window.navigator['browserLanguage'] || DEFAULT_LANGUAGE).trim().toLowerCase();
}


/**
 * 设置当前语言
 * @param lang
 */
export function setLanguage(lang = '') {
    session.set('lang', lang.toLowerCase());
}

/**
 * 获取当前的语言 如果语言版本不被允许则按优先级显示(中文版本>英文版本>繁体版本)
 * @returns {Object} 返回当前语言
 */
export function getCurrentLang() {
    const language = getEnvLanguage();

    return new Promise((resolve) => {
        getLanguageConfig().then(({ allowTw, allowEn, allowCn }) => {
            if (language === 'zh-tw') {
                if (!allowTw) {
                    if (allowCn) {
                        setLanguage('zh-cn');
                        resolve(Languages[0]);
                    } else {
                        setLanguage('en-us');
                        resolve(Languages[2]);
                    }
                } else {
                    setLanguage('zh-tw');
                    resolve(Languages[1]);
                }
            } else if (/^en/.test(language)) {
                if (!allowEn) {
                    if (allowCn) {
                        setLanguage('zh-cn');
                        resolve(Languages[0]);
                    } else {
                        setLanguage('zh-tw');
                        resolve(Languages[1])
                    }
                } else {
                    setLanguage('en-us');
                    resolve(Languages[2]);
                }
            } else if (language === 'zh-cn') {
                if (!allowCn) {
                    if (allowEn) {
                        setLanguage('en-us');
                        resolve(Languages[2]);
                    } else {
                        setLanguage('zh-tw');
                        resolve(Languages[1]);
                    }
                } else {
                    setLanguage('zh-cn');
                    resolve(Languages[0]);
                }
            } else {
                // 中英繁以外的语言默认返回英文
                setLanguage('en-us');
                resolve(Languages[2]);
            }
        });
    });
}