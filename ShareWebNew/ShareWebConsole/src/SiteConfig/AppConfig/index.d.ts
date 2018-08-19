declare namespace Console {
    namespace AppConfig {
        interface Props extends React.Props<void> {
            /**
             * 当应用组件中的web客户端 http/https 端口改变时调用该函数，用于更改最新状态的端口值
             */
            changeAppConfigWebClientPorts: (
                webClientHttps: number | string,
                webClientHttp: number | string,
                oldWebClientHttps: number | string,
                oldWebClientHttp: number | string,
            ) => void

            /**
             * 当应用组件中的对象存储 http/https 端口改变时调用该函数，用于更改最新状态的端口值
             */
            changeAppConfigObjPorts: (
                objStorageHttps: number | string,
                objStorageHttp: number | string,
                oldObjStorageHttps: number | string,
                oldObjStorageHttp: number | string,
            ) => void
        }

        interface State {
            /**
             * 应用服务中访问地址输入值
             */
            appServiceAccessingAddress: string

            /**
             * 对象存储访问地址输入值
             */
            objectStorageAccessingAddress: string

            /**
            * Web客户端访问端口输入值
            */
            webClientPort: {
                /**
                 * Web客户端访问https端口输入值
                 */
                https: number | string

                /**
                 * Web客户端访问http端口输入值
                 */
                http: number | string
            }

            /**
            * 对象存储端口输入值
            */
            objStorePort: {
                /**
                 * 对象存储https端口输入值
                 */
                https: number | string

                /**
                 * 对象存储http端口输入值
                 */
                http: number | string
            }

            /**
             * 应用服务中访问地址ValidateBox验证状态
             */
            appServiceAccessingAddressStatus: number

            /**
             * 对象存储访问地址ValidateBox验证状态
             */
            objectStorageAccessingAddressStatus: number

            /**
             * web客户端访问https端口ValidateBox验证状态
             */
            webClientHttpsStatus: number

            /**
             * web客户端访问http端口ValidateBox验证状态
             */
            webClientHttpStatus: number

            /**
             * 对象存储https端口ValidateBox验证状态
             */
            objStorageHttpsStatus: number

            /**
             * 对象存储http端口ValidateBox验证状态
             */
            objStorageHttpStatus: number

            /**
             * 弹窗状态
             */
            dialogStatus: number

            /**
             * 若应用服务被改变则 保存/取消 按钮出现
             */
            isAppServiceChanged: boolean

            /**
             * 若对象存储端口被改变则 保存/取消 按钮出现
             */
            isObjectStorageChanged: boolean

            /**
             * ErrorDialog 中的错误提示
             */
            errorMessage: string

            /**
             * 获取应用节点信息
             */
            thirdPartyOSSInfo: Core.EVFS.ncTEVFSOSSInfo

            /**
             * 转圈圈组件状态
             */
            loadingStatus: boolean
        }
    }
}