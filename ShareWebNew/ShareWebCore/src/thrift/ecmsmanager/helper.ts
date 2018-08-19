/**
 * 高可用节点所属子系统
 */
export enum ncTHaSys {
    /**
     * 非ha节点
     */
    NORMAL = 0,
    /**
     * 集群仅使用一个vip情况
     */
    BASIC = 1,
    /**
     * 应用子系统vip
     */
    APP = 2,
    /**
     * 存储子系统vip
     */
    STORAGE = 3,
}