declare namespace Console {
    namespace MSGConfig {

    interface Props extends React.Props<void> {

    }

    interface State {
        /**
         * 服务商
         */
        provider: number,

        /**
         * 值是否被改变
         */
        isFormChanged: boolean,

        /**
         * 是否在进行测试
         */
        testing: boolean,

        statusCode: {
            /**
             * 测试的时候后端返回的状态码
             */
            test: number,

            /**
             * 保存的时候后端返回的状态码
             */
            save: number
        },

        configInfo: {
            /**
             * appSDK的配置信息
             */
            appSDK: string,

            /**
             * appKEY的配置信息
             */
            appKEY: string,

            /**
             * modelID的配置信息
             */
            modelID: string
        },

        validateState: {
            /**
             * appSDK的validateState
             */
            appSDK: number,

            /**
             * appKEY的validateState
             */
            appKEY: number,

            /**
             * modelID的validateState
             */
            modelID: number
        }
    }
  }
}