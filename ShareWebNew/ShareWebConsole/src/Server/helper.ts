import __ from './locale';

export const enum Roles {
    /**
     * 高可用主节点(全局)
     */
    MasterBasicHa = 1,

    /**
     * 高可用从节点(全局)
     */
    SlaveBasicHa = 2,

    /**
     * 高可用主节点(应用)
     */  
    MasterAppHa = 3,

    /**
     * 高可用从节点(应用)
     */
    SlaveAppHa = 4,
    
    /**
     * 高可用主节点(存储)
     */
    MasterStorHa = 5,

    /**
     * 高可用从节点(存储)
     */
    SlaveStorHa = 6,
    
    /**
     * 高可用主节点(数据库)
     */
    MasterDbHa = 7,

    /**
     * 高可用从节点(数据库)
     */
    SlaveDbHa = 8,
    
    /**
     * 数据库主节点
     */
    MasterDb = 9,

    /**
     * 数据库从节点
     */
    SlaveDb = 10,

    /**
     * 应用节点
     */
    App = 11,

    /**
     * 存储节点
     */
    Storage = 12,

    /**
     * 集群管理节点
     */
    ClusterManage = 13,

    /**
     * 文档索引节点
     */
    Index = 14
}

export enum Operation  {
    /**
     * 无操作
     */
    NoOperation,

    /**
     * 开启LVS负载均衡-应用
     */
    OpenLVSAppBalancing,

    /**
     * 开启LVS负载均衡-存储
     */
    OpenLVSStorageBalancing,

    /**
     * 关闭LVS负载均衡-应用
     */
    CloseLVSAppBalancing,

    /**
     * 关闭LVS负载均衡-存储
     */
    CloseLVSStorageBalancing,

    /**
     * 重启服务
     */
    RestartService,

    /**
     * 重启节点
     */
    RestartNode,

    /**
     * 添加节点
     */
    AddNode,

    /**
     * 设置节点
     */
    SetNode,

    /**
     * 删除节点
     */
    DeleteNode,

    /**
     * 修复节点一致性
     */
    FixConsistency,

    /**
     * 加载数据
     */
    LoadingInfo
}

/**
 * 集群部署模式
 */
export const enum DeployMode {
    /**
     * 固化模式
     */
    BasicMode = 'standard',

    /**
     * 灵活模式
     */
    ProfessionalMode = 'professional',

    /**
     * 公有云模式
     */
    CloudMode = 'cloud'
}

/**
 * 高可用节点所属子系统
 */
export enum ncTHaSys {
    /**
     * 非ha节点
     */
    Normal = 0,

    /**
     * 集群仅使用一个vip情况
     */
    Basic = 1,

    /**
     * 应用子系统vip
     */
    App = 2,

    /**
     * 存储子系统vip
     */
    Storage = 3,

    /**
     * 数据库子系统vip
     */
    Database = 4
}

export enum DataBaseType {
    /**
     * 非数据库节点
     */
    Normal,
    /**
     * 数据库master节点
     */
    Master,
    /**
     * 数据库slave节点
     */
    Slave
}

export function renderRolesName(role) {
    switch (role) {
        case Roles.MasterBasicHa:
            return __('高可用主节点')
        case Roles.SlaveBasicHa:
            return __('高可用从节点')
        case Roles.MasterAppHa:
            return __('高可用主节点（应用）')
        case Roles.SlaveAppHa:
            return __('高可用从节点（应用）')
        case Roles.MasterStorHa:
            return __('高可用主节点（存储）')
        case Roles.SlaveStorHa:
            return __('高可用从节点（存储）')
        case Roles.MasterDbHa:
            return __('高可用主节点（数据库）')
        case Roles.SlaveDbHa:
            return __('高可用从节点（数据库）')
        case Roles.MasterDb:
            return __('数据库主节点')
        case Roles.SlaveDb:
            return __('数据库从节点')
        case Roles.App:
            return __('应用节点')
        case Roles.Storage:
            return __('存储节点')
        case Roles.ClusterManage:
            return __('集群管理节点')
        case Roles.Index:
            return __('文档索引节点')
        default:
            return null
    }
}