declare namespace Console {
    namespace LinkShareRetainSecureValidation {
        interface Props extends React.Props<any> {
            /**
             * 登录密码验证成功
             */
            onValidateSuccess: () => void;
        }

        interface State {
            /**
             * 进行外链留底审计的登录密码，权责集中模式下为系统管理员；权责分离模式下安全管理员
             */
            vCode: string;

            /**
             * 错误
             */
            error: any;
        }
    }
}