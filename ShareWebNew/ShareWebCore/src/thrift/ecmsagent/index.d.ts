declare namespace Core {
    namespace ECMSAgent {

        /******************************数据类型定义********************************/

        /**
         * 虚拟设备信息
         */
        type ncTSwiftDevice = {
            /**
             * 设备ID
             */
            dev_id: number;
            /**
             * 设备区域
             */
            region: number;

            /**
             * 设备分区
             */
            zone: number;
            /**
             * 设备IP地址
             */
            ip: string;

            /**
             * 设备TCP端口号
             */
            port: number;

            /**
             * 设备磁盘名称
             */
            dev_name: string;

            /**
             * 与其他设备相比，该设备的相对重量浮动；
             * 这表明生成器将尝试分配多少个分区给这个设备。
             */
            weight: number;

            /**
             * 设备分区计数
             */
            partition_count: number;

            /**
             * 设备负载均衡值
             */
            balance: number;

            /**
             * 设备总容量 GB
             */
            capacity_gb: number;
        }

        /**
         * 数据卷设备信息
         */
        type ncTDataVolume = {
            /**
             * 该数据卷在系统中的设备路径，如 /dev/sdb1 等
             */
            vol_dev_path: string;

            /**
             * 该数据卷所属数据盘在系统中的设备路径，如 /dev/sdb
             */
            disk_dev_path: string;

            /**
             * 数据卷容量大小，单位 GB
             */
            capacity_gb: number;

            /**
             * 文件系统类型，如 xfs
             */
            fs_type: string;

            /**
             * 该数据卷的挂载点标识，若未创建过挂载点标识，则为 ""
             */
            mount_uuid: string;

            /**
             * 该数据卷在系统中的挂载路径，若当前未挂载，则为 ""
             */
            mount_path: string;

            /**
             * 已使用空间，单位 GB，若当前未挂载，则未知
             */
            used_size_gb: number;
        }

        /**
         * 
         */
        type ncTSwiftRing = {

            /**
             * 分区数= 2××part_power
             */
            part_power: number;

            /**
             * 每个分区的副本数
             */
            replicas: number;

            /**
             *  The minimum number of hours between partition changes.
             *  The minimum number of hours before a partition can be reassigned.
             *  It used to decide if a given partition can be moved again.
             *  This restriction is to give the overall system enough time to settle
             *  a partition to its new location before moving it to yet another location.
             *  While no data would be lost if a partition is moved several times quickly,
             *  it could make that data unreachable for a short period of time.
             *  This should be set to at least the average full partition replication time.
             *  Starting it at 24 hours and then lowering it to what the replicator reports
             *  as the longest partition cycle is best.
             */
            min_part_hours: number;

            /**
             * 环中的分区数
             */
            partition_count: number;

            /**
             * 环上区域总数
             */
            region_count: number;

            /**
             * 环上分区总数
             */
            zone_count: number;

            /**
             * 环上设备数量
             */
            device_count: number;

            /** 
             * 负载均衡值
             */
            balance: number;

            /**
             * ring的编译版本
             */
            build_version: number;

            /**
             * 物理磁盘空间容量
             */
            physical_capacity_gb: number;

            /**
             * 逻辑磁盘空间容量
             */
            logical_capacity_gb: number;
        }

        /**
         * 服务状态
         */
        enum ncTServiceStatus {
            SS_STOPPED = 0,                     // 服务已停止
            SS_STARTED = 1,                     // 服务已启动
            SS_OTHER = 2,                       // 其他，比如部分停止
        }

        /********************************** 函数声明*****************************/


    }
}