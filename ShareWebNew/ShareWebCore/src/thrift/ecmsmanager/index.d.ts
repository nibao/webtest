
declare namespace Core {
    namespace ECMSManager {

        /******************************数据类型定义********************************/
        /**
         * 应用节点
         */
        type ncTAppNodeInfo = {
            /**
             * 节点uuid
             */
            node_uuid: string;

            /**
             * 节点别名
             */
            node_alias: string;

            /**
             * 节点ip
             */
            node_ip: string;

            /**
             * 应用服务状态
             */
            service_status: boolean;

            /**
             * 节点lvs状态
             */
            lvs_status: boolean;

            /**
             * 节点在线状态
             */
            is_online: boolean;
        }

        /**
         * 数据库节点结构
         */
        type ncTDBNodeInfo = {
            /**
             * 节点uuid
             */
            node_uuid: string;

            /**
             * 节点别名
             */
            node_alias: string;

            /**
             * 节点ip
             */
            node_ip: string;

            /**
             * 数据库角色 master:主数据库 | slave:从数据库
             */
            db_role: string;

            /**
             * 数据库端口服务状态: "running", "stopped", "errorxxx"
             */
            service_status: string;

            /**
             * 数据库端口同步状态: "running", "stopped", "", "errorxxx"
             * 单节点场景下为 ""
             * 查询出错的情况下为具体错误"errorxxx"
             */
            slave_status: string;

            /**
             * 节点在线状态
             */
            is_online: boolean;
        }

        /**
         * 存储节点结构
         */
        type ncTStorageNodeInfo = {
            /**
             * 节点uuid
             */
            node_uuid: string;

            /**
             * 节点别名
             */
            node_alias: string;

            /**
             * 节点ip
             */
            node_ip: string;

            /**
             * 应用服务状态
             */
            service_status: boolean;

            /**
             * 节点lvs状态
             */
            lvs_status: boolean;

            /**
             * 节点在线状态
             */
            is_online: boolean;
        }

        /**
         * 高可用节点结构
         */
        type ncTHaNodeInfo = {
            /**
             * 节点uuid
             */
            node_uuid: string;

            /**
             * 节点别名
             */
            node_alias: string;

            /**
             * 节点ip
             */
            node_ip: string;

            /**
             * 节点在线状态
             */
            is_online: boolean;

            /**
             * 节点是否是ha主节点
             */
            is_master: boolean;

            /**
             * vip所属子系统
             */
            sys: number;
        }

        /**
         * 节点信息结构
         */
        type ncTNodeInfo = {
            /**
             * 节点uuid
             */
            node_uuid: string;

            /**
             * 数据库节点标识
             * 0:非数据库节点
             * 1:数据库master节点
             * 2:数据库slave节点
             */
            role_db: number;

            /**
             * 集群管理节点标识
             */
            role_ecms: number;

            /**
             * 应用节点标识   
             * 1:应用节点
             * 2:单点服务
             */
            role_app: number;

            /**
             * 存储节点标识
             */
            role_storage: number;

            /**
             * 节点别名
             */
            node_alias: string;

            /**
             * 节点加入集群使用的IP
             */
            node_ip: string;

            /**
             * 节点在线状态(true:在线 | false离线)
             */
            is_online: true;

            /**
             * 节点是否是ha节点
             */
            is_ha: number;

            /**
             * 节点是否有etcd实例
             * 0: 没有实例
             * 1: 只有有一个实例
             * 2: 有两个实例(ecms节点的备实例存在)
             */
            is_etcd: number;

            /**
             * 节点一致性状态(true: 与集群状态一致 | false: 不一致)
             */
            consistency_status: boolean;
        }

        /**
         * vip信息
         */
        type ncTVipInfo = {
            /**
             * ip地址
             */
            vip: string;
            /**
             * 掩码
             */
            mask: string;
            /**
             * 使用网卡
             */
            nic: string;
            /**
             * vip所属子系统(与高可用节点结构的sys对应)
             */
            sys: number;
        }

        /**
         * 存储池设备信息
         */
        type ncTStoragePoolDevice = {
            // swift 虚拟设备信息
            swift_device: ECMSAgent.ncTSwiftDevice;
            // 数据卷信息
            // 当 data_volume 为 None 或 data_volume.mount_path 为空 时，则该设备在存储池中意味着已离线
            data_volume?: ECMSAgent.ncTDataVolume;
        }

        /**
         * 存储池信息
         */

