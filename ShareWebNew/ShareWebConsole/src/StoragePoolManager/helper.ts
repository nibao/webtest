/**
 * 等待提示类别
 */
export enum LoadingStatus {
    NOVISIBLE,                   // 不可见
    INITING,                     // 正在初始化
    LOADING,                     // 正在加载
    REPLACING,                   // 正在替换
    BALANCING,                   // 正在重载
    REMOVING,                    // 正在移除
    ADDING,                      // 正在添加
    MODIFYING,                   // 正在修改
}

/**
 * 信息提示类别
 */
export enum ConfirmStatus {
    NOVISIBLE,                   // 不可见
    LINK_TO_SERVER,              // 提示 跳转至服务器管理页面
    NO_FREE_DISKS_FOR_ADD,       // 提示 当前所有存储节点均不存在空闲设备
    NO_FREE_DISKS_FOR_REPLACE,   // 提示 当前节点不存在可替换设备
}

/**
 * 警告提示类别
 */
export enum WarningStatus {
    NOVISIBLE,                   // 不可见
    EMPTY_DISKS,                 // 警告 移除该节点上的所有磁盘
    DELETE_DISK,                 // 警告 移除某个磁盘
    BALANCE,                     // 警告 重载
    CHOOSE_MODE                  // 警告 选择模式
}

/**
 * 错误信息类别
 */
export enum ErrorStatus {
    NOVISIBLE,                   // 不可见
    INIT_FAILED,                 // 初始化失败
    LOADING_FAILED,              // 加载失败
    GET_FREE_DISK_FAILED,        // 获取空闲设备失败
    REPLACE_FAILED,              // 替换设备失败
    BALANCE_FAILED,              // 重载失败
    REMOVE_FAILED,               // 移除失败
    ADD_FAILED,                  // 添加失败
    MODIFY_FAILED,               // 修改失败
}

/**
 * 获取到的设备状态
 */
export enum DevicesStatus {
    /**
     * 没有空闲设备
     */
    NoFreeDevices,

    /**
     * 获取设备失败
     */
    GetDevicesFailed
}