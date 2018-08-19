declare namespace Console {
    namespace ClientUpgrade {
        namespace NoAppNode {
            interface Props extends React.Props<any> {
                /**
                 * 跳转“服务器管理”页面
                 */
                doRedirectServers: () => any;
            }
        }
    }
}