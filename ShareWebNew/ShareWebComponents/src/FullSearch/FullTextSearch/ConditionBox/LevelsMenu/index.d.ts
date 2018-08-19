declare namespace Components {
    namespace FullSearch {
        namespace FullTextSearch {
            namespace LevelsMenu {
                interface Node {
                    /**
                     * 子节点
                     */
                    child: Components.FullTextSearch.LevelsMenu.Node;

                    /**
                     * 父节点
                     */
                    parent: Components.FullTextSearch.LevelsMenu.Node;

                    /**
                     * ID
                     */
                    id: number;

                    /**
                     * 层级
                     */
                    level: number;

                    /**
                     * 名称
                     */
                    name: string;

                    /**
                     * 是否是'不限'
                     */
                    unlimited: boolean;

                }
                interface Props extends React.Props<any> {

                    /**
                     * 标题文字
                     */
                    label: string;

                    /**
                     * 样式
                     */
                    className?: string;

                    /**
                     * 下拉菜单候选项
                     */
                    candidateItems: Array<{ child: Array<Components.FullTextSearch.LevelsMenu.Node>, parent: Components.FullTextSearch.LevelsMenu.Node, id: number, level: number, name: string, unlimited: boolean }>;

                    /**
                     * 头节点
                     */
                    titleNode: Components.FullTextSearch.LevelsMenu.Node;


                }

                interface State {

                    /**
                     * 头节点
                     */
                    titleNode: Components.FullTextSearch.LevelsMenu.Node;

                    /**
                     * 是否显示层级目录
                     */
                    enablelevelMenu: boolean;

                    /**
                     * 下拉菜单候选项
                     */
                    candidateItems: Array<{ child: Array<Components.FullTextSearch.LevelsMenu.Node>, parent: Components.FullTextSearch.LevelsMenu.Node, id: number, level: number, name: string, unlimited: boolean }>;

                    /**
                     * 点击状态
                     */
                    clickStatus: boolean;
                }
            }

        }
    }
}