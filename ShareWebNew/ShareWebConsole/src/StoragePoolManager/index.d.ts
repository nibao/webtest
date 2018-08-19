declare namespace Console {
    namespace StoragePoolManager {
        interface Props {
            /**
             * 存储池初始化状态
             */
            storageInitStatus: number;

            /**
             * 初始化成功时触发
             */
            onInitedSucceed: () => void;
        }

        interface State {

            /**
             * 存储池初始化状态
             */
            storageInitStatus: number;

            /**
             * 存储池信息
             */
            storagePoolInfo: object;

            /**
             * 副本健康度 0.00 - 100.00
             */
            replicasHealth: number;

            /**
             * 存储池中节点设备列表
             */
            storagePoolDevices: object;

            /**
             * 存储池节点信息
             */
            storagePoolNodeInfo: ReadonlyArray<Core.ECMSManager.ncTStorageNodeInfo>;

            /**
             * 是否显示存储策略配置对话框
             */
            showStorageStrategyDialog: boolean;

            /**
             * 是否显示替换设备对话框
             */
            showReplaceDeviceDialog: boolean;

            /**
             * 是否确认进行重载均衡操作
             */
            showConfirmOverload: boolean;

            /**
             * 是否显示添加设备对话框
             */
            showAddDevicesDialog: boolean;

            /**
             * 错误提示信息
             */
            errorStatus: number;

            /**
             * 信息提示信息
             */
            confirmStatus: number;

            /**
             * 警告提示信息
             */
            warningStatus: number;

            /**
             * 等待提示
             */
            loadingStatus: number;

            /**
             * 待替换的设备对象
             */
            waitForReplacedDevice: object;

            /**
             * 待移除的设备对象
             */
            waitForDeleteDevice: object;

            /**
             * 待清空的设备对象
             */
            pendingEmptyingDevices: object;

            /**
             * 可用于替换指定存储池设备的备选空闲数据盘
             * [
             *      {
             *          name: dev_name,
             *          ...otherprops
             *      }
             * 
             * ]
             */
            freeReplacePoolDevices: Array<object>;

            /**
             * 是否有设备离线，若有逻辑存储空间和物理存储空间使用率值用红色文字显示为：无法读取，进度条不显示
             */
            isSomeDeviceOffline: boolean;

            /**
             * 服务器管理路由
             */
            serverPath: string;

            /**
             * 错误信息
             */
            errorMsg: string;
        }


    }
}