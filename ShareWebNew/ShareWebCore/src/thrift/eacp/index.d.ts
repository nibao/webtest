declare namespace Core {
    namespace EACP {

        /******************************数据类型定义********************************/


        /********************************** 函数声明*****************************/

        /**
         * 获取本地站点信息
         */
        type EditDocLibrarySiteId = Core.APIs.ThriftAPI<
            [string, string],
            void
            >
        /**
         * 设置消息设置
         */
        type SetMessageNotifyStatus = Core.APIs.ThriftAPI<
            boolean,
            void
            >
        /**
         * 获取消息设置
         */
        type GetMessageNotifyStatus = Core.APIs.ThriftAPI<
            void,
            boolean
            >
    }
}