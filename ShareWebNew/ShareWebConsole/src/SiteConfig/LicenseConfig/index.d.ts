declare namespace Components {
    namespace LicenseConfig {
        type Props = {

        }

        type State = {
            /**
            * 设备信息
            */
            devinfo: ncTDeviceInfo;

            /**
             * 注册码信息集合
             */
            data: ncTLicenseInfo[];

            /**
             * 数据加载状态
             */
            isLoading: boolean;

            /**
             * 错误码
             */
            errorMsg: null | string;
        }
    }
}