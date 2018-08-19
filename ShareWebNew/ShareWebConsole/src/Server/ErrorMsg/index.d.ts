declare namespace Components {
    namespace Server {
        namespace ErrorMsg {
            interface Props extends React.Props<void> {
                /**
                 * 操作类型
                 */
                operation: number;
                /**
                 * 错误信息
                 */
                errorInfo: any;

                /**
                 * 确定事件
                 */
                onConfirmErrMsg: () => void;
            }
        }
    }

}