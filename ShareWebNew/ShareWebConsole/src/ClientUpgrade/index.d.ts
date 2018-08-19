declare namespace Console {
    namespace ClientUpgrade {
        interface Props extends React.Props<any> {
            /**
             * 跳转至“服务器管理”页面
             */
            doRedirectServers: () => any;
        }

        interface State {
            /**
             * 应用节点状态
             */
            appNodeStatus: number;

            /**
             * 包信息
             */
            packageinfos: ReadonlyArray<any>;
        }
    }
}