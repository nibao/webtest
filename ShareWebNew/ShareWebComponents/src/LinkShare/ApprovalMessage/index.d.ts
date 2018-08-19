declare namespace Components {
    namespace LinkShare {
        namespace ApprovalMessage {
            interface Props extends React.Props<void> {
                /**
                 * 确认提示触发
                 */
                onConfirm: () => any;

                /**
                 * 点击审核链接触发
                 */
                doApprovalCheck: () => any;
            }
        }
    }
}