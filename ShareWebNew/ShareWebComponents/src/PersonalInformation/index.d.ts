
declare namespace Components {
    namespace PersonalInformation {
        interface Props extends React.Props<any> {
            /**
             * 修改密码
             */
            doChangePassword: (password?: string) => any;
        }

        interface State {
            /**
             * 配额空间已用总大小
             */
            totalUsed: number;

            /**
             * 配额空间总大小
             */
            totalQuota: number;

            /**
             * 配额使用详情
             */
            quotaStackDatas: Array<object>;

            /**
             * 用户信息详情
             */
            userinfo: null | object;

            /**
             * 用户密级
             */
            csfLevelEnum: number;

            /**
             * 修改密码跳转地址
             */
            passwordUrl: string;

            /**
             * 修改邮箱开关
             */
            emailEditing: boolean;

            /**
             * input的邮箱字符串
             */
            emailValue: string;

            /**
             * 修改邮箱错误码
             */
            errCode: null | number;
        }
    }
}