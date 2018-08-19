declare namespace Components {
    namespace Contact {
        namespace GroupEditer {
            interface Props extends React.Props<any> {
                /**
                 * 原名称
                 */
                oldName: string;

                /**
                 * 确认修改
                 */
                onEdit: (value: string) => void;

                /**
                 * 关闭对话框
                 */
                onCancel: () => void;
   
            }

            interface State {
                /**
                 * 输入框值
                 */
                value: string;

            }
        }
    }
}