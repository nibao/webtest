declare namespace Console {
    namespace NodeManagementDevice {
        namespace System {
            interface Props extends React.Props<any> {
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
            }
        }
    }
}
