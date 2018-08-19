declare namespace Components {
    namespace LoginCluster {
        namespace ErrorMessage {
            interface Props extends React.Props<void> {
                /**
                 * 错误类型
                 */
                errorType: number;

                /**
                 * 确定事件
                 */
                onMessageConfirm: () => void;
            }
        }
    }

}