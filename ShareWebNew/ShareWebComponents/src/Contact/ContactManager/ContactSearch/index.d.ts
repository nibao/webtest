declare namespace Components {
    namespace ContactSearch {

        interface Props extends React.Props<any> {

            /**
             * 点击匹配结果
             */
            onSelect: (res: {}) => void;

            /**
             * 输入框宽度
             */
            width: number;


        }

        interface State {

            /**
             * 锚点
             */
            anchor: object;

            /**
             * 匹配结果
             */
            result: Array<Core.APIs.EACHTTP.SearchedContactUser2>;

        }
    }
}