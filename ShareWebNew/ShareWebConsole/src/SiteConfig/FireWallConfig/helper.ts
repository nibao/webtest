
import __ from './locale';

/**
 * 将 role_sys 中得英文转换为中文进行显示
 * @param role_sys 所属子系统
 */
export function transformDataGridRoleSys(role_sys) {
    switch (role_sys) {
        case 'ecms':
            return __('集群管理')
        case 'app':
            return __('应用')
        case 'storage':
            return __('存储')
        case 'db':
            return __('数据库')
        case 'basic':
            return __('公共')
    }
}

/**
 * 如果 source_net 为空字符串，则将空字符转换为AnyWhere进行显示
 * @param source_net 源IP/掩码
 */
export function transformDataGridSourceNet(source_net) {
    return source_net === '' ? 'AnyWhere' : source_net
}

/**
 * 如果 port 为空字符串，则转换为 All 进行显示
 * @param port 服务端口
 */
export function transformServicePortInfo(port) {
    return port === '' ? 'All' : port
}

