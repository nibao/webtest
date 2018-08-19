declare namespace Components {
    namespace Share {
        namespace ApvCaseDialog {
            interface Props extends React.Props<any> {
                /**
                 * 点击“确定”按钮
                 */
                onConfirm: () => void;

                /**
                 * 跳转到"权限申请"
                 */
                doApvJump: () => void;
            }
        }
    }
}