        type ncTStoragePool = {

            /**
             * swift ring 信息
             */
            ring: ECMSAgent.ncTSwiftRing,

            /**
             * 存储池的逻辑已用空间
             */
            logical_used_size_gb: number;

            /**
             * 存储池的物理已用空间
             */
            physical_used_size_gb: number;
        }
        /**
         * 指定节点内容使用情况
         */
        type MemoryInfo = {
            /**
             * 已用内存KB
             */
            usage: number;

            /**
             * 总共内存KB
             */
            total: number;
        }

        /**
         * 卷类设备（系统卷、缓存卷、数据卷）公共信息
         */
        type VolumeBaseInfo = {
            /**
             * 该系统卷在系统中的设备路径，如 /dev/sdb1 等
             */
            vol_dev_path: string;

            /**
             * 该系统卷所属磁盘在系统中的设备路径，如 /dev/sdb
             */
            disk_dev_path: string;

            /**
             * 系统卷容量大小，单位 GB
             */
            capacity_gb: number;

            /**
             * 已使用空间，单位 GB，若当前未挂载，则未知
             */
            used_size_gb: number;

            /**
             * 文件系统类型，如 xfs
             */
            fs_type: string;

            /**
             * 该系统卷在系统中的挂载点路径，若当前未挂载，则为 ""
             */
            mount_path: string;
        }

        /**
         * 系统卷/缓存卷信息
         */
        type ncTVolume = {
            /**
             * 设备型号：LSI, ATA-xxxx, ISCSI等等
             */
            disk_model: string;
        } & VolumeBaseInfo

        /**
         * 指定节点上所有数据盘
         */
        type DataDisk = {
            /**
             * 该数据盘在系统中的设备路径，如 /dev/sdb 等
             */
            disk_dev_path: ncTDataDisk
        }

        /**
         * 数据盘设备信息
         */
        type ncTDataDisk = {
            /**
             * 该数据盘在系统中的设备路径，如 /dev/sdb 等
             */
            disk_dev_path: string;

            /**
             * 磁盘容量，单位 GB
             */
            capacity_gb: number;

            /**
             * 设备型号：LSI, ATA-xxxx, ISCSI等等
             */
            disk_model: string;

            /**
             * 该磁盘上创建的逻辑分区设备列表(数据卷)
             */
            volumes: { [disk_dev_path: string]: ncTDataVolume };
        }

        /**
         * 数据卷设备信息
         */
        type ncTDataVolume = {
            /**
             * 该数据卷的挂载点标识，若未创建过挂载点标识，则为 ""
             */
            mount_uuid: string;
        } & VolumeBaseInfo


        /**
         * RAID 物理磁盘设备信息
         */
        type ncTRaidPDInfo = {
            /**
             * 该设备唯一标识
             */
            pd_devid: string;

            /**
             * 该物理磁盘的容量，单位 GB
             */
            capacity_gb: number;

            /**
             * 该物理磁盘所属的逻辑设备ID，若未属于任何逻辑设备，则为 ""
             */
            ld_devid: string;

            /**
             * 该物理磁盘的 Firmware state, 如 "Online, Spun Up", "Unconfigured(good), Spun Up", "Rebuild", "Hotspare, Spun Up" 等等
             */
            firmware_state: string;

            /**
             * 该物理磁盘的 Foreign State, 如 "Foreign", "None"
             */
            foreign_state: string;

            /**
             * 该物理磁盘的 Device Id
             */
            device_id: string;

            /**
             * 该物理磁盘是否热备盘
             */
            is_hotspare: boolean;
        }

        /**
         * RAID逻辑磁盘列表
         */
        type ncTRaidLDInfo = {
            /**
             * 该设备唯一标识
             */
            ld_devid: string;
            /**
             * 该 RAID 在系统中对应的设备路径，如 /dev/md0, /dev/sdb 等
             */
            disk_dev_path: string;

            /**
             * 该 RAID 的容量，单位 GB
             */
            capacity_gb: number;

            /**
             * RAID 级别，如 "0", "1", "5", "6", "00", "10", "50", "60" 等等
             */
            raid_level: string;

            /**
             * 组成该逻辑设备的物理磁盘的pd_devid列表
             */
            pd_devid_list: ReadonlyArray<string>;

            /**
             * 该 RAID 的 State，如 Optimal, Degraded
             */
            state: string;

            /**
             * 该 RAID 的 DiskGroup 编号
             */
            disk_group: string;
        }

