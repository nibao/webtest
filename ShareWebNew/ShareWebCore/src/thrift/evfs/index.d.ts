declare namespace Core {
    namespace EVFS {

        /******************************数据类型定义********************************/

        /**
         * 第三方存储配置信息
         */
        type ncTEVFSOSSInfo = {
            /**
             * 内部服务器地址
             */
            internalServerName: string;

            /**
             * CDN 加速域名
             */
            cdnName: string;

            /**
             * 使用对象存储的账户key
             */
            accessKey: string;

            /**
             * 服务提供商
             */
            provider: string;

            /**
             * Bucket
             */
            bucket: string;

            /**
             * 使用对象存储的账户id
             */
            accessId: string;

            /**
             * 服务器http端口
             */
            httpPort?: number;

            /**
             * 服务器http端口
             */
            httpsPort?: number;

            /**
             * 0 表示为了兼容性保存的已启用存储，1 表示可选的新存储
             */
            type?: number;

            /**
             * 服务器地址
             */
            serverName: string;
        }

        /********************************** 函数声明*****************************/

        /**
         * 获取第三方对象存储服务信息
         */
        type GetThirdPartyOSSInfo = Core.APIs.ThriftAPI<
            void,
            ncTEVFSOSSInfo
            >
        /**
         * 设置第三方对象存储服务信息
         */
        type SetThirdPartyOSSInfo = Core.APIs.ThriftAPI<
            [ncTEVFSOSSInfo],
            void
            >
        /**
         *  验证第三方对象存储服务是否可以通信
         */
        type ConnectThirdPartyOSS = Core.APIs.ThriftAPI<
            [ncTEVFSOSSInfo],
            boolean
            >
    }

    type ncTLimitSuffixDoc = {

        /**
         *  后缀类型名
         */
        suffixType: number;

        /**
         *  具体后缀
         */
        suffixes: string;

        /**
         *  拒绝标识
         */
        denyFlag: boolean;
    }

    /********************************** 函数声明*****************************/

    /**
     * 获取第三方对象存储服务信息
     */
    type GetThirdPartyOSSInfo = Core.APIs.ThriftAPI<
        void,
        ncTEVFSOSSInfo
        >
    /**
     * 设置第三方对象存储服务信息
     */
    type SetThirdPartyOSSInfo = Core.APIs.ThriftAPI<
        [ncTEVFSOSSInfo],
        void
        >
    /**
     *  验证第三方对象存储服务是否可以通信
     */
    type ConnectThirdPartyOSS = Core.APIs.ThriftAPI<
        [ncTEVFSOSSInfo],
        boolean
        >

    type GetFileSuffixLimit = Core.APIs.ThriftAPI<
        void,
        Array<ncTLimitSuffixDoc>
        >
    /**
    * 获取登录验证码配置信息
    */
    type SetFileSuffixLimit = Core.APIs.ThriftAPI<
        [Array<ncTLimitSuffixDoc>],
        void
        >
}
