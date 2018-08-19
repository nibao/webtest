declare namespace Components {
    namespace FullSearch {
        namespace FullTextSearch {
            namespace ConditionBox {

                interface Props extends React.Props<any> {
                    /**
                     * 是否在加载，防止用户提前打开更多筛选项报错
                     */
                    isLoading: boolean;

                    /**
                     * 是否触发了搜索
                     */
                    isSearching: boolean;

                    /**
                     * 可用自定义属性集合
                     */
                    customAttributes: Array<Components.FullSearch.FullTextSearch.LevelsMenu.Node>;

                    /**
                     * 是否显示更多条件筛选框
                     */
                    enableMoreCondition: boolean;

                    /**
                     * 目录范围
                     */
                    searchRange: { docid: string, root: boolean };

                    /**
                     * 文档标签
                     */
                    searchTags: Array<string>;

                    /**
                     * 裁剪最大长度
                     */
                    numberOfChars: number;

                    /**
                     * 是否显示更多条件筛选框
                     */
                    onMoreConditionChange: (enableMoreCondition: boolean) => void;

                    /**
                     * 扩展名变更
                     */
                    onExtChange: (ext: Array<string>) => void;

                    /**
                     * 文件大小变更
                     */
                    onSizeRangeChange: (sizeRange: { 'condition': string, lvalue: number, rvalue: number }) => void;

                    /**
                     * 自定义属性变更
                     */
                    onCustomAttrChange: (customattr: { attr: number, condition: string, level: number, lvalue: number, rvalue: number }) => void;

                    /**
                     * 匹配内容范围变更
                     */
                    onKeysFieldsChange: (keysfields: Array<string>) => void;

                    /**
                     * 搜索范围变更
                     */
                    onSearchRangeChange: (range: Array<Components.FullSearch.FullTextSearch.Node>) => void;

                    /**
                     * 标签关键词变更
                     */
                    onTagKeysChange: (tagKeys: Array<string>) => void;

                    /**
                     * 时间条件变更
                     */
                    onDateChange: (dateRange: Array<number>, dateType: number) => void;

                    /**
                     * 警告提示语消失
                     */
                    onWarningChange: () => void;

                }

                interface State {
                    /**
                     * 顶层视图集
                     */
                    nodes: Array<Components.FullSearch.FullTextSearch.Node>;

                    /**
                     * 可用自定义属性集合
                     */
                    customAttributes: Array<Components.FullSearch.FullTextSearch.LevelsMenu.Node>;

                    /**
                     * 文件类型选中项
                     */
                    typeSelection: Array<string>;

                    /**
                     * 其他文档类型数组
                     */
                    otherTypeKeys: Array<string>;

                    /**
                     * 是否显示更多筛选项
                     */
                    enableMoreCondition: boolean;

                    /**
                     * 是否显示其他文档类型输入框
                     */
                    isOtherType: boolean;

                    /**
                     * 选中节点
                     */
                    selectedNode: Components.FullSearch.FullTextSearch.Node;

                    /**
                     * 节点范围标题
                     */
                    searchRangeTitle: string;

                    /**
                     * 标签组
                     */
                    tagKeys: Array<string>;

                    /**
                     * 开始、结束时间范围
                     */
                    dateRange: Array<number>;

                    /**
                     * 时间范围类型 ： 不限 0 | 创建 1 | 修改 2
                     */
                    dateType: number;

                    /**
                     * 大小范围信息
                     */
                    sizeRangeInfo: {
                        rangeLeftValue: string;
                        rangeRightValue: string;
                        rangeLeftType: string;
                        rangeRightType: string;
                    };

                    /**
                     * 匹配范围
                     */
                    contentRange: { name: string, key: Array<string> };

                    /**
                     * 是否在加载，防止用户提前打开更多筛选项报错
                     */
                    isLoading: boolean;
                }
            }
        }
    }
}