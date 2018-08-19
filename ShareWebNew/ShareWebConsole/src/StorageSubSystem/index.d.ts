declare namespace Console {
    namespace StorageSubSystem {
        interface Props {

        }

        interface State {

            /**
             * 第三方配置信息
             */
            thirdPartyOSSInfo: Core.EVFS.ncTEVFSOSSInfo;

            /**
             * 存储池初始化状态
             */
            storageInitStatus: number;

            /**
             * 管理模式： 存储节点管理 | 存储池管理
             */
            manageMode: number;

            /**
             * 存储模式
             * Swift 存储 0
             * 第三方 存储 2
             */
            storageMode: number;
            
            /**
             * 等待提示状态
             */
            loadingStatus: number;
        }


    }
}