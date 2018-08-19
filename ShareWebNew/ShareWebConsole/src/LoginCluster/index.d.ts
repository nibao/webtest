declare namespace Components {
    namespace LoginCluster {
        interface Props extends React.Props<void> {
            /**
             * 登录成功
             */
            onLoginSuccess?: (user: any) => void;
        }

        interface State {
            /**
             * 应用系统主节点ip，没有应用节点值为false
             */
            appIp: string | boolean;

            /**
             * 登录名
             */
            loginName: string;

            /**
             * 登录密码
             */
            password: string;

            /**
             * 认证类型
             */
            authType: number;

            /**
             * 文本框聚焦状态
             */
            focusing: number;

            /**
             * 登录状态
             */
            loginStatus: number;

            /**
             * 登录验证状态
             */
            loginAuthStatus: number;

            /**
             * 验证失败详情
             */
            authFailedDetail: object | null;

            /**
             * 是否需要验证码
             */
            requireCaptcha: boolean;

            /**
             * oem文字
             */
            slogan: string;

            /**
             * 验证码图片信息
             */
            captchaInfo?: Core.APIs.EACHTTP.Vcode;

            /**
             * 文本框输入的验证码
             */
            vcode?: string;

            /**
             * 是否显示修改密码窗口
             */
            showChangePassword: boolean;
        }
    }
}