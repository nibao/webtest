declare namespace Components {
    namespace DocSelector2 {
        namespace EntryDocs {
            interface Props extends React.Props<any> {
                /**
                 * 分类视图数组
                 */
                viewsinfo: Core.Docs.Docs;

                /**
                 * 状态为打开的分类视图数组
                 */
                viewsOpen: Core.Docs.Docs;

                /**
                 * 列举结果
                 */
                list: {
                    /**
                     * 列举结果的文件夹
                     */
                    dirs: Core.Docs.Docs;

                    /**
                     * 列举结果的文件
                     */
                    files: Core.Docs.Docs;
                };

                /**
                 * 选择项数组
                 */
                selections: Core.Docs.Docs;

                /**
                 * 切换分类视图，展开 or 不展开
                 */
                onToggleViewOpen: (viewDocType: number) => void;

                /**
                 * 打开文件夹
                 */
                onRequestOpenDir: (doc: Core.Docs.Doc) => void;
            }

            interface State {
                /**
                 * 分类视图
                 */
                viewDocTypes: Core.Docs.Docs;

                /**
                 * 分类视图下的入口文档
                 */
                viewDocs: any;

                /**
                 * 分类视图下的选中项
                 */
                viewSelections: any;
            }
        }
    }
}