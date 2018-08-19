declare namespace Component {
    namespace QRCodeDownload {
        interface Props extends React.Props<void> {
            /**
             * 二维码文本
             */
            text: string;

            /**
             * 点击取消时触发
             */
            doCancel: () => any;

            /**
             * 触发下载
             */
            doDownload: (url) => any;
        }

        interface State {
            /**
             * 下载地址
             */
            url: string;

            /**
             * 选中的格式
             */
            format: 0 | 1;
        }
    }
}