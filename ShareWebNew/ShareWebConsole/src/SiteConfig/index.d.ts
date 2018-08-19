declare namespace Console {
    namespace SiteConfig {
        interface Props extends React.Props<void> {

        }
        interface State {
            /**
             * 当前最新状态的web客户端和对象存储的 http https 端口值
             */
            currentAppPorts: {
                /**
                 * Web客户端访问https端口输入值
                 */
                webClientHttps: number | string

                /**
                 * Web客户端访问https端口输入值
                 */
                webClientHttp: number | string

                /**
                 * 对象存储https端口输入值
                 */
                objStorageHttps: number | string

                /**
                 * 对象存储http端口输入值
                 */
                objStorageHttp: number | string
            }

            /**
             * 旧的 web客户端和对象存储的 http https 端口值
             */
            oldAppPorts: {
                /**
                * Web客户端访问https端口输入值
                */
                webClientHttps: number | string

                /**
                 * Web客户端访问https端口输入值
                 */
                webClientHttp: number | string

                /**
                 * 对象存储https端口输入值
                 */
                objStorageHttps: number | string

                /**
                 * 对象存储http端口输入值
                 */
                objStorageHttp: number | string
            }
        }
    }
}