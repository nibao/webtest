declare namespace Components {
    namespace Server {
        namespace ConfirmMessage {
            interface Props extends React.Props<void> {
                /**
                 * 确定事件
                 */
                onMessageConfirm: () => void;

                /**
                 * 取消事件
                 */
                onMessageCancel: () => void;
            }
        }
    }

}