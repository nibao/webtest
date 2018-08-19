declare namespace Components {
    namespace Language {
        interface Props extends React.Props<void> {
        }

        interface State {
            /**
             * 应用服务是否可用
             */
            appSysStatus: boolean;

            /**
             * 语言菜单项
             */
            languageList: ReadonlyArray<any>;

            /**
             * 当前语言
             */
            currentLang: string;

        }
    }
}