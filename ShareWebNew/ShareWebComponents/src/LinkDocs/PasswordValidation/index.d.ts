declare namespace Components {
    namespace LinkDocs {
        namespace PasswordValidation {
            interface Props extends React.Props<any> {
                /**
                 * 外链
                 */
                link: string;

                /**
                 * 外链访问密码验证成功
                 */
                onValidateSuccess: (linkDoc: any) => any;

                /**
                 * 成功输入密码后，次数超过限制错误
                 */
                onError: (errcode: number) => void;
            }

            interface State {
                /**
                 * 密码输入框的值
                 */
                value: string;

                /**
                 * 错误码
                 */
                errCode: number;
            }
        }
    }
}