        /**
         * 系统警告返回
         */
        type AlertTriggerStatus = {

            /**
             * 缓存卷状态
             */
            Cache_volume_status: boolean;

            /**
             * 数据库同步状态
             */
            Database_sync_status: boolean;

            /**
             * RAID设备状态
             */
            RAID_device_status: boolean;

            /**
             * SSD硬盘状态
             */
            SSD_device_status: boolean;

            /**
             * 服务器状态
             */
            Server_status: boolean;

            /**
             * 存储池剩余状态
             */
            Storage_pool_available_space: boolean;

            /**
             * 存储池设备状态
             */
            Storage_pool_device_status: boolean;

            /**
             * 系统服务状态
             */
            System_service_status: boolean;

            /**
             * 系统卷状态
             */
            System_volume_status: boolean;
        }
        /********************************** 函数声明*****************************/

        /**
         * 获取应用节点信息
         */
        type GetAppNodeInfo = Core.APIs.ThriftAPI<
            void,
            ReadonlyArray<ncTAppNodeInfo>
            >

        /**
         * 应用服务状态
         * @return true 应用子系统可用
         *         false 没有应用子系统，或应用子系统不可用
         */
        type AppSysStatus = Core.APIs.ThriftAPI<
            void,
            boolean
            >

        /**
         * 验证登录信息
         * @return uuid 验证通过
         */
        type VerifySignIn = Core.APIs.ThriftAPI<
            [string, string],
            any
            >

        /**
         * 获取所有节点信息
         */
        type GetAllNodeInfo = Core.APIs.ThriftAPI<
            void,
            ReadonlyArray<ncTNodeInfo>
            >

        /**
         * 获取指定节点信息
         * @param string node_uuid 节点uuid
         * @return <ncTNodeInfo> 节点信息
         */
        type GetNodeInfo = Core.APIs.ThriftAPI<
            [string],
            ncTNodeInfo
            >

        /**
         * 获取产品版本信息
         */
        type GetClusterVersion = Core.APIs.ThriftAPI<
            void,
            string
            >

        /**
         * 获取所有的ha节点信息
         * @return list<ncTHaNodeInfo> 高可用节点信息列表
         */
        type GetHaNodeInfo = Core.APIs.ThriftAPI<
            void,
            ReadonlyArray<ncTHaNodeInfo>
            >

        /**
         * 获取存储节点
         */
        type GetStorageNodeInfo = Core.APIs.ThriftAPI<
            void,
            ReadonlyArray<ncTStorageNodeInfo>
            >

        /**
         * 获取数据库节点
         */
        type GetDbNodeInfo = Core.APIs.ThriftAPI<
            void,
            ReadonlyArray<ncTDBNodeInfo>
            >

        /**
         * 获取设置某应用服务的节点uuid
         * 默认获取索引服务
         */
        type GetNodeUuidByAppName = Core.APIs.ThriftAPI<
            string,
            string
            >

        /**
         * 对当前节点环境进行一致性检测及处理
         * @param node_ip 节点IP
         */
        type ConsistencyRepair = Core.APIs.ThriftAPI<
            string,
            void
            >

        /**
         * 添加节点
         * @param   <string>    host    节点 IP 地址
         * @param   <i32>       port    SSH 端口
         * @param   <string>    user    SSH 用户
         * @param   <string>    passwd  SSH 密码
         * @return  <string>            节点 UUID
         */
        type AddNode = Core.APIs.ThriftAPI<
            [string, number, string, string],
            string
            >

        /**
         * 获取高可用vip信息列表
         * @return <ncTVipInfo> vip信息结构
         */
        type GetVipInfo = Core.APIs.ThriftAPI<
            void,
            ReadonlyArray<ncTVipInfo>
            >

        /**
         * 设置高可用主节点
         * @param <string>      node_uuid 节点ID
         * @param <ncTVipInfo>  vip_info  vip信息结构
         */
        type SetHaMaster = Core.APIs.ThriftAPI<
            [string, ncTVipInfo],
            void
            >

        /**
         * 设置高可用从节点
         * @param <string>      node_uuid 节点ID
         * @param <int>    ha_sys 所属高可用系统标记
         */
        type SetHaSlave = Core.APIs.ThriftAPI<
            [string, number],
            void
            >

        /**
         * 设置数据库主库
         * @param <string>      node_uuid 节点ID
         */
        type SetDbMaster = Core.APIs.ThriftAPI<
            [string],
            void
            >


