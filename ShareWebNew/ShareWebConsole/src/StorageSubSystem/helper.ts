/**
 * 存储池初始化状态
 * 'UNINIT' : 未初始化
 * 'TOINIT' : 选择本地存储模式后，准备进行初始化
 * 'INITED' : 已经初始化过，直接进入对应面板
 * 'INITCANCEL': 初始化时取消
 */
export enum InitStatus {
    UNINIT,
    TOINIT,
    INITED,
    INITCANCEL,
}

/**
 * 管理模式
 */
export enum ManageMode {
    POOL,
    NODE
}

/**
 * 存储模式
 */
export enum StorageMode {
    ASU,                        // 本地ASU存储
    SWIFT,                      // 本地Swift存储
    THIRD,                      // 第三方存储
    INVAILD,                       // 应用节点不可用
}

/**
 * 副本模式
 */
export enum ReplicasMode {
    NONE = 0,
    ONE = 1,
    THREE = 3
}

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



