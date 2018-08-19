declare namespace Components {
    namespace FullSearch {
        namespace FullTextSearch {
            namespace SearchBox {

                interface Props extends React.Props<any> {
                    /**
                     * 搜索关键字
                     */
                    keys: string;

                    /**
                    * 搜索条件不满足时的警告
                    */
                    warning: boolean;

                    /**
                     * 搜索
                     * {
                     *      start: 开始的页数
                     * }
                     */
                    search: ({ start: number, keys: string }) => void;

                    /**
                     * 重置
                     */
                    reset: () => void;

                    /**
                     * 警告提示语消失
                     */
                    onWarningChange: () => void;
                }

                interface State {
                    /**
                     * 搜索历史菜单锚点
                     */
                    searchHistoryAnchor: object;

                    /**
                     * 是否显示搜索历史
                     */
                    enbaleSearchHistory: boolean;

                    /**
                     * 搜索历史数组
                     */
                    searchHistory: Array<string>;

                    /**
                     * 搜索关键字
                     */
                    keys: string;

                    /**
                     * 搜索框聚焦状态
                     */
                    searchInputFoucsStatus: boolean;
                }
            }
        }
    }

}