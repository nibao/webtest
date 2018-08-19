declare namespace Components {
    namespace LoginCluster {
        namespace ModifyPassword {
            interface Props extends React.Props<void> {
                /**
                 * 确定修改事件
                 */
                onModifyConfirm: () => void;

                /**
                 * 取消修改事件
                 */
                onModifyCancel: () => void;
            }
        }
    }
} 