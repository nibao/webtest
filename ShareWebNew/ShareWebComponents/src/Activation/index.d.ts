declare namespace Components {
    namespace Activation {

        interface Props extends React.Props<any> {
            /**
             * 帐户 的值
             */
            account: string;

            /**
             * 激活成功
             */
            onActivatedSuccess: (userid, tokenid) => any;

            /**
             * 激活之后又去激活
             */
            onActivitedDetected: () => any;
        }

        interface State {
            value: {
                /**
                 * password 的值
                 */
                password: string,

                /**
                 * email 的值
                 */
                email: string,

                /**
                 * phone 的值
                 */
                phone: string,

                /**
                 * caprcha 的值
                 */
                CATCHA: string
            },

            validate: {
                /**
                 * password validate的值
                 */
                password: number,

                /**
                 * email validate的值
                 */
                email: number,

                /**
                 * phone validate的值
                 */
                phone: number,

                /**
                 * caprcha validate的值
                 */
                CATCHA: number
            },

            /**
             * 账户名称
             */
            account: string,

            /**
             * 后端的错误码
             */
            statusCode: number,

            /**
             * 时间
             */
            time: number
        }
    }
}