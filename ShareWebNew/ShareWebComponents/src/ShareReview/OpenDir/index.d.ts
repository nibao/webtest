declare namespace Components {
    namespace ShareReview {
        namespace OpenDir {
            interface Props extends React.Props<any> {
                /**
                 * 正在加载
                 */
                loading: boolean;

                /**
                 * 标密系统id
                 */
                csfSysId: string;

                /**
                 *  列表数据
                 */
                list: ReadonlyArray<Core.Docs.Doc>;

                /**
                 * 审核列表选中项
                 */
                listSelection: Core.Docs.Doc;

                /**
                 * 密级枚举数组
                 */
                csfTextArray: ReadonlyArray<string>;

                /**
                 * 列表双击事件
                 */
                onDoubleClick: (e: React.MouseEvent<HTMLSpanElement>, selectedData: Core.Docs.Doc) => void;

                /**
                 * 选中事件
                 */
                handleSelectionChange: (selectedData: Core.Docs.Doc) => void;

                /**
                 * 点击下载按钮事件
                 */
                doDownload: (doc: Core.Docs.Doc) => void;

                /**
                 * 打开文件/文件夹
                 */
                doOpenDoc: (e: React.MouseEvent<HTMLSpanElement>, doc: Core.Docs.Doc) => void;

            }
        }
    }
}