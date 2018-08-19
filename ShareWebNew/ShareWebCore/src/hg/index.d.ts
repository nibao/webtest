declare namespace Core {
    namespace HG {
        interface HGAppConfig {
            /**
             * 第三方认证appid
             */
            appid: string

            /**
             * 第三方认证appKey
             */
            appKey: string

            /**
             * 海关总署代理服务器
             */
            server: {
                ASProxy: string

                EOSS: string
            }

            /**
             * debug模式
             */
            debug: boolean

            /**
             * host
             */
            host: string
        }
    }
}

declare const
    HGApp,
    HGPreview,
    HGRequest,
    HGUser,
    HGAppConfig: Core.HG.HGAppConfig