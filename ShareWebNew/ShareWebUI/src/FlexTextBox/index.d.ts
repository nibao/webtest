declare namespace UI {
    namespace FlexTextBox {
        interface Props extends React.Props<any> {

            /**
             * 禁用
             */
            readOnly?: boolean;

            /**
             * 只读
             */
            disabled?: boolean;

            /**
             * 占位文本
             */
            placeholder?: string;

            /**
             * 键盘keyDown事件
             */
            onKeyDown?: (event: React.MouseEvent<HTMLElement>) => void;

            /**
             * 粘贴事件
             */
            onPaste?: (event: React.ClipboardEvent<HTMLElement>) => void;

            /**
             * 失去焦点
             */
            onBlur?: (event: React.FocusEvent<HTMLElement>) => void

            /**
             * 样式
             */
            className?: string;

        }

        interface State {
            value: string;

            placeholder?: string;
        }
    }
}