import { ECMSManager } from '../thrift';

/**
 * 获取应用节点信息
 */
export const getAppNodeInfo: Core.ECMSManager.GetAppNodeInfo = function () {
    return ECMSManager('get_app_node_info', []);
}

/**
 * 应用服务状态
 * @return true 应用子系统可用
 *         false 没有应用子系统，或应用子系统不可用
 */
export const appSysStatus: Core.ECMSManager.AppSysStatus = function () {
    return ECMSManager('app_sys_status', []);
}

/**
 * 验证登录信息
 * @return uuid 验证通过
 */
export const verifySignIn: Core.ECMSManager.VerifySignIn = function ([user, password]) {
    return ECMSManager('verify_sign_in', [user, password])
}

/**
 * 获取所有节点信息
 */
export const getAllNodeInfo: Core.ECMSManager.GetAllNodeInfo = function () {
    return ECMSManager('get_all_node_info', []);
}

/**
 * 获取指定节点信息
 * @param node_uuid 节点uuid
 * @return 节点信息
 */
export const getNodeInfo: Core.ECMSManager.GetNodeInfo = function ([node_uuid]) {
    return ECMSManager('get_node_info', [node_uuid]);
}

/**
 * 获取产品版本信息
 */
export const getClusterVersion: Core.ECMSManager.GetClusterVersion = function () {
    return ECMSManager('get_cluster_version', []);
}

/**
 * 获取所有的ha节点信息
 * @return list<ncTHaNodeInfo> 高可用节点信息列表
 */
export const getHaNodeInfo: Core.ECMSManager.GetHaNodeInfo = function () {
    return ECMSManager('get_ha_node_info', []);
}

/**
 * 获取存储节点
 */
export const getStorageNodeInfo: Core.ECMSManager.GetStorageNodeInfo = function () {
    return ECMSManager('get_storage_node_info', []);
}

/**
 * 获取数据库节点
 */
export const getDbNodeInfo: Core.ECMSManager.GetDbNodeInfo = function () {
    return ECMSManager('get_db_node_info', []);
}

/**
 * 获取设置某应用服务的节点uuid
 * @param appName 服务名称
 */
export const getNodeUuidByAppName: Core.ECMSManager.GetNodeUuidByAppName = function ([appName]) {
    return ECMSManager('get_node_uuid_by_app_name', [appName])
}

/**
 * 对当前节点环境进行一致性检测及处理
 * @param node_ip 节点IP
 */
export const consistencyRepair: Core.ECMSManager.ConsistencyRepair = function ([node_ip]) {
    return ECMSManager('consistency_repair', [node_ip]);
}

/**
 * 添加节点
 * @param   host    节点 IP 地址
 * @param   port    SSH 端口
 * @param   user    SSH 用户
 * @param   passwd  SSH 密码
 * @return  uuid    节点 UUID
 */
export const addNode: Core.ECMSManager.AddNode = function ([host, port, user, passwd]) {
    return ECMSManager('add_node', [host, port, user, passwd]);
}

/**
 * 移除节点
 * @param   <string>    node_uuid   节点 UUID
 */
export const delNode: Core.ECMSManager.DelNode = function ([node_uuid]) {
    return ECMSManager('del_node', [node_uuid]);
}

/**
 * 获取vip信息
 */
export const getVipInfo: Core.ECMSManager.GetVipInfo = function () {
    return ECMSManager('get_vip_info', []);
}

/**
* 取消高可用节点
* @param <string>      node_uuid 节点ID
*/
export const cancelHaNode: Core.ECMSManager.CancelHaNode = function ([node_uuid]) {
    return ECMSManager('cancel_ha_node', [node_uuid])
}

/**
 * 设置高可用主节点
 * @param <string>      node_uuid 节点ID
 * @param <ncTVipInfo>  vip_info  vip信息结构
 */
export const setHaMaster: Core.ECMSManager.SetHaMaster = function ([node_uuid, vip_info]) {
    return ECMSManager('set_ha_master', [node_uuid, vip_info]);
}

/**
* 设置高可用从节点
* @param <string>      node_uuid 节点ID
* @param <int>    ha_sys 所属高可用系统标记    
*/
export const setHaSlave: Core.ECMSManager.SetHaSlave = function ([node_uuid, ha_sys]) {
    return ECMSManager('set_ha_slave', [node_uuid, ha_sys]);
}

