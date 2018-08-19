declare namespace Components {
    namespace AuthError {
        interface Props {
            // 错误类型
            errorType?: number;

            // 账户名
            account?: string;

            // 修改密码确定事件
            onPasswordChange?: (account: string) => void
        }
    }
}