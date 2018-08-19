declare namespace Components {
    namespace Authorize {
        interface Props {
            // 用户账号
            account: string;

            // 密码
            password: string;

            // 验证成功
            onAuthorizeSuccess: (accountInfo: Object) => void;

            // 跳转至修改密码界面
            onModifyPassword: (account: string) => void

            // 取消修改密码
            onCancelModifyPwd: () => void
        }

        interface State {
            // 密码失效错误码
            pwdInvalidErrcode: number;

            // 身份验证错误
            authorizeError: Object;
        }

    }
}