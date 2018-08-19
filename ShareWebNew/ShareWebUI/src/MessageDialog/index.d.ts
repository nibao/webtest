declare namespace UI {
    namespace MessageDialog {
        interface Props extends React.Props<any> {
            /**
             * 确认对话框时执行
             */
            onConfirm: () => any;
        }
    }
}