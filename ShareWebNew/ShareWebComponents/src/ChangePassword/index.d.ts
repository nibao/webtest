declare namespace Components {
    namespace ChangePassword {
        interface Props extends React.Props<void> {

            /**
             * 帐户名
             */
            account: string;

            /**
             * 当前用户是否被管控
             */
            pwdControl?: number;

            /**
             * 修改密码成功
             */
            onChangePwdSuccess: (password) => any;

            /**
             * 取消修改
             */
            onChangePwdCancel: () => any;

            /**
             * 该用户已被锁定
             */
            onUserLocked: () => any;
        }

        interface State {

            /**
             * 原始密码
             */
            password: string;

            /**
             * 新密码
             */
            newPassword: string;

            /**
             * 确认新密码
             */
            reNewPassword: string;

            /**
             * 错误信息
             */
            errorStatus: number;

            /**
             * 是否开启强密码
             */
            strongPasswordStatus: boolean;

            /**
             * 错误的附加信息
             */
            errorDetail: any;
        }
    }
}