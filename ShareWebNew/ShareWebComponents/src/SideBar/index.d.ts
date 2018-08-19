declare namespace Components {
    namespace SideBar {
        interface Props {

            /**
             * 侧边栏状态
             * 0 登录状态
             * 1 初始化状态
             * 2 在线状态
             * 3 离线状态
             * 4 注销状态
             * 5 退出状态
             */
            status?: number;

            /**
             * 当前登陆的用户
             */
            user?: object;

            /**
             * 侧边栏窗口id
             */
            id: string;

            /**
             * 当前所在目录
             */
            directory: Core.Docs.Doc;

            /**
             * 选中项
             */
            docs: ReadonlyArray<Core.Docs.Doc>;

            /**
             * 同步状态
             */
            sync: {
                mode: number;

                num?: number;
            };

            /**
             * 添加或取消收藏触发事件
             * @param docs 文档
             * @param favorited 收藏状态
             */
            onFavoriteChange: (docs: ReadonlyArray<Core.Docs.Doc>, favorited: boolean) => any

            /** 
             * 文档是否被收藏
             */
            favorited: boolean;

            /**
             * 打开窗口时触发
             */
            onOpenSideBar?: (nwwindow) => any;

            /**
             * 弹窗关闭时执行
             */
            onCloseSideBar?: () => any;

            /**
             * 组件窗口参数
             */
            fields: {
                [key: string]: any;
            };
        }
    }
}