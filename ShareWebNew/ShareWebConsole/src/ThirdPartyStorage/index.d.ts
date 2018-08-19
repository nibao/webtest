declare namespace Console {
    namespace ThirdPartyStorage {
        interface Props {
            /**
             * 第三方存储配置
             */
            thirdPartyOSSInfo: Core.EVFS.ncTEVFSOSSInfo;

            /**
             * 存储模式
             * Swift 存储 0
             * 第三方 存储 2
             */
            storageMode: number;

        }

        interface State {
            /**
             * 第三方存储配置
             */
            thirdPartyOSSInfo: Core.EVFS.ncTEVFSOSSInfo;

            /**
             * 错误提示信息
             */
            errorStatus: number;

            /**
             * 供应商选中项
             * LIKE { name: '请选择第三方服务商', value: 'empty' }
             */
            providerSelection: object;

            /**
             * 输入框是否有变动
             */
            isAnyInputChange: boolean;

            /**
             * 等待提示信息
             */
            loadingStatus: number;

            /**
             * 是否灰化服务商选项
             */
            lockProvider: boolean;

            /**
             * 验证状态
             */
            validateState: {
                httpPort: number,
                httpsPort: number,
            };

            /**
             * 错误信息
             */
            errMsg: string;

            /**
             * 保存成功后的服务器地址
             */
            serverName: string;

        }
    }
}