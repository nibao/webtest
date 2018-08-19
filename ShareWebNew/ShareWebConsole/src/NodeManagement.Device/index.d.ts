declare namespace Console {
    namespace NodeManagementDevice {
        interface Props extends React.Props<any> {
            /**
             * 节点信息
             */
            node: object;
        }

        interface State {
            /**
             * 初始化加载数据等待提示
             */
            processingInit: boolean;

            /**
             * 控制系统设备的展开与关闭
             */
            openSystem: boolean;

            /**
             * 控制磁盘设备的展开与关闭
             */
            openDisk: boolean;

            /**
             * cpu使用率
             */
            cpuUsage: number;

            /**
             * 内存使用率
             */
            memoryInfo: Core.ECMSManager.MemoryInfo;

            /**
             * 网络发送速率
             */
            networkOutgoingRate: number;

            /**
             * 网络接收速度
             */
            networkIncomingRate: number;

            /**
             * 系统卷信息
             */
            sysVolume: Core.ECMSManager.ncTVolume;

            /**
             * 缓存盘信息
             */
            cacheVolume: Core.ECMSManager.ncTVolume;

            /**
             * 磁盘设备详细信息(由系统、缓存、数据、空闲磁盘信息组装而成)
             */
            diskDevices: ReadonlyArray<object> | null;
        }
    }
}

