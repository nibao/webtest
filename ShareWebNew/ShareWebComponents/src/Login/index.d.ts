declare namespace Components {
    namespace Login {
        interface Props extends React.Props<void> {
            onSubmit?: Function;

            onSuccess?: Function;

            onPasswordChange: (any) => void;
        }

        interface State {
            /**
             * 密码
             */
            password: string;

            /**
             * 账户
             */
            account: string;

            /**
             * 请求状态（成功或失败，失败是错误码）
             */
            loginStatus: number;

            /**
             * 文本框聚焦状态
             */
            focusing: any;
            /**
             * 报错后的信息
             */
            errorInfo: any;

            /**
             * 是否需要验证码
             */
            captchaStatus: boolean;

            /**
             * 验证码图片信息
             */
            captchaInfo?: Core.APIs.EACHTTP.Vcode;

            /**
             * 文本框输入的验证码
             */
            vcode?: string;
        }

        type Component = React.Component<Props, State>

    }
}