import I18NFactory from '../util/i18n/i18n';
import { envLanguage } from '../util/browser/browser';

/**
 * 导出i18n实例
 */
export default I18NFactory({
    translations: ['zh-cn', 'zh-tw', 'en-us'],
    locale: envLanguage()
});