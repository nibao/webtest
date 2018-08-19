import __ from '../locale';

export enum ValidateState {
    Normal,
    InvalidHost,
    InvalidPort,
    InvalidAlias,
    DuplicateAlias,
    InvalidVip,
    InvalidIvip,
    DuplicateHost,
    InvalidMask,
    ReusedIp
}

export enum OperationStatus {
    /**
     * 无操作
     */
    None,
    /**
     * 操作处理中
     */
    Running,
    /**
     * 完成操作
     */
    Done
}

export enum WarningOperation {
    /**
     * 取消高可用主节点角色
     */
    CancelHaMaster,

    /**
     * 取消高可用从节点角色
     */
    CancelHaSlave,

    /**
     * 取消数据库从节点角色
     */
    CancelDbSlave,

    /**
     * 取消安装文档索引角色
     */
    CancelIndex
}

/**
 * 固化模式下添加节点后默认设置的角色
 */
export function getDefaultRolesInBasicDeployment(successOperation) {
    switch (successOperation) {
        case 'setHaSlave':
            return __('高可用从节点')
        case 'addApplicationNode':
            return __('应用节点')
        case 'setDbSlave':
            return __('数据库从节点')
        case 'addStorageNode':
            return __('存储节点')
        default:
            return null
    }
}

export const DefaultNicText = {
    selectNic: __('请选择网卡')
}