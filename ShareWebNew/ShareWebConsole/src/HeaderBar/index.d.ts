declare namespace Components {
    namespace HeaderBar {
        interface Props extends React.Props<void> {
            /**
             * 当前路径
             */
            path: string;
        }

        interface State {
            /**
             * 是否登录页
             */
            indexView: boolean;

            /**
             * 是否显示账户设置弹窗
             */
            showEditSystemManager: boolean;

            /**
             * logo图片资源
             */
            logo: string;

            /**
             * 用户名
             */
            account: string;

        }
    }
}