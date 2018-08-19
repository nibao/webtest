declare namespace Components {
    namespace TagAdderConfig {
        interface Props extends React.Props<any> {
            /**
             * 允许添加的最大标签数量
             */
            maxTags: number;

            /**
             * 高度
             */
            height: number;

            /**
             * 宽度
             */
            width: number;

            /**
             * 当输入不合法或者超过允许的最大标签数量时触发
             */
            onWarning: (warningCode: number) => any;

            /**
             * 当新增或者删除一个标签时，触发
             */
            onUpdateTags(tags: Array<string>): void;

        }

        interface State {
            /**
             * input的值
             */
            inputValue: string;

            /**
             * 搜索的结果
             */
            results: Array<string>;

            /**
             * 已经添加的标签
             */
            tags: Array<string>;

            /**
             * input的宽度
             */
            width: number;

            /**
             * label
             */
            labelValue: string;

        }
    }
}