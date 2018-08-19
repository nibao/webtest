declare namespace Components {
    namespace FullSearch {
        namespace FullTextSearch {
            namespace ResultBox {

                interface Props extends React.Props<any> {

                    /**
                     * 搜索结果文档对象
                     */
                    resultDocs: ReadonlyArray<Core.APIs.EFSHTTP.SearchedDoc>;

                    /**
                     * 搜索结果高亮对象
                     */
                    resultHighlight: { [key: string]: Core.APIs.EFSHTTP.SearchHighlighting };

                    /**
                     * 搜索结果中标签展示状态
                     */
                    resultTagsShown: { [docid: string]: boolean };

                    /**
                     * 搜索结果收藏对象
                     */
                    resultCollections: object;

                    /**
                     * 是否正在加载或搜索中
                     */
                    isLoading: boolean;

                    /**
                     * 懒加载触发
                     */
                    onLazyLoad(): void;

                    /**
                    * 点击收藏按钮时触发
                    */
                    onClickCollect(doc: Core.APIs.EFSHTTP.SearchedDoc): void;

                    /**
                     * 选择排序项时触发
                     */
                    onSortSelect(type: object): void;

                    /**
                     * 预览文件
                     */
                    doFilePreview(doc: Core.Docs.Doc): void;

                    /**
                     * 跳转到文件路径
                     */
                    doDirOpen(doc: Core.Docs.Doc): void;

                    /**
                     * 点击展示更多标签时触发
                     */
                    onClickShowTags(doc: Core.Docs.Doc): void;

                    /**
                     * 点击添加标签至筛选条件
                     */
                    onClickAddTags(tag: string): void;

                }

                interface State {

                    /**
                     * 搜索结果收藏对象
                     */
                    resultCollections: object;

                    /**
                     * 搜索结果选中项
                     */
                    resultSelection: Array<Core.APIs.EFSHTTP.SearchedDoc>;

                    /**
                     * 选中的分享对象
                     */
                    linkShareDoc: Core.APIs.EFSHTTP.SearchedDoc | null;

                    /**
                     * 选中的内链分享对象
                     */
                    shareDoc: Core.APIs.EFSHTTP.SearchedDoc | null;

                    /**
                     * 排序选中项
                     * {
                     *      name: 'xxx'
                     *      value: 'size' | '-size' ...
                     * }
                     */
                    sortSelection: object;

                    /**
                     * 鼠标是否移入排序按钮
                     */
                    isMouseEnterSortBtn: boolean;



                }
            }
        }
    }

}