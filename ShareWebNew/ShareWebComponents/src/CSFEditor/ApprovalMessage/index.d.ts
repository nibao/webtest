declare namespace Components {
    namespace Attributes {
        namespace ApprovalMessage {
            interface Props extends React.Props<void> {
                /**
                 * 确定事件
                 */
                onConfirm: () => void;

                /**
                 * 跳转到到审核事件
                 */
                doApprovalCheck: () => void;
            }
        }
    }
} 