/**
 * 设置数据库主库
 * @param <string>      node_uuid 节点ID
 */
export const setDbMaster: Core.ECMSManager.SetDbMaster = function ([node_uuid]) {
    return ECMSManager('set_db_master', [node_uuid])
}

/**
 * 设置数据库高可用备份从节点
 * @param <string>      node_uuid 节点ID
 */
export const setDbSlave: Core.ECMSManager.SetDbSlave = function ([node_uuid]) {
    return ECMSManager('set_db_slave', [node_uuid])
}

/**
 * 修改高可用vip信息
 * @param <ncTVipInfo> 待设置的vip信息结构
 * 例: ncTVipInfo(vip='192.168.136.1', nic='ens32', mask='255.255.255.0', sys=ncTHaSys.BASIC)
 */
export const setVipInfo: Core.ECMSManager.SetVipInfo = function ([vip_info]) {
    return ECMSManager('set_vip_info', [vip_info]);
}

/**
 * 设置应用节点
 * @param node_uuid 节点uuid
 */
export const addApplicationNode: Core.ECMSManager.AddApplicationNode = function ([node_uuid]) {
    return ECMSManager('add_application_node', [node_uuid])
}

/**
 * 添加存储节点
 * @param string node_uuid 节点uuid
 */
export const addStorageNode: Core.ECMSManager.AddStorageNode = function ([node_uuid]) {
    return ECMSManager('add_storage_node', [node_uuid])
}

/**
 * 设置单点应用节点（添加索引节点）
 * @param string node_uuid 节点uuid
 * @param string app_name
 */
export const addSingleApplicationNode: Core.ECMSManager.AddSingleApplicationNode = function ([node_uuid, app_name = 'eftsearch']) {
    return ECMSManager('add_single_application_node', [node_uuid, app_name])
}

/**
 * 启用指定节点的存储lvs
 * @param string node_uuid 节点uuid
 */
export const enableStorageLvs: Core.ECMSManager.EnableStorageLvs = function([node_uuid]) {
    return ECMSManager('enable_storage_lvs', [node_uuid])
}

/**
 * 禁用指定节点的存储lvs
 * @param  string  node_uuid   节点uuid
 */
export const disableStorageLvs: Core.ECMSManager.DisableStorageLvs = function([node_uuid]) {
    return ECMSManager('disable_storage_lvs', [node_uuid])
}

/**
 * 启用指定节点的应用lvs
 * @param  string  node_uuid  节点uuid
 */
export const enableAppLvs: Core.ECMSManager.EnableAppLvs = function([node_uuid]) {
    return ECMSManager('enable_app_lvs', [node_uuid])
}

/**
 * 禁用指定节点的应用lvs
 * @param  string  node_uuid   节点uuid
 */
export const disableAppLvs: Core.ECMSManager.DisableAppLvs = function([node_uuid]) {
    return ECMSManager('disable_app_lvs', [node_uuid])
}

/**
 * 设置节点别名
 * @param string node_uuid 节点uuid
 * @param string node_alias 节点别名
 */
export const setNodeAlias: Core.ECMSManager.SetNodeAlias = function([node_uuid, node_alias]) {
    return ECMSManager('set_node_alias', [node_uuid, node_alias]);
}

/**
 * 取消指定节点为应用节点
 * @param node_uuid 节点uuid
 */
export const delApplicationNode: Core.ECMSManager.DelApplicationNode = function([node_uuid]) {
    return ECMSManager('del_application_node', [node_uuid]);
}

/**
 * 取消单点应用节点
 * @param string app_name
 */
export const delSingleApplicationNode: Core.ECMSManager.DelSingleApplicationNode = function([app_name]) {
    return ECMSManager('del_single_application_node', [app_name]);
}

/**
 * 取消数据库节点
 * @param <string>      node_uuid 节点ID
 */
export const cancelDbNode: Core.ECMSManager.CancelDbNode = function([node_uuid]) {
    return ECMSManager('cancel_db_node', [node_uuid]);
}

/**
 * 取消存储节点
 * @param <string>      node_uuid 节点ID
 */
export const delStorageNode: Core.ECMSManager.DelStorageNode = function([node_uuid]) {
    return ECMSManager('del_storage_node', [node_uuid]);
}

/**
 * 重启指定节点
 * @param string node_uuid 节点uuid
*/
export const rebootNode:  Core.ECMSManager.RebootNode = function([node_uuid]) {
    return ECMSManager('reboot_node', [node_uuid]);
}

