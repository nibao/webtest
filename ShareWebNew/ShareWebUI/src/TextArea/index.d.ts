declare namespace UI {
    namespace TextArea {
        interface Props extends React.Props<void> {

            /**
             * 文本值
             */
            value?: string;

            /**
             * 是否只读
             */
            readOnly?: boolean;

            /**
             * class
             */
            className?: string;

            /**
             * 宽度，包含padding / border
             */
            width?: number | string;

            /**
             * 高度，包含padding / border
             */
            height?: number | string;

            /**
             * minHeight，包含盒模型的padding和border
             */
            minHeight?: number | string;

            /**
             * maxHeight，包含盒模型的padding和border
             */
            maxHeight?: number | string;

            /**
             * 是否禁用
             */
            disabled?: boolean;

            /**
             * 是否允许空值
             */
            required?: boolean;

            /**
             * 最大允许输入
             */
            maxLength?: number;

            /**
             * 占位提示
             */
            placeholder?: string;

            /**
             * 输入验证
             * @param value 文本值
             */
            validator?: (input: string) => boolean;

            /**
             * 文本值发生变化时触发
             * @param value 文本值
             */
            onChange?: (value: string) => any;

            /**
             * 聚焦时触发
             */
            onFocus?: () => any;

            /**
             * 失焦时触发
             */
            onBlur?: () => any;
        }

        interface State {
            /**
             * 文本值
             */
            value?: string;

            /**
             * 当前是否聚焦
             */
            focus?: boolean;

        }
    }
}