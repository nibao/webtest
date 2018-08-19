declare namespace Components {
    namespace Message {
        type Props = {
            /**
             * 预览方法
             */
            onPreview: Function;
            /**
             *跳转操作
             */
            onRedirect: Function;
            /**
             * 审核跳转
             */
            onCheck: Function;
            /**
             * 读取消息
             */
            onRead: Function;

            /**
             * 首条未读消息是共享消息还是审核消息
             */
            isShare: boolean;

            /**
             * 消息关闭时屏蔽消息页面
             */
            onShieldMessage: () => any; 
        }
        type State = {
            /**
             * 消息列表
             */
            msgs: Array<Core.APIs.EACHTTP.Message>;
            /**
             * 共享消息列表
             */
            sharemsgs: Array<Core.APIs.EACHTTP.Message | Core.APIs.EACHTTP.ShareApplyMessage>;
            /**
             * 审核消息列表
             */
            checkmsgs: Array<Core.APIs.EACHTTP.Message |
            Core.APIs.EACHTTP.ShareApplyMessage |
            Core.APIs.EACHTTP.LinkApplyMessage |
            Core.APIs.EACHTTP.ShareApprovalMessage |
            Core.APIs.EACHTTP.WorkflowApplyMessage |
            Core.APIs.EACHTTP.WorkflowProgressMessage |
            Core.APIs.EACHTTP.WorkflowResultMessage |
            Core.APIs.EACHTTP.CSFApplyMessage |
            Core.APIs.EACHTTP.CSFResultMessage
            >;
            /**
             * 安全消息列表
             */
            securitymsgs: Array<Core.APIs.EACHTTP.SimpleMessage | Core.APIs.EACHTTP.QuarantineMessage | Core.APIs.EACHTTP.AntiVirusMessage>;
            /**
             * 已读共享消息列表
             */
            isreadSharemsgs: Array<Core.APIs.EACHTTP.Message | Core.APIs.EACHTTP.ShareApplyMessage>;
            /**
             * 已读审核消息列表
             */
            isreadCheckmsgs: Array<Core.APIs.EACHTTP.Message |
            Core.APIs.EACHTTP.ShareApplyMessage |
            Core.APIs.EACHTTP.LinkApplyMessage |
            Core.APIs.EACHTTP.ShareApprovalMessage |
            Core.APIs.EACHTTP.WorkflowApplyMessage |
            Core.APIs.EACHTTP.WorkflowProgressMessage |
            Core.APIs.EACHTTP.WorkflowResultMessage |
            Core.APIs.EACHTTP.CSFApplyMessage |
            Core.APIs.EACHTTP.CSFResultMessage
            >;
            /**
             * 已读安全消息列表
             */
            isreadSecuritymsgs: Array<Core.APIs.EACHTTP.SimpleMessage | Core.APIs.EACHTTP.QuarantineMessage | Core.APIs.EACHTTP.AntiVirusMessage>;
            /**
             * 未读共享消息列表
             */
            unreadSharemsgs: Array<Core.APIs.EACHTTP.Message | Core.APIs.EACHTTP.ShareApplyMessage>;
            /**
             * 未读审核消息列表
             */
            unreadCheckmsgs: Array<Core.APIs.EACHTTP.Message |
            Core.APIs.EACHTTP.ShareApplyMessage |
            Core.APIs.EACHTTP.LinkApplyMessage |
            Core.APIs.EACHTTP.ShareApprovalMessage |
            Core.APIs.EACHTTP.WorkflowApplyMessage |
            Core.APIs.EACHTTP.WorkflowProgressMessage |
            Core.APIs.EACHTTP.WorkflowResultMessage |
            Core.APIs.EACHTTP.CSFApplyMessage |
            Core.APIs.EACHTTP.CSFResultMessage
            >;
            /**
             * 未读安全消息列表
             */
            unreadSecuritymsgs: Array<Core.APIs.EACHTTP.SimpleMessage | Core.APIs.EACHTTP.QuarantineMessage | Core.APIs.EACHTTP.AntiVirusMessage>;

            /**
             * 审核结果信息
             */
            resultMessage: Core.APIs.EACHTTP.Audit;

            /**
             * 消息显示方式
             */
            msgshowMode: Array<any>;

            /**
             * 选中的消息显示模式
             */
            selectedMode: number;

            /**
             * 显示共享消息列表
             */
            showSharemsgs: Array<Core.APIs.EACHTTP.Message | Core.APIs.EACHTTP.ShareApplyMessage>;

            /**
             * 显示审核消息列表
             */
            showCheckmsgs: Array<Core.APIs.EACHTTP.Message |
            Core.APIs.EACHTTP.ShareApplyMessage |
            Core.APIs.EACHTTP.LinkApplyMessage |
            Core.APIs.EACHTTP.ShareApprovalMessage |
            Core.APIs.EACHTTP.WorkflowApplyMessage |
            Core.APIs.EACHTTP.WorkflowProgressMessage |
            Core.APIs.EACHTTP.WorkflowResultMessage |
            Core.APIs.EACHTTP.CSFApplyMessage |
            Core.APIs.EACHTTP.CSFResultMessage
            >;

            /**
             * 显示安全消息列表
             */
            showSecuritymsgs: Array<Core.APIs.EACHTTP.SimpleMessage | Core.APIs.EACHTTP.QuarantineMessage | Core.APIs.EACHTTP.AntiVirusMessage>;

            /**
             * 系统密级枚举
             */
            csfTextArray: Array<string>;

            /**
             * 是否开启第三方标密
             */
            openThirdCsfSys: boolean;

        }
        interface Base {
            props: Props
            state: State
        }
    }

}   