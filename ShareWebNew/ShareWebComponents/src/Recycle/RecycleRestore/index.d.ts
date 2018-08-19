declare namespace Components {
    namespace Recycle {
        namespace RecycleRestore {
            interface Props extends React.Props<any> {

                /**
                 * 需要还原的文档
                 */
                docs: Core.Docs.Docs;

                /**
                 * 还原单个成功
                 */
                onSingleSuccess(item: any): void;

                /**
                 * 还原成功
                 */
                onSuccess: () => void;

                /**
                 * 取消还原
                 */
                onCancel: () => void;
            }

            interface State {

                /**
                 * 需要还原的文档
                 */
                recycleRestoreDocs: Array<object>;

                /**
                 * 重命名提示
                 */
                recycleRestoreRename: boolean;

                /**
                 * 是否显示还原进度弹框
                 */
                progressDialogShow: boolean;

                /**
                 * 错误码
                 */
                errorCode: number;

                /**
                 * 重名的文件对象
                 */
                renameDoc: object;

                /**
                 * 重名建议名
                 */
                suggestName: string;

                /**
                 * 是否跳过一次相同冲突提示
                 */
                skipRenameError: boolean;

                /**
                 * 是否跳过全部相同冲突提示
                 */
                skipAllRenameError: boolean;

                /**
                 * 是否显示还原确认对话框
                 */
                showRestoreConfirm: boolean;

            }
        }
    }
}