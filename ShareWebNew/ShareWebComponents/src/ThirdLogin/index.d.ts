declare namespace Components {
    namespace ThirdLogin {
        interface Props extends React.Props<any> {
            /**
             * 跳转SSO
             * @param authServer 第三方平台的地址
             */
            doSSO: (authServer: string) => any

            /**
             * 认证成功后执行
             */
            onAuthSuccess: () => any;
        }

        interface State {
            /**
             * 第三方认证信息
             */
            thirdauth?: Core.APIs.EACHTTP.ThirAuth;
        }

    }
}