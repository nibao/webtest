declare namespace Components {
    namespace Delete {
        namespace DirLockedWarning {
            interface Props extends React.Props<any> {
                /**
                 * 子文件被锁定的文件夹
                 */
                doc: Core.Docs.Doc;

                /**
                 * 需要移动的所有文件
                 */
                docs: Core.Docs.Docs;

                /**
                 * 点击“取消”
                 */
                onCancel: () => void;

                /**
                 * 点击"确定"
                 */
                onConfirm: () => void;

                /**
                 * 复选框发生变化
                 */
                onChange: (checked: boolean) => void;
            }
        }
    }
}