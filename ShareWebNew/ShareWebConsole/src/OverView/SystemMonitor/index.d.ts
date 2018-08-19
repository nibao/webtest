declare namespace Console {
    namespace SystemMonitor {
        interface Props extends React.Props<void> {
            /**
             * 查看系统详情
             */
            doSystemDetailRedirect: () => void;
        }

        interface State {
            /**
             * 告警状态
             */
            alertStatus: boolean;

            /**
             * 告警信息
             */
            alertInfo: {

                /**
                 * 缓存卷状态
                 */
                Cache_volume_status: number;

                /**
                 * 数据库同步状态
                 */
                Database_sync_status: number;

                /**
                 * RAID设备状态
                 */
                RAID_device_status: number;

                /**
                 * SSD硬盘状态
                 */
                SSD_device_status: number;

                /**
                 * 服务器状态
                 */
                Server_status: number;

                /**
                 * 存储池剩余状态
                 */
                Storage_pool_available_space: number;

                /**
                 * 存储池设备状态
                 */
                Storage_pool_device_status: number;

                /**
                 * 系统服务状态
                 */
                System_service_status: number;

                /**
                 * 系统卷状态
                 */
                System_volume_status: number;
            };

            /**
             * 邮箱
             */
            mails: Array<string> | null,

            /**
             * 测试邮箱成功
             */
            testMailSuccess: boolean;

            /**
             * 错误弹窗
             */
            error: {
                /**
                 * 后端返回的错误消息
                 */
                errorInfo: any;

                /**
                 * 错误原因
                 */
                errorReason: number;
            } | null;

            /**
             *  获取监控服务状态
             */
            zabbixStatus: boolean;
        }
    }
}