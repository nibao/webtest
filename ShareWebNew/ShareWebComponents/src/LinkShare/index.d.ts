declare namespace Components {
    namespace LinkShare {
        /**
         * 权限
         */
        interface Perm {
            name: string;

            value: number;

            require: Array<number>;

            checked: boolean;
        }

        interface Props extends React.Props<void> {
            swf?: string;

            doc: Core.APIs.EACHTTP.EntryDoc | Core.APIs.EFSHTTP.Doc;

            sender?: string;

            /**
             * 实现剪贴板操作
             * @param text 文本内容 
             * @return 返回是否成功
             */
            doCopy?: (text: string) => boolean;

            /**
             * 关闭配置界面
             */
            doConfigurationClose: () => any;

            /**
             * 实现本地跳转事件
             */
            doApprovalCheck?: () => void;

            /**
             * 确认错误提示
             * @param status 状态码
             */
            onErrorConfirm: (status: number) => any;

            /**
             * 窗口尺寸发生变化时触发
             */
            onResize?: ({ width, height }: { width?: number; height?: number }) => any;

            /**
             * 打开窗口时触发
             */
            onOpenLinkShareDialog?: (nwwindow) => any;

            /**
             * 弹窗关闭时执行
             */
            onCloseLinkShareDialog?: () => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }

        interface State {
            /**
             * 外链id
             */
            link?: string;

            /**
             * 提取码
             */
            accesscode?: string;

            /**
             * 外链密码
             */
            password?: string;

            /**
             * 外链权限
             */
            perm: number;

            /**
             * 外链开启／关闭状态
             */
            status: number;

            /**
             * 外链访问地址
             */
            address: string;

            /**
             * 邮箱地址
             */
            mailto: Array<string>;

            /**
             * 配置过程中的错误
             */
            error?: number;

            /**
             * 正在下载二维码
             */
            downloadQRCode?: boolean;

            change: boolean;

            linkInfo: Core.APIs.EFSHTTP.LinkDetail;

            isCompleteForm: boolean;

            copySuccess: boolean;

            endtime: number;

            permValue: number;

            fullLink: string;

            limitTimes: number;

            limitTimeStatus: boolean;

            sendMailSuccess: boolean;

            configing: boolean;

            reqStatus: number;

            otherError: string;

            apvCase: boolean;

            /**
             * 禁用开启按钮
             */
            opening: boolean;

            /**
             * 禁用关闭按钮
             */
            closing: boolean;
        }
    }
}   