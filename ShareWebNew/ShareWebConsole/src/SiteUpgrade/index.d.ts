declare namespace Console {
    namespace SiteUpgrade {
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
             * 客户端升级页是否显示(分站点，需要隐藏客户端升级页)
             */
            showClientUpgrade: boolean | undefined;
        }
    }
}