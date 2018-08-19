declare namespace UI {
    namespace NWDialog {
        interface Props extends React.Props<void> {
            /**
             * 标题栏
             */
            title?: string;

            /**
             * 宽度
             */
            width?: number | string;

            /**
             * 高度
             */
            height?: number | string;

            /**
             * 右侧按钮
             */
            buttons?: Array<'close' | 'minimize'>;

            /**
             * 触发关闭对话框事件
             */
            onClose?: () => any;
        }
    }
}