/**
 * 指定节点异步重启eisooapp服务
 * @param string node_uuid 节点uuid
*/
export const restartEisooapp:  Core.ECMSManager.RestartEisooapp = function([node_uuid]) {
    return ECMSManager('restart_eisooapp', [node_uuid]);
}

/**
 * 判断应用数据库是否为第三方数据库
 */
export const isExternalDbOfApp: Core.ECMSManager.IsExternalDbOfApp = function() {
    return ECMSManager('is_external_db_of_app');
}

/**
 * 获取指定节点服务状态
 * param node_uuid 节点uuid
 *     service_name 服务名
 */
export const getServiceStatus: Core.ECMSManager.GetServiceStatus = function ([node_uuid, service_name]) {
    return ECMSManager('get_service_status', [node_uuid, service_name])
}

// 存储子系统相关
/**
 * 初始化存储池
 *
 * @param int replicas 副本数
 */
export const initStoragePool: Core.ECMSManager.InitStoragePool = function ([replicas]) {
    return ECMSManager('init_storage_pool', [replicas])
}

/**
 * 获取存储池信息
 *
 * @param bool need_used_size       是否包含已用空间
 *      若为True，则需要从各个节点查询所有磁盘的可用空间情况，当节点数较多时，花费时间将较长
 */
export const getStoragePool: Core.ECMSManager.GetStoragePool = function ([include_used_size]) {
    return ECMSManager('get_storage_pool', [include_used_size])
}

/**
 * 判断存储池是否已初始化
 */
export const isStoragePoolInited: Core.ECMSManager.IsStoragePoolInited = function () {
    return ECMSManager('is_storage_pool_inited')
}

/**
 * 查询当前存储池的副本健康度.
 * 内部采用抽样的方法检测.
 * @return health_percent   返回健康百分比之分子，等于 100 可视为健康，
 *                          说明所有对象的副本都100%存在正确的位置上。
 */
export const getReplicasHealth: Core.ECMSManager.GetReplicasHealth = function () {
    return ECMSManager('get_replicas_health')
}

/**
  * 获取存储池中指定节点上的设备列表(包含设备对应的数据卷信息)
  *
  * @param string node_ip          节点的ip, 若为""，则获取全部节点
  * @return map<ECMSAgent.ncTSwiftDevice.dev_id, ncTStoragePoolDevice>
  */
export const getStoragePoolDevices: Core.ECMSManager.GetStoragePoolDevices = function ([node_ip]) {
    return ECMSManager('get_storage_pool_devices', [node_ip])
}

/**
 * 获取指定节点上的空闲数据盘
 * 空闲数据盘：指尚未加入存储池的数据盘
 *
 * @param string node_ip                    节点的 node_ip
 * @return map<disk_dev_path, data_disk>    空闲数据盘列表
 */
export const getFreeDataDisks: Core.ECMSManager.GetStorageFreeDataDisks = function ([node_ip]) {
    return ECMSManager('get_free_data_disks', [node_ip])
}


/**
 * 将指定节点上的指定空闲数据盘一次性加入到存储池中
 *
 * @param disks(map<node_ip, list<disk_dev_path>>)  空闲数据盘列表，由 get_free_data_disks 可知
 */
export const addDevicesToPool: Core.ECMSManager.AddDevicesToPool = function ([node]) {
    return ECMSManager('add_devices_to_pool', [node])
}

/**
 * 将指定某一节点的所有空闲数据盘一次性加入到存储池中
 *
 * @param string node_ip      节点 ip
 */
export const addNodeDevicesToPool: Core.ECMSManager.AddNodeDevicesToPool = function ([node_ip]) {
    return ECMSManager('add_node_devices_to_pool', [node_ip])
}

/**
 * 获取可用于替换指定存储池设备的备选空闲数据盘列表
 * 规则：
 *   1.备选设备和要替换的设备处于同一服务器节点
 *
 * @param dev_id(number)     存储池中需要被替换的设备ID， ncTStoragePoolDevice.swift_device.dev_id
 * @return map<disk_dev_path, data_disk>   备选空闲数据盘列表
 */
export const getFreeDataDisksForReplace: Core.ECMSManager.GetFreeDataDisksForReplace = function ([dev_id]) {
    return ECMSManager('get_free_data_disks_for_replace', [dev_id])
}

