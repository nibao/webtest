declare namespace UI {
    namespace ProgressBar {
        interface Props extends React.Props<any> {

            /**
             * 值
             */
            value: string | number;

            /**
             * 宽度
             */
            width?: string | number;

            /**
             * 渲染值
             */
            renderValue?: (value: number) => string | number;
        }
    }
}
