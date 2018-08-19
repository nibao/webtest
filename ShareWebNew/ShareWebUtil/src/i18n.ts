import I18N from './i18n/i18n';
import { envLanguage } from './browser/browser';

/**
 * 导出i18n实例
 */
export default I18N({
    translations: ['zh-cn', 'zh-tw', 'en-us'],
    locale: envLanguage()
});