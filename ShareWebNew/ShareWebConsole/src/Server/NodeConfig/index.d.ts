declare namespace Components {
    namespace Server {
        namespace NodeConfig {
            interface Props extends React.Props<void> {
                /**
                * 站点内所有节点的高可用 | 数据库 | 文档索引 角色
                */
                roles: {
                    dbNodes: ReadonlyArray<Core.ECMSManager.ncTDBNodeInfo>;
                    haNodes: ReadonlyArray<Core.ECMSManager.ncTHaNodeInfo>;
                    indexNodes: ReadonlyArray<Core.ECMSManager.ncTNodeInfo>;
                }

                /**
                 * 站点内所有节点
                 */
                allNodes: ReadonlyArray<Core.ECMSManager.ncTNodeInfo>;

                /**
                 * 当前设置的节点
                 */
                node?: any;

                /**
                 * 集群部署模式
                 */
                deploymentMode: string;

                /**
                 * 取消节点配置事件
                 */
                onNodeConfigCancel: () => void;

                /**
                 * 确定节点配置事件
                 */
                onNodeConfigConfirm: (operation: number, errMsg?: string) => void;
            }

            interface State {
                /**
                 * 是否显示弹窗
                 */
                showDialog: boolean;

                /**
                * 节点SSH IP
                */
                nodeHost: string;

                /**
                 * 角色配置
                 */
                rolesConfig: {
                    haRole: number;
                    dbRole: number;
                    appRole: number;
                    storageRole: number;
                    indexRole: number;
                    ecmsRole: number;
                }

                /**
                 * vip 配置
                 */
                vipConfig: {
                    vip: string;
                    mask: string;
                    nic: string;
                    sys: number;
                }

                /**
                 * 数据库连接ip
                 */
                ivip: string;

                /**
                 * 节点别名
                 */
                nodeAlias: string;

                /**
                * 当前设置节点可选择的角色(高可用和数据库)
                */
                roles: {
                    ha: number;
                    db: number;
                    index: Array<number>;
                    haMode: Array<number>;
                };

                /**
                 * 选择的高可用模式
                 */
                selectedHaMode: number;

                /**
                 * 验证状态
                 */
                validateState: {
                    host: number;
                    alias: number;
                    vip: number;
                    ivip: number;
                    mask: number;
                };

                /**
                 * 是否禁用高可用选项
                 */
                disableHaCheckBox: boolean;

                /**
                 * 是否禁用数据库选项
                 */
                disableDbCheckBox: boolean;

                /**
                 * 操作状态
                 */
                operationStatus: number;

                /**
                 * 警告操作
                 */
                warningOperation: {
                    /**
                     * 取消高可用主节点
                     */
                    cancelHaMaster: boolean;
                    /**
                     * 取消高可用从节点
                     */
                    cancelHaSlave: boolean;
                    /**
                     * 取消数据库从节点
                     */
                    cancelDbSlave: boolean;
                    /**
                     * 取消索引节点
                     */
                    cancelIndex: boolean;
                    /**
                     * 在非集群管理节点设置高可用主节点(固化模式)
                     */
                    setHaMaster: boolean;
                    /**
                     * 在非集群管理节点设置高可用主节点(全局)(灵活模式)
                     */
                    setHaMasterBasic: boolean;
                    /**
                     * 在非集群管理节点设置高可用主节点(应用)(灵活模式/公有云模式)
                     */
                    setHaMasterApp: boolean;
                };

                /**
                 * 进程中的请求名称
                 */
                requestInProgress: string;

                /**
                 * 是否使用第三方数据库
                 */
                useExternalDb: boolean;

                /**
                 * 存储信息
                 */
                thirdPartyOSS: string;

                /**
                 * 网卡信息选项
                 */
                nicOptions: ReadonlyArray<string>;
            }
        }
    }
}