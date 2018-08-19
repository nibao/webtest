declare namespace Components {
    namespace VisitorAdder {
        namespace ToolButton {
            interface Props extends React.Component<any, any> {
                /**
                 * 选中的组织/部门/个人 个数
                 */
                selectNums: number;

                /**
                 * 取消
                 */
                onCancel: () => any;

                /**
                 * 确定
                 */
                onConfirm?: () => any;

                /**
                 * 样式
                 */
                className?: any;
            }
        }
    }
}