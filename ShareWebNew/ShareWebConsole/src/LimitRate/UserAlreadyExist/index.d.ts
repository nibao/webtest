declare namespace Components {
    namespace LimitRate {
        namespace UserAlreadyExist {
            interface Props extends React.Props<void> {
                /**
                 * 限速类型
                 */
                limitType: number;

                /**
                 * 已存在的用户/部门
                 */
                userExisted?: any;

                /**
                 * 确定事件
                 */
                onUserExistedConfirm: () => void;
            }
        }
    }
}