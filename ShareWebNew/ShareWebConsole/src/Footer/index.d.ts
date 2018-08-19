declare namespace Components {
    namespace Footer {
        interface Props extends React.Props<void> {

        }

        interface State {

            sysInfo: {
                /**
                 * 版本信息
                 */
                version: Array<string>;

                /**
                 * 产品信息
                 */
                product: string;

                /**
                 * 版权信息
                 */
                copyright: string;

                /**
                 * 授权信息
                 */
                license: any;
            };
            /**
             * 是否显示产品信息
             */
            showProduct: boolean;

            /**
             * 是否显示型号信息
             */
            showHardware: boolean;

            /**
             * 是否显示版权信息
             */
            showCopyright: boolean;

            /**
             * 是否显示授权信息
             */
            showLicense: boolean;
        }
    }
}