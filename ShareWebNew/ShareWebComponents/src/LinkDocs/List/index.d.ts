declare namespace Components {
    namespace LinkDocs {
        namespace List {
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
                 * 选中的文档对象数组
                 */
                selections?: ReadonlyArray<any>;

                /**
                 * 是否是多选模式
                 */
                checkbox?: boolean;

                /**
                 * 是否有下载权限
                 */
                downloadEnable: boolean;

                /**
                 * 内容为空组件
                 */
                EmptyComponent?: React.ReactNode | React.StatelessComponent<void>;

                /**
                 * 选中项发生变化
                 */
                onSelectionChange?: (selections: ReadonlyArray<any>) => any;

                /**
                 * 右击事件
                 */
                onContextMenu?: () => any;

                /**
                 * 打开文件夹
                 */
                onRequestOpenDir: (linkDoc: any, { newTab }: { newTab: boolean }) => any;

                /**
                 * 下载
                 */
                onRequestDownload: (docs: ReadonlyArray<any>) => any;

                /**
                 * 转存
                 */
                onRequrestSaveTo?: (docs: ReadonlyArray<any>) => any;
            }
        }
    }
}