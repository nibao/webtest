declare namespace UI {
    namespace Badge {
        interface Props extends React.Props<void> {
            /**
             * 传入的显示数值
             */
            count?: number;

            /**
             * 截断的最大值，默认值为99。超过最大值的数字则显示为“最大值+”的形式（如overflowCount为99，则超过99的数字显示为99+)
             */
            overflowCount?: number;

            /**
             * 是否显示为没有数字的圆点（默认为false）
             */
            dot?: boolean;

            /**
             * 显示图标的大小，默认值为16px
             */
            size?: number;

            /** 
             * 字体大小
             */
            fontSize?: number | string;

            /**
             * 显示图标的背景颜色，默认值为#d70000
             */
            backgroundColor?: string;

            /**
             * 文字颜色
             */
            color: string;
        }

        interface State {
        }
    }
}