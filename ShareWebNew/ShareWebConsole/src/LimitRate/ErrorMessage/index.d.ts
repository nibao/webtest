declare namespace Components {
    namespace LimitRate {
        namespace ErrorMsg {
            interface Props extends React.Props<void> {
                /**
                 * 错误信息
                 */
                errorInfo: any;

                /**
                 * 确认事件
                 */
                onConfirmErrMsg: () => void;
            }
        }
    }
}