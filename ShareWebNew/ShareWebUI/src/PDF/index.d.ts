declare namespace UI {
    namespace PDF {
        interface Props extends React.Props<any> {

            /**
             * PDF 文档对象
             */
            pdf: any;

            /**
             * 是否适用懒加载模式
             */
            lazy?: boolean;

            /**
             * 缩放比
             */
            zoom?: number;
        }

        interface State {
            /**
             * PDF分页对象列表
             */
            pages: Array<any>,

            /**
             * 是否正在渲染
             */
            rendering: boolean
        }

        interface Component {
            props: Props;

            state: State;
        }
    }
}