declare namespace Console {
    namespace EditSystemManager {
        interface Props extends React.Props<void> {
            /**
             * 管理员id
             */
            adminId: string;

            /**
             * 管理员账号
             */
            account: string;

            /**
             * 当前系统
             */
            systemType: number;

            /**
             * 当前用户显示名
             */
            displayName: string;

            /**
             * 设置成功
             */
            onEditSuccess: () => void;

            /**
             * 取消设置
             */
            onEditCancel: () => void;

            /**
             * 重定向到登陆页
             */
            doRedirect: () => void;
        }

        interface State {

            /**
             * 系统管理员账号
             */
            account: string;

            /**
             * 邮箱
             */
            mails: Array<string>;

            /**
             * 密码
             */
            password: string;

            /**
             * 账户验证
             */
            accountValidate: number;

            /**
             * 面板状态
             */
            panelStatus: number;

            /**
             * 登录错误
             */
            authError: any;

            /**
             * 设置错误
             */
            errorInfo: any;
        }
    }
}