/**
 * 在存储池中使用指定数据盘替换指定存储池设备（仅限同一节点内的磁盘替换）
 * 单副本环境不支持此操作
 * 若替换磁盘的容量与原磁盘不一致，则此操作会引起存储池内的数据重新负载均衡及迁移
 * 此操作适用于某块故障卷可以被尽快更换的场景，或需要替换使用大容量磁盘达到扩容目的的场景
 *
 * @param dev_id(number)           存储池中需要被替换的设备ID， ncTStoragePoolDevice.swift_device.dev_id
 * @param disk_dev_path(str)    用于替换的数据盘路径
 */
export const replaceDeviceInPool: Core.ECMSManager.ReplaceDeviceInPool = function ([dev_id, disk_dev_path]) {
    return ECMSManager('replace_device_in_pool', [dev_id, disk_dev_path])
}

/**
 * 将存储池重新负载均衡
 */
export const rebalanceStoragePool: Core.ECMSManager.RebalanceStoragePool = function () {
    return ECMSManager('rebalance_storage_pool', [])
}


/**
 * 修改存储池副本数
 *
 * @param int replicas 副本数
 */
export const changeReplicas: Core.ECMSManager.ChangeReplicas = function ([replicas]) {
    return ECMSManager('change_replicas', [replicas])
}


/**
 * 从存储池中移除单个设备
 * 此操作会引起存储池内的数据重新负载均衡及迁移
 * 此操作适用于某块存储卷已故障不可用，且长时间无法得到恢复或更换的场景
 * 单副本环境不支持此操作
 *
 * @param dev_id(int)   存储池中的设备ID， ncTStoragePoolDevice.swift_device.dev_id
 */
export const removeDeviceFromPool: Core.ECMSManager.RemoveDeviceFromPool = function ([dev_id]) {
    return ECMSManager('remove_device_from_pool', [dev_id])
}

/**
 * 从存储池中移除指定节点的所有设备
 * 单副本环境不支持此操作
 *
 * @param string node_ip      节点 ip
 */
export const removeNodeDevicesFromPool: Core.ECMSManager.RemoveNodeDevicesFromPool = function ([node_ip]) {
    return ECMSManager('remove_node_devices_from_pool', [node_ip])
}


// 节点设备管理相关
/**
 * 获取指定节点cpu使用率
 * @param   node_uuid    节点uuid
 */
export const getCpuUsage: Core.ECMSManager.GetCpuUsage = function ([node_uuid]) {
    return ECMSManager('get_cpu_usage', [node_uuid])
}

/**
 * 获取指定节点内存使用情况
 * @param   node_uuid    节点uuid
 */
export const getMemoryInfo: Core.ECMSManager.GetMemoryInfo = function ([node_uuid]) {
    return ECMSManager('get_memory_info', [node_uuid])
}

/**
 * 获取网络发送速率
 * @param   node_uuid    节点uuid
 */
export const getNetworkOutgoingRate: Core.ECMSManager.GetNetworkOutgoingRate = function ([node_uuid]) {
    return ECMSManager('get_network_outgoing_rate', [node_uuid])
}

/**
 * 获取网络接收速度
 * @param   node_uuid    节点uuid
 */
export const getNetworkIncomingRate: Core.ECMSManager.GetNetworkIncomingRate = function ([node_uuid]) {
    return ECMSManager('get_network_incoming_rate', [node_uuid])
}

/**
 * 获取指定节点系统卷信息
 * @param   node_uuid    节点uuid
 */
export const getSysVolume: Core.ECMSManager.GetSysVolume = function ([node_uuid]) {
    return ECMSManager('get_sys_volume', [node_uuid])
}

/**
 * 获取缓存卷信息
 * @param   node_uuid    节点uuid
 */
export const getCacheVolume: Core.ECMSManager.GetCacheVolume = function ([node_uuid]) {
    return ECMSManager('get_cache_volume', [node_uuid])
}

/**
 * 获取指定节点上所有数据盘
 * @param   node_uuid    节点uuid
 */
export const getDataDisks: Core.ECMSManager.GetDataDisks = function ([node_uuid]) {
    return ECMSManager('get_data_disks', [node_uuid])
}

/**
 * 获取指定节点上的所有数据RAID物理磁盘列表
 * @param   node_ip    节点 ip
 */
export const getAllDataRaidPds: Core.ECMSManager.GetAllDataRaidPds = function ([node_ip]) {
    return ECMSManager('get_all_data_raid_pds', [node_ip])
}

