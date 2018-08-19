declare namespace UI {
    namespace Dialog2 {
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
             * 隐藏对话框
             */
            hide?: boolean;

            /**
             * 对话框是否可拖动
             */
            draggable?: boolean;

            /**
             * 右侧按钮
             */
            buttons?: Array<'close' | 'minimize'>;

            /**
             * 对话框缩放时触发
             */
            onResize?: (size: { width: number | string, height: number | string }) => any;

            /**
             * 触发关闭对话框事件
             */
            onClose?: () => any;
        }

        interface State {
        }
    }
}