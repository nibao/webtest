declare namespace Components {
    namespace Share {
        interface Props extends React.Props<any> {
            /**
             * 权限配置的文档
             */
            doc: Core.Docs.Doc;

            /**
             * 复制链接
             */
            doCopyLink?(filePath: string): void;

            /**
             * 共享已提交审核，跳转至共享申请
             */
            doApvJump(): void;

            /**
             * 对话框尺寸发生变化时触发
             */
            onResize?: (size: { width: number | string, height: number | string }) => any;

            /**
             * 关闭对话框触发
             */
            onCloseDialog(): any;

            /**
             * ZeroClipboard.swf位置
             */
            swf?: string;

            /**
             * 标题
             */
            title?: string;

            /**
             * 立即认证
             */
            onRealNameRequired?: () => void;

            /**
             * 打开窗口时触发
             */
            onOpenShareDialog?: (nwwindow) => any;

            /**
             * 组件窗口参数
             */
            fields: {
                [key: string]: any;
            };
        }

        interface State {
            /**
             * 权限配置页面是否显示
             */
            showShare: boolean;

            /**
             * 错误码
             */
            errCode?: number;

            /**
             * 提交审核信息窗
             */
            apvCase: boolean;

            /**
             * 涉密模式警告窗
             */
            secretMode: boolean;

            /**
             * 复制链接是否成功
             */
            copySuccess: boolean;

            /**
             * 用于显示的权限信息
             */
            permConfigs: ReadonlyArray<Core.Permission.PermConfig>;

            /**
             * 禁止显示的权限
             */
            disabledOptions: number;

            /**
             * 是否显示“添加访问者”页面
             */
            showAdderVisitor: boolean;

            /**
             * 在权限配置页面中间显示的错误，包括 没有所有者权限，账户被冻结，个人文档禁止权限配置，群组文档禁止权限配置，8511未标密文件不允许开启权限配置
             */
            displayErrCode?: number;

            /**
             * 权限被修改过（添加或删除, mobile）
             */
            permissionEdited: boolean;

            /**
             * Drawer是否显示（mobile）
             */
            open: boolean;

            /**
             * 转圈是否显示(mobile)
             */
            showLoading: boolean;

            /**
             * 是否显示详情配置页面（mobile）
             */
            showPermDetail: boolean;

            /**
             * 当前正在编辑的权限(mobile)
             */
            currentConfig: any;

            /**
             * 707研究所权限配置用户名后面是否显示密级(mobile, 5.0)
             */
            showCSF: boolean;

            /**
             * 707研究所权限配置成功后-弹出部分用户密级不足已自动过滤相关文件(mobile, 5.0)
             */
            showCSFTipDialog: boolean;

            /**
            * 707研究所权限配置用户名密级数组(mobile, 5.0)
            */
            csfTextArray: ReadonlyArray<string>;
        }
    }
}