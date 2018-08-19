declare namespace Console {
    namespace LinkShareRetainFiles {
        interface Props extends React.Props<any> {
            /**
             * 路径前缀
             */
            prefix: string;
        }

        interface State {
            /**
             * 搜索结果
             */
            results: Array<any>;

            /**
             * 搜索框的内容
             */
            value: string;

            paginator: {
                page: number,
                total: number,
                limit: number;
            },

            /**
             * '正在搜索，请稍候'是否显示
             */
            searchingNow: boolean;

            /**
             * 查看详情具体信息
             */
            fileInfo: {
                /**
                 * 创建者
                 */
                creator: string;

                /**
                 * 编辑者
                 */
                editor: string;

                /**
                 * 修改时间
                 */
                modified: number;

                /**
                 * 共享者
                 */
                sharer: string;

                /**
                 * 共享对象
                 */
                sharedObje: string;
            }
        }
    }
}