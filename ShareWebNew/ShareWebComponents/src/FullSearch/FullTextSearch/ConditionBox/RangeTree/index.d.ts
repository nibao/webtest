declare namespace Components {
    namespace FullSearch {
        namespace RangeTree {

            interface Props extends React.Props<any> {
                /**
                 * 范围路径
                 * {
                 *      docid: GNS路径,
                 *      root: 是否为所有目录
                 * }
                 */
                searchRange: { docid: string; root: boolean };

                /**
                 * 搜索范围变更
                 */
                onSearchRangeChange: (range: Array<Components.FullSearch.FullTextSearch.Node>) => void;

            }

            interface State {
                /**
                 * 节点
                 */
                node: Array<Components.FullSearch.FullTextSearch.Node>;

                /**
                 * 选中节点
                 */
                selectedNode: Components.FullSearch.FullTextSearch.Node;

                /**
                 * 节点范围标题
                 */
                searchRangeTitle: string;
            }
        }
    }

}