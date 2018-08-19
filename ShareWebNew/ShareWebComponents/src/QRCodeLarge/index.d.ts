declare namespace Component {
    namespace QRCodeLarge {
        interface Props extends React.Props<void> {
            /**
             * 二维码文本
             */
            text: string;

            /**
             * 点击关闭时触发
             */
            doClose: () => any;
        }

        interface State {

        }
    }
}