        /**
         * 设置数据库高可用备份从节点
         * @param <string>      node_uuid 节点ID
         */
        type SetDbSlave = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 设置应用节点
         * @param node_uuid 节点uuid
         */
        type AddApplicationNode = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 添加存储节点
         * @param string node_uuid 节点uuid
         */
        type AddStorageNode = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 设置单点应用节点（添加索引节点）
         * @param string node_uuid 节点uuid
         * @param string app_name
         */
        type AddSingleApplicationNode = Core.APIs.ThriftAPI<
            [string, string],
            void
            >

        /**
         * 取消高可用节点
         * @param <string>      node_uuid 节点ID
         */
        type CancelHaNode = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 修改高可用vip信息
         * @param <ncTVipInfo> 待设置的vip信息结构
         * 例: ncTVipInfo(vip='192.168.136.1', nic='ens32', mask='255.255.255.0', sys=ncTHaSys.BASIC)
         */
        type SetVipInfo = Core.APIs.ThriftAPI<
            [ncTVipInfo],
            void
            >

        /**
         * 启用指定节点的存储lvs
         * @param string node_uuid 节点uuid
         */
        type EnableStorageLvs = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 禁用指定节点的存储lvs
         * @param  string  node_uuid   节点uuid
         */
        type DisableStorageLvs = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 启用指定节点的应用lvs
         * @param  string  node_uuid  节点uuid
         */
        type EnableAppLvs = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 禁用指定节点的应用lvs
         * @param  string  node_uuid   节点uuid
         */
        type DisableAppLvs = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 设置节点别名
         * @param string node_uuid 节点uuid
         * @param string node_alias 节点别名
         */
        type SetNodeAlias = Core.APIs.ThriftAPI<
            [string, string],
            void
            >

        /**
         * 取消指定节点为应用节点
         * @param node_uuid 节点uuid
         */
        type DelApplicationNode = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 取消单点应用节点
         * @param string app_name
         */
        type DelSingleApplicationNode = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 取消数据库节点
         * @param <string>      node_uuid 节点ID
         */
        type CancelDbNode = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 移除节点
         * @param   <string>    node_uuid   节点 UUID
         */
        type DelNode = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 重启指定节点
         * @param string node_uuid 节点uuid
         */
        type RebootNode = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 指定节点异步重启eisooapp服务
         * @param string node_uuid 节点uuid
        */
        type RestartEisooapp = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
         * 判断应用数据库是否为第三方数据库
         */
        type IsExternalDbOfApp = Core.APIs.ThriftAPI<
            void,
            boolean
            >

        /**
         * 获取服务状态: systemctl status service_name
         */
        type GetServiceStatus = Core.APIs.ThriftAPI<
            [string, string],
            Core.ECMSAgent.ncTServiceStatus
            >

        // 存储子系统相关
        /**
         * 初始化存储池
         *
         * @param int replicas 副本数
         */
        type InitStoragePool = Core.APIs.ThriftAPI<
            [number],
            void
            >

        /**
         * 获取存储池信息
         *
         * @param bool need_used_size       是否包含已用空间
         *      若为True，则需要从各个节点查询所有磁盘的可用空间情况，当节点数较多时，花费时间将较长
         */
        type GetStoragePool = Core.APIs.ThriftAPI<
            [boolean],
            ncTStoragePool
            >
        /**
         * 判断存储池是否已初始化
         */
        type IsStoragePoolInited = Core.APIs.ThriftAPI<
            void,
            boolean
            >

        /**
         * 查询当前存储池的副本健康度.
         * 内部采用抽样的方法检测.
         * @return health_percent   返回健康百分比之分子，等于 100 可视为健康，
         *                          说明所有对象的副本都100%存在正确的位置上。
         */
        type GetReplicasHealth = Core.APIs.ThriftAPI<
            void,
            number
            >

        /**
         * 获取存储池中指定节点上的设备列表(包含设备对应的数据卷信息)
         *
         * @param string node_ip          节点的ip, 若为""，则获取全部节点
         * @return map<ECMSAgent.ncTSwiftDevice.dev_id, ncTStoragePoolDevice>
         */
        type GetStoragePoolDevices = Core.APIs.ThriftAPI<
            [string],
            {
                [dev_id: string]: ncTStoragePoolDevice
            }
            >

