declare namespace Components {
    namespace LinkDocs {
        namespace ToolBar {
            interface Props extends React.Props<any> {
                /**
                 * 外链文档对象
                 */
                list: {
                    /**
                     * 文件夹
                     */
                    dirs: ReadonlyArray<any>;

                    /**
                     * 文件
                     */
                    files: ReadonlyArray<any>;
                }
                /**
                 * 选中的文档对象
                 */
                selections: ReadonlyArray<any>;

                /**
                 * 路径数组
                 */
                crumbs: ReadonlyArray<any>;

                /**
                 * 是否有上传权限
                 */
                uploadEnable: boolean;

                /**
                 * 是否有下载权限
                 */
                downloadEnable: boolean;

                /**
                 * 切换全选/取消全选
                 */
                onToggleSelectAll: () => any;

                /**
                 * 下载
                 */
                onRequestDownload: () => any;

                /**
                 * 转存
                 */
                onRequrestSaveTo: (docs: ReadonlyArray<any>) => any;
            }
        }
    }
}