/**
 * 获取指定节点上的所有RAID逻辑磁盘列表
 * @param   node_ip    节点 ip
 */
export const getAllRaidLds: Core.ECMSManager.GetAllRaidLds = function ([node_ip]) {
    return ECMSManager('get_all_raid_lds', [node_ip])
}

/**
 * 查询指定节点的指定 RAID 物理磁盘设备的详细信息
 * @param   node_ip    节点 ip
 * @param   pd_devid   设备唯一标识
 */
export const getRaidPdDetails: Core.ECMSManager.GetRaidPdDetails = function ([node_ip, pd_devid]) {
    return ECMSManager('get_raid_pd_details', [node_ip, pd_devid])
}

/**
 * 查询指定节点的指定 RAID 逻辑磁盘设备的详细信息
 * @param   node_ip    节点 ip
 * @param   ld_devid   设备唯一标识
 */
export const getRaidLdDetails: Core.ECMSManager.GetRaidLdDetails = function ([node_ip, ld_devid]) {
    return ECMSManager('get_raid_ld_details', [node_ip, ld_devid])
}

/**
 * 在指定节点上删除热备盘
 * @param   node_ip    节点 ip
 * @param   pd_devid   热备盘ID
 */
export const removeRaidHotspare: Core.ECMSManager.RemoveRaidHotspare = function ([node_ip, pd_devid]) {
    return ECMSManager('remove_raid_hotspare', [node_ip, pd_devid])
}

/**
 * 初始化指定节点上的指定空闲数据RAID物理磁盘(空闲数据RAID物理磁盘：指尚未加入存储池的数据RAID物理磁盘)
 * @param   node_ip    节点 ip
 * @param   pd_devids   需要初始化的RAID物理磁盘设备列表
 * @param   bond_disks_num    指定将几个磁盘绑定为一个数据盘
 */
export const initFreeDataRaidPds: Core.ECMSManager.InitFreeDataRaidPds = function ([node_ip, pd_devids, bond_disks_num]) {
    return ECMSManager('init_free_data_raid_pds', [node_ip, pd_devids, bond_disks_num])
}

/**
 * 获取指定节点上的可添加热备盘的RAID逻辑磁盘列表
 * @param   node_ip    节点 ip
 */
export const getRaidLdsForHotspare: Core.ECMSManager.GetRaidLdsForHotspare = function ([node_ip]) {
    return ECMSManager('get_raid_lds_for_hotspare', [node_ip])
}

/**
 * 在指定节点上添加RAID热备盘
 * @param   node_ip    节点 ip
 * @param   pd_devid   热备盘ID，可从空闲数据RAID物理磁盘中选取
 * @param   ld_devid   指定需要添加热备盘的RAID逻辑磁盘设备ID，若为空，则添加为全局热备盘
 */
export const addRaidHotspare: Core.ECMSManager.AddRaidHotspare = function ([node_ip, pd_devid, ld_devid]) {
    return ECMSManager('add_raid_hotspare', [node_ip, pd_devid, ld_devid])
}

/**
 * 是否支持raid管理
 * @param   node_ip    节点 ip
 */
export const isAvailableOfRaidManager: Core.ECMSManager.IsAvailableOfRaidManager = function ([node_ip]) {
    return ECMSManager('is_available_of_raid_manager', [node_ip])
}

/**
 * 获取系统时间
 * @param param0 
 */
export const getClusterTime: Core.ECMSManager.GetClusterTime = function () {
    return ECMSManager('get_cluster_time');
}

/**
 * 关闭系统
 */
export const shutdownCluster: Core.ECMSManager.ShutdownCluster = function () {
    return ECMSManager('shutdown_cluster');
}

/**
 * 获取警告项状态
 */
export const getAlertTriggerStatus: Core.ECMSManager.GetAlertTriggerStatus = function () {
    return ECMSManager('get_alert_trigger_status');
}

/**
 * 获取警告通知状态
 */
export const isAlertEnable: Core.ECMSManager.IsAlertEnable = function () {
    return ECMSManager('is_alert_enable')
}

/**
 * 启用告警通知
 */
export const enableAlert: Core.ECMSManager.EnableAlert = function () {
    return ECMSManager('enable_alert');
}

/**
 * 启用告警通知
 */
export const disableAlert: Core.ECMSManager.DisableAlert = function () {
    return ECMSManager('disable_alert');
}
