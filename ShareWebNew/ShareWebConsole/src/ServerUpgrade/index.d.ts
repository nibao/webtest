declare namespace Console {
    namespace ServerUpgrade {
        interface Props extends React.Props<any> {
            /**
             * 跳转“服务器管理”页面
             */
            doRedirectServers(): () => void;

            /**
             * 查看监控详情
             */
            doSystemDetailRedirect: () => void;
        }

        interface State {
            /**
             * 应用节点的设置状态
             */
            appNodeStatus: number;
        }
    }
}