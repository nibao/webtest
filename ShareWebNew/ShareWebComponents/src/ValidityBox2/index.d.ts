declare namespace Components {
    namespace ValidityBox2 {
        interface Props extends React.Props<void> {
            /**
             * 控件宽度
             */
            width?: number;

            /**
             * 初始日期微秒
             */
            value?: number;

            /**
             * 对齐方式
             * @example
             * ```
             * <ValidityBox2 dropAlign="left bottom" />
             * ```
             */
            dropAlign?: string;

            /**
             * 是否允许永久有效
             */
            allowPermanent?: boolean;

            /**
             * 日期选择范围
             * @example
             * ```
             *  <ValidityBox2 selectRange=[start, end] />
             *  <ValidityBox2 selectRange=[, end] />
             *  <ValidityBox2 selectRange=[start, ] />
             * ```
             */
            selectRange?: ReadonlyArray<Date>;

            /**
             * 默认选中从当前算起后的日期
             */
            defaultSelect?: number;

            /**
             * 选项改变时触发
             * @param date 日期对象
             */
            onChange?: (date: Date) => any;
        }

        interface State {
            /**
             * 当前选中的日期微秒
             */
            value?: number;

            /**
             * 当前是否显示日历控件
             */
            active?: boolean;
        }
    }
}