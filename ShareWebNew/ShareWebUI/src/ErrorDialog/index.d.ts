declare namespace UI {
    namespace ErrorDialog {
        interface Props extends React.Props<any> {
            /**
             * 确定错误时触发
             */
            onConfirm?: () => any;
        }
    }
}