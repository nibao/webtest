declare namespace Components {
    namespace LinkDocs {
        interface Props extends React.Props<any> {
            /**
             * 外链对象
             */
            linkDoc: any;

            /**
             * 转存， 登录成功
             */
            onLoginSuccess?: () => any;

            /**
             * 转存成功后，“点击查看”跳转
             */
            onRedirectDest?: (docid: string) => any;

            /**
             * 地址栏路径发生变化
             */
            onPathChange: (linkDoc: any, { newTab }: { newTab: boolean }) => any;

            /**
             * 加载完成
             */
            onLoad?: (doc: Core.Docs.Doc) => void;
            /*
             * 修改密码
             */
            onRequestChangePassword: (account: string, onLoginSuccess: any) => any
        }

        interface State {
            /**
             * 外链列举结果
             */
            list: {
                /**
                 * 文件夹
                 */
                dirs: Core.Docs.Docs;

                /**
                 * 文件
                 */
                files: Core.Docs.Docs;
            };

            /**
             * 错误码
             */
            errCode: number;

            /**
             * 获取外链的请求状态
             */
            reqStatus: number;

            /**
             * 选中项数组
             */
            selections: ReadonlyArray<any>;

            /**
             * 路径数组
             */
            crumbs: ReadonlyArray<any>;

            /**
             * 登录状态（转存的登录状态）
             */
            loginStatus: boolean;

            /**
             * 点击“转存”
             */
            saveTo: boolean;

            /**
             * 鼠标位置(鼠标右键)
             */
            contextMenuPosition: ReadonlyArray<number>;

            /**
             * 是否显示右键菜单
             */
            showContextMenu: boolean;

            /**
             * 拖拽上传目的地址
             */
            dragUploadDest: any;

            /**
             * 加载中
             */
            loading: boolean;

            /**
             * 异常
             */
            exception: {
                /**
                 * 文档对象
                 */
                doc: any;

                /**
                 * 错误码
                 */
                errCode: number;
            }
        }
    }
}