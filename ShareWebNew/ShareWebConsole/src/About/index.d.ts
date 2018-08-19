declare namespace Components {
    namespace AboutProduct {

        interface Props extends React.Props<any> {

        }

        interface State {

            sysInfo: {
                /**
                * 产品名称（如：爱数AnyShare）
                */
                product: string;

                /**
                 * 版本信息（如：5.0.21.7443 (20180131)）
                 */
                version: Array<string>;

                /**
                 *许可证信息
                 */
                deviceInfo: DeviceInfo;

                /**
                 * 版权信息（如：版权所有@）
                 */
                copyright: string;
            };

            /**
            * 是否显示产品名称
            */
            showProduct: boolean;

            /**
            *是否显示产品型号
            */
            showHardware: boolean;

            /**
             *是否显示许可证信息
             */
            showLicense: boolean;

            /**
             * 是否显示版权信息
             */
            showCopyright: boolean;
        }

        /**
         *设备信息
         */
        interface DeviceInfo {
            /**
             *设备型号
             */
            hardwareType: string;

            /**
             *授权天数
             */
            authDays: number;

            /**
             *授权状态（1未授权；2已授权；3已过期；4已失效 ）
             */
            authStatus: number;

            /**
             *授权类型（1未授权；2测试授权；3正式授权）
             */
            authType: number;
        }
    }
}