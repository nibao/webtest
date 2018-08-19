declare namespace Components {
    namespace ShareReview {
        namespace ReviewList {
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
                 * 审核类型
                 */
                reviewType: number;

                /**
                 *  审核列表数据
                 */
                applyInfos: ReadonlyArray<Core.APIs.EACHTTP.ApplyApproval | Core.APIs.EACHTTP.ShareApproveHistory>;

                /**
                 * 审核列表选中项
                 */
                listSelection: Core.APIs.EACHTTP.ApplyApproval | Core.APIs.EACHTTP.ShareApproveHistory;

                /**
                 * 密级枚举数组
                 */
                csfTextArray: ReadonlyArray<string>;

                /**
                 * 审核事件
                 */
                doReview: (applyInfo: Core.APIs.EACHTTP.ApplyApproval) => void;

                /**
                 * 右键菜单事件
                 */
                handleContextMenu: (e: React.MouseEvent<HTMLDivElement>, selection: Core.APIs.EACHTTP.ApplyApproval | Core.APIs.EACHTTP.ShareApproveHistory, index: number) => void;

                /**
                 * 打开文件/文件夹事件
                 */
                doOpenDoc: (e: React.MouseEvent<HTMLSpanElement>, selectedData: Core.APIs.EACHTTP.ApplyApproval | Core.APIs.EACHTTP.ShareApproveHistory) => void;

                /**
                 * 列表双击事件
                 */
                onDoubleClick: (e: React.MouseEvent<HTMLSpanElement>, selectedData: Core.APIs.EACHTTP.ApplyApproval | Core.APIs.EACHTTP.ShareApproveHistory, index: number) => void;

                /**
                 * 选中事件
                 */
                handleSelectionChange: (selectedData: Core.APIs.EACHTTP.ApplyApproval | Core.APIs.EACHTTP.ShareApproveHistory) => void;

                /**
                 * 点击下载按钮事件
                 */
                doDownload: (selectedData: Core.APIs.EACHTTP.ApplyApproval) => void;

                /**
                 * 工具栏
                 */
                ToolBar: any;

            }
        }
    }
}