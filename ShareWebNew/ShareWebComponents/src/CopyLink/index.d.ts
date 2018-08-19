declare namespace Components {
    namespace CopyLink {
        interface Props {

            /**
             * ZeroClipboard SWF路径
             */
            swf?: string;

            /**
             * 是否开启提取码
             * 只有外链／提取码配置界面有效
             */
            enableLinkAccessCode?: boolean;

            /**
             * 外链id
             */
            link?: string;

            /**
             * 共享邀请id
             */
            invitationid?: string;

            /**
             * 外链有效期
             */
            endtime?: number;

            /**
             * 外链密码 
             */
            password?: string;

            /**
             * 提取码
             */
            accesscode?: string;

            /**
             * 实现剪贴板操作
             * @param text 文本内容 
             * @return 返回是否成功
             */
            doCopy?: (text: string) => boolean;
        }

        interface State {
            /**
             * 是否复制成功
             */
            copySuccess: boolean;

            /**
             * 地址栏文本
             */
            text: string;

            /**
             * 剪贴板内容
             */
            clipboardData: string;
        }

        interface Component extends React.Component<Props, State> {
        }
    }
} 