declare namespace Components {
    namespace DocWatermarkConfig {

        /** 
         * 水印配置 
         */
        interface Config {
            text: {
                layout: number
                color: string
                enabled: boolean
                content: string
                fontSize: number
                transparency: number
            }
            image: {
                src: string
                scale: number
                enabled: boolean
                transparency: number
                layout: number
            }
            user: {
                color: string
                fontSize: number
                enabled: boolean
                transparency: number
                layout: number
            }
        }

        interface State {
            /**
             * 配置是否改变
             */
            configChanged: boolean
            /**
             * 水印配置信息
             */
            config: Config
            /**
             * 水印配置验证结果
             */
            configValidateResult: {
                [key: string]: number
            }
            /**
             * 水印服务器是否改变
             */
            serverChanged: boolean
            /**
             * 水印服务器
             */
            server: string
            /**
             * 水印服务器验证结果
             */
            serverValidateResult: number
            /**
             * 水印服务器是否测试过
             */
            serverTested: boolean
            /**
             * 正在测试水印服务器
             */
            serverTesting: boolean
            /**
             * 水印服务器是否可连接
             */
            serverAttachable: boolean
        }
    }
}