        /**
         * 获取指定节点上的空闲数据盘
         * 空闲数据盘：指尚未加入存储池的数据盘
         *
         * @param string node_ip                    节点的 node_ip
         * @return map<disk_dev_path, data_disk>    空闲数据盘列表
         */
        type GetStorageFreeDataDisks = Core.APIs.ThriftAPI<
            [string],
            {
                [disk_dev_path: string]: ncTDataDisk
            }
            >

        /**
         * 将指定节点上的指定空闲数据盘一次性加入到存储池中
         *
         * @param disks(map<node_ip, list<disk_dev_path>>)  空闲数据盘列表，由 get_free_data_disks 可知
         */
        type AddDevicesToPool = Core.APIs.ThriftAPI<
            {
                [node_ip: string]: Array<string>
            },
            void
            >
        /**
         * 将指定某一节点的所有空闲数据盘一次性加入到存储池中
         *
         * @param string node_ip      节点 ip
         */
        type AddNodeDevicesToPool = Core.APIs.ThriftAPI<
            string,
            void
            >

        /**
         * 获取可用于替换指定存储池设备的备选空闲数据盘列表
         * 规则：
         *   1.备选设备和要替换的设备处于同一服务器节点
         *
         * @param dev_id(number)     存储池中需要被替换的设备ID， ncTStoragePoolDevice.swift_device.dev_id
         * @return map<disk_dev_path, data_disk>   备选空闲数据盘列表
         */
        type GetFreeDataDisksForReplace = Core.APIs.ThriftAPI<
            [number],
            {
                [disk_dev_path: string]: ncTDataDisk
            }
            >

        /**
         * 在存储池中使用指定数据盘替换指定存储池设备（仅限同一节点内的磁盘替换）
         * 单副本环境不支持此操作
         * 若替换磁盘的容量与原磁盘不一致，则此操作会引起存储池内的数据重新负载均衡及迁移
         * 此操作适用于某块故障卷可以被尽快更换的场景，或需要替换使用大容量磁盘达到扩容目的的场景
         *
         * @param dev_id(number)           存储池中需要被替换的设备ID， ncTStoragePoolDevice.swift_device.dev_id
         * @param disk_dev_path(str)    用于替换的数据盘路径
         */
        type ReplaceDeviceInPool = Core.APIs.ThriftAPI<
            [number, string],
            string
            >

        /**
         * 将存储池重新负载均衡
         */
        type RebalanceStoragePool = Core.APIs.ThriftAPI<
            void,
            void
            >
        /**
         * 获取系统时间
         */
        type GetClusterTime = Core.APIs.ThriftAPI<
            void,
            string
            >
        /**
         * 关闭系统
         */
        type ShutdownCluster = Core.APIs.ThriftAPI<
            void,
            void
            >

        /**
         * 修改存储池副本数
         *
         * @param int replicas 副本数
         */
        type ChangeReplicas = Core.APIs.ThriftAPI<
            [number],
            void
            >

        /**
         * 从存储池中移除单个设备
         * 此操作会引起存储池内的数据重新负载均衡及迁移
         * 此操作适用于某块存储卷已故障不可用，且长时间无法得到恢复或更换的场景
         * 单副本环境不支持此操作
         *
         * @param dev_id(int)   存储池中的设备ID， ncTStoragePoolDevice.swift_device.dev_id
         */
        type RemoveDeviceFromPool = Core.APIs.ThriftAPI<
            [number],
            void
            >

        /**
         * 从存储池中移除指定节点的所有设备
         * 单副本环境不支持此操作
         *
         * @param string node_ip      节点 ip
         */
        type RemoveNodeDevicesFromPool = Core.APIs.ThriftAPI<
            [string],
            void
            >
        /**
         * 移除存储节点
         * @param string node_uuid 节点uuid
         */
        type DelStorageNode = Core.APIs.ThriftAPI<
            [string],
            void
            >

        /**
        * 指定节点cpu使用率
        * @return  <number>  cpu使用率
        */
        type GetCpuUsage = Core.APIs.ThriftAPI<
            [string],
            number
            >

        /**
        * 指定节点内存使用情况
        * @return  MemoryInfo  指定节点内存使用情况
        */
        type GetMemoryInfo = Core.APIs.ThriftAPI<
            [string],
            MemoryInfo
            >

        /**
        * 网络发送速度
        * @return  <number> 网络发送速度B/s
        */
        type GetNetworkOutgoingRate = Core.APIs.ThriftAPI<
            [string],
            number
            >

