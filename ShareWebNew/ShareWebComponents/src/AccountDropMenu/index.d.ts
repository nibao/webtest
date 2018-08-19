declare namespace Components {
    namespace AccountDropMenu {
        interface Props extends React.Props<any> {
            /**
             * 外链信息
             */
            link?: string;

            /**
             * 修改密码
             * 没有参数：打开修改密码弹出框
             * 有passwordUrl参数：打开修改密码链接地址：passwordUrl
             */
            doChangePassword: (passwordUrl: string) => any;

            /**
             * 查看帮助
             * @param helperUrl:帮助链接地址
             */
            doOpenHelp: (helperUrl: string) => any;

            /**
             * 用户协议
             */
            doOpenAgreement: (agreementUrl: string) => any;

            /**
             * 管理控制台
             * @param consoleUrl:控制台地址
             */
            doOpenConsole: (consoleUrl: string) => any;

            /**
             * 打开客户端
             * @param host:客户端服务器环境地址
             */
            doOpenClient: (host: string) => any;

            /**
             * 退出登录
             * @param url:退出后跳转地址
             */
            doLogout: (url) => any;

            /**
             * 进入云盘
             */
            doEnterDisk: () => any;
        }

        interface State {
            /**
             * 用户配额空间信息{used: number;quota: number;}
             */
            quotainfo: object;

            /**
             * 用户配置信息
             * {
             * passwordUrl:string;//跳转到的修改密码的地址
             * forbidOstype:string;//判断要不要显示打开客户端
             * userAgreement:boolean;//是否显示用户协议
             * helper:string;//帮助链接地址
             * usertype:string;//用户类型
             * }
             */
            config: object;
        }
    }
}