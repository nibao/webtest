declare namespace Components {
    namespace LinkDocs {
        namespace ContextMenu {
            interface Props extends React.Props<any> {
                /**
                 * 定位
                 */
                position: ReadonlyArray<number>;

                /**
                 * 是否显示
                 */
                open: boolean;

                /**
                 * 路径数组
                 */
                crumbs: ReadonlyArray<any>;

                /**
                 * 选中项数组
                 */
                selections: ReadonlyArray<any>;

                /**
                 * 是否有下载权限
                 */
                downloadEnable: boolean;

                /**
                 * 关闭
                 */
                onRequestClose: () => any;

                /**
                 * 刷新
                 */
                onRequestRefresh: () => any;

                /**
                 * 转存
                 */
                onRequrestSaveTo: () => any;

                /**
                 * 下载
                 */
                onRequestDownload: () => any;
            }
        }
    }
}