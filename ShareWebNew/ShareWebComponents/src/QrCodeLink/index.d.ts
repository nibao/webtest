declare namespace Components {
    namespace QrCodeLink {
        interface Props extends React.Props<void> {
            /**
             * 外链id
             */
            link?: string;

            /**
             * 共享邀请id
             */
            invitationid?: string;
        }

        interface State {
            /**
             * 完整地址
             */
            address: string;

            /**
             * 全屏预览
             */
            viewFullImage: boolean;

            /**
             * 显示下载对话框
             */
            showDownloadDialog: boolean;

            /**
             * 下载格式
             */
            qrcodeFormat: number;

            /**
             * 下载地址
             */
            qrcodeURL: string;
        }

        interface Component extends React.Component<Props, State> {
        }
    }
} 