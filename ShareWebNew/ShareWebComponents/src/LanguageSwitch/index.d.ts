declare namespace Components {
    namespace LanguageSwitch {
        interface Props extends React.Props<any> {
            /**
             * 切换语言
             * @param lang:"zh-cn" "zh-tw" "en-us"
             */
            onSelectLanguage: (lang: string) => any;
        }

        interface State {
            /**
             * 用户可选语言列表
             */
            list: Array<object>;

            /**
             * 当前语言
             */
            current: string;
        }
    }
}