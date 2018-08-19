declare namespace Components {
    namespace Contact {
        namespace GroupAdder {
            interface Props extends React.Props<any> {
                /**
                 * 确认修改
                 */
                onAdd: (value: string) => void;

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