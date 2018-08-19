declare namespace Console {
    namespace OverView {
        interface Props extends React.Props<any> {
            /**
             * 关闭系统
             */
            onSystemShutdown: () => void;

            /**
             * 重定向到服务器管理
             */
            doServerRedirect: () => void;

            /**
             * 重定向的存储子系统
             */
            doStorageRedirect: () => void;

            /**
             * 打开告警状态页面
             */
            doSystemDetailRedirect: () => void;
        }

        interface Component extends React.StatelessComponent<Props> {
            (props: Props): Element;
        }
    }
}