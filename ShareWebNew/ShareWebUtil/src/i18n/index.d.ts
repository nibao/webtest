declare namespace Utils {
    namespace I18n {

        interface Settings {
            /**
             * 支持的语言列表
             */
            translations: Array<string>;

            /**
             * 当前使用的语言
             */
            locale: string;
        }

        /**
         * 匹配函数
         * @param key 要查找的资源
         * @param [replacements] 要替换的模版值
         * @return string 返回匹配的资源
         */
        type Matcher = (key: string, replacements?: Object) => string;

        /**
         * 更改配置
         * @param locale 当前使用的语言
         */
        type Setup = ({ locale: string }) => void

        /**
         * i18n实例
         */
        interface I18N {
            (resources: Array<Array<string>>): Utils.I18n.Matcher;
            setup: Setup;
        }
    }
}