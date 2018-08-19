declare namespace Components {
    namespace FullSearch {
        namespace FullTextSearch {
            interface Props extends React.Props<any> {
                /**
                 * 搜索关键词
                 */
                searchKeys: string;

                /**
                 * 目录范围
                 */
                searchRange: { docid: string, root: boolean };

                /**
                * 预览文件
                */
                doFilePreview(doc: Core.Docs.Doc): void;

                /**
                 * 跳转到文件路径
                 */
                doDirOpen(doc: Core.Docs.Doc): void;
            }

            /**
             * 搜索范围目录节点
             */
            interface Node {

                /**
                 * 数据
                 */
                data: {
                    doc_type: string; // 'father' | 'child'
                    name: string;
                },

                /**
                 * 子节点
                 */
                children: Array<Components.FullTextSearch.Node>;

                /**
                 * 是否展开/收缩
                 */
                collapse: boolean;

                /**
                 * 是否已经加载过
                 */
                loading: boolean;

                /**
                 * 是否没有子节点
                 */
                childless: boolean;

                /**
                 * 节点是否被选中
                 */
                selected: boolean;

            }
            interface State {
                /**
                 * 搜索结果数组
                 */
                resultDocs: ReadonlyArray<Core.APIs.EFSHTTP.SearchedDoc>;

                /**
                 * 搜索结果高亮内容数组
                 */
                resultHighlight: { [key: string]: Core.APIs.EFSHTTP.SearchHighlighting };

                /**
                 * 搜索结果中收藏文件数组
                 */
                resultCollections: { [docid: string]: boolean };

                /**
                 * 搜索结果中标签展示状态
                 */
                resultTagsShown: { [docid: string]: boolean };

                /**
                 * 搜索结果列表选中项
                 */
                resultSelection: ReadonlyArray<Core.APIs.EFSHTTP.SearchedDoc>;

                /**
                 * 是否在加载，防止用户提前打开更多筛选项报错
                 */
                isLoading: boolean;

                /**
                 * 是否正在搜索, 只是显示一个搜索进度条
                 */
                isSearching: boolean;

                /**
                 * 是否显示更多筛选项
                 */
                enableMoreCondition: boolean;

                /**
                 * 搜索关键字
                 */
                keys: string;

                /**
                 * 可用自定义属性集合
                 */
                customAttributes: Array<Components.FullTextSearch.LevelsMenu.Node>;

                /**
                * 搜索条件不满足时的警告
                */
                warning: boolean;

            }
        }
    }
}
