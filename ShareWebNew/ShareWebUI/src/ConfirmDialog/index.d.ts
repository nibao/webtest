declare namespace UI {
    namespace ConfirmDialog {
        interface Props extends React.Props<void> {
            /**
             * 执行确认操作
             */
            onConfirm: () => any;

            /**
             * 执行取消操作
             */
            onCancel: () => any;

            /**
             * 提示文字
             */
            title?: string;
        }
    }
}