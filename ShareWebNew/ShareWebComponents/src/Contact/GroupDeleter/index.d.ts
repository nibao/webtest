declare namespace Components {
    namespace Contact {
        namespace GroupDeleter {

            interface Props extends React.Props<any> {
                /**
                 * 关闭对话框
                 */
                onCancelDelete: () => void;

                /**
                 * 确认修改
                 */
                onConfirmDelete: () => void;
            }

            interface State {

            }
        }
    }
}