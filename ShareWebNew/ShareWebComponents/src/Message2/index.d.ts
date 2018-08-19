declare namespace Components {
    namespace Message2 {
        type AllMessage = Core.APIs.EACHTTP.ShareApplyMessage |
            Core.APIs.EACHTTP.LinkApplyMessage |
            Core.APIs.EACHTTP.ShareApprovalMessage |
            Core.APIs.EACHTTP.WorkflowApplyMessage |
            Core.APIs.EACHTTP.WorkflowProgressMessage |
            Core.APIs.EACHTTP.WorkflowResultMessage |
            Core.APIs.EACHTTP.SimpleMessage |
            Core.APIs.EACHTTP.CSFApplyMessage |
            Core.APIs.EACHTTP.CSFResultMessage |
            Core.APIs.EACHTTP.QuarantineMessage |
            Core.APIs.EACHTTP.AntiVirusMessage;

        type MessageDoc = {
            docid: string;
            docname: string;
            path: string;
            checkPath: string;
        } & AllMessage;

        interface Props extends React.Props<void> {
            /**
             * 预览方法
             */
            doPreview: (msg: MessageDoc) => void;

            /**
             *跳转操作
             */
            doRedirect: (msg: MessageDoc) => void;

            /**
             * 审核跳转
             */
            doCheck: (msg: MessageDoc) => void;

            /**
             * 显示消息类型
             * 1:共享消息
             * 2:审核消息
             * 3:安全消息
             */
            showMsgType: number;

            /**
             * 打开窗口时触发
             */
            onOpenMessagesDialog?: (nwwindow) => any;

            /**
             * 弹窗关闭时执行
             */
            onCloseMessagesDialog?: () => any;

            /**
            * 组件窗口参数
            */
            fields: {
                [key: string]: any;
            };
        }

        interface State {

            msgs: ReadonlyArray<AllMessage>;
            /**
             * 筛选当前消息
             * 1-全部 
             * 2-未读 
             * 3-已读
             */
            selectedMode: number;

            /**
             * 审核结果信息
             */
            resultMessage: AllMessage;

            /**
             * 系统密级枚举
             */
            csfTextArray: Array<string>;

            csfSysId: string;
            /**
             * 显示隐藏 确认阅读所有弹窗 标识
             */
            showReadAllDialog: boolean;

            /**
             * 异常情况
             */
            exception?: {
                type: number;

                detail: any;
            } | null;
        }
    }

}