        /**
        * 网络接收速度
        * @return  <number>  网络接收速度B/s
        */
        type GetNetworkIncomingRate = Core.APIs.ThriftAPI<
            [string],
            number
            >

        /**
        * 系统卷相关信息
        * @return  ncTVolume   系统卷信息
        */
        type GetSysVolume = Core.APIs.ThriftAPI<
            [string],
            ncTVolume
            >

        /**
        * 缓存卷信息
        * @return  ncTVolume   缓存卷信息
        */
        type GetCacheVolume = Core.APIs.ThriftAPI<
            [string],
            ncTVolume
            >

        /**
        * 指定节点上所有数据盘
        * @return {[disk_dev_path: string]: ncTDataDisk} 指定节点上所有数据盘
        */
        type GetDataDisks = Core.APIs.ThriftAPI<
            [string],
            {
                [disk_dev_path: string]: ncTDataDisk
            }
            >

        /**
        * 指定节点上的空闲数据盘
        * @return  {[disk_dev_path: string]: ncTDataDisk} 指定节点上的空闲数据盘
        */
        type GetFreeDataDisks = Core.APIs.ThriftAPI<
            [string],
            {
                [disk_dev_path: string]: ncTDataDisk
            }
            >

        /**
        * 指定节点上的所有数据RAID物理磁盘列表
        * @return  {[pd_devid: string]: ncTRaidPDInfo}  RAID 物理磁盘设备信息
        */
        type GetAllDataRaidPds = Core.APIs.ThriftAPI<
            [string],
            {
                [pd_devid: string]: ncTRaidPDInfo
            }
            >

        /**
        * 获取指定节点上的所有RAID逻辑磁盘列表
        * @return  {[ld_devid: string]: ncTRaidLDInfo}  RAID 逻辑设备信息
        */
        type GetAllRaidLds = Core.APIs.ThriftAPI<
            [string],
            {
                [ld_devid: string]: ncTRaidLDInfo
            }
            >

        /**
        * 初始化指定节点上的指定空闲数据RAID物理磁盘
        * @return  {[ld_devid: string]: ncTRaidLDInfo}  初始化创建的RAID逻辑卷列表
        */
        type InitFreeDataRaidPds = Core.APIs.ThriftAPI<
            [string, ReadonlyArray<string>, number],
            {
                [ld_devid: string]: ncTRaidLDInfo
            }
            >

        /**
        * 指定节点上的可添加热备盘的RAID逻辑磁盘列表
        * @return  {[ld_devid: string]: ncTRaidLDInfo}  RAID逻辑磁盘列表
        */
        type GetRaidLdsForHotspare = Core.APIs.ThriftAPI<
            [string],
            {
                [ld_devid: string]: ncTRaidLDInfo
            }
            >

        /**
         * 在指定节点上添加RAID热备盘
         */
        type AddRaidHotspare = Core.APIs.ThriftAPI<
            [string, string, string],
            void
            >

        /**
        * 指定节点的指定 RAID 物理磁盘设备的详细信息
        * @return  object RAID 物理磁盘设备的详细信息
        */
        type GetRaidPdDetails = Core.APIs.ThriftAPI<
            [string, string],
            object
            >

        /**
        * 指定节点的指定 RAID 逻辑磁盘设备的详细信息
        * @return object RAID 逻辑设备的详细信息
        */
        type GetRaidLdDetails = Core.APIs.ThriftAPI<
            [string, string],
            object
            >

        /**
        * 在指定节点上删除热备盘
        */
        type RemoveRaidHotspare = Core.APIs.ThriftAPI<
            [string, string],
            void
            >

        /**
        * 是否支持raid管理
        * @return boolean true:支持，false不支持
        */
        type IsAvailableOfRaidManager = Core.APIs.ThriftAPI<
            [string],
            boolean
            >

        /**
         * 获取警告项状态
         */
        type GetAlertTriggerStatus = Core.APIs.ThriftAPI<
            void,
            AlertTriggerStatus
            >

        /**
         * 获取警告通知状态
         */
        type IsAlertEnable = Core.APIs.ThriftAPI<
            void,
            boolean
            >

        /**
         *启用告警通知
         */
        type EnableAlert = Core.APIs.ThriftAPI<
            void,
            void
            >

        /**
         *禁用告警通知
         */
        type DisableAlert = Core.APIs.ThriftAPI<
            void,
            void
            >
    }

}