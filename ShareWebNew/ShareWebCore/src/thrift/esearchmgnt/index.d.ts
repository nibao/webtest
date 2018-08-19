declare namespace Core {
    namespace ESearchMgnt {

        /******************************数据类型定义********************************/




        /********************************** 函数声明*****************************/

        /**
         * 卸载全文检索业务
         * 在卸载出错，或已卸载的情况下，均支持再次卸载
         * @param isDelete: 是否清除原有数据,True为清除 否则不清除
         */
        type Uninstall = Core.APIs.ThriftAPI<
            [boolean],
            void
            >


    }
}