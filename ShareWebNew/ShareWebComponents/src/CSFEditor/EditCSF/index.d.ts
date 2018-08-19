declare namespace Components {
    namespace CSFEditor {
        namespace EditCSF {
            interface ViewProps extends React.Props<void> {
                /**
                 * 当前选中的文档
                 */
                docs: Array<Core.Docs.Docs>;

                /**
                 * select下拉框初始选项
                 */
                defaultValue: number;

                /**
                 * 密级选项
                 */
                csfOptions: Array<any>;

                /**
                 * 确定事件
                 */
                onConfirm: (selectedCSF: number) => void;

                /**
                 * 取消定密
                 */
                onCancel: () => void;
            }

            interface ViewState {
                /**
                 * 当前选中的密级值
                 */
                selectedCSF: number;

                /**
                 * 编辑密级时的中文提示
                 */
                editCsfDetail: string;

                /**
                 * 密级选项
                 */
                csfOptions: Array<any>;
            }

            interface ClientProps extends ViewProps {

            }

            interface DesktopProps extends ViewProps {

            }
        }
    }

}