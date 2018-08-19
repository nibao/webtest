import * as React from 'react';
import { reduce } from 'lodash';
import WebComponent from '../webcomponent';
import '../../gen-js/EACPLog_types';
import { createECMSManagerClient, ECMSManagerClient, createESearchMgntClient } from '../../core/thrift2/thrift2';
import { manageLog } from '../../core/log2/log2';
import { Operation, Roles, DeployMode, ncTHaSys, DataBaseType, renderRolesName } from './helper';
import __ from './locale';

export default class ServerBase extends WebComponent<Components.Server.Props, Components.Server.State> {
    static contextTypes = {
        toast: React.PropTypes.func
    }

    static defaultPorps = {
    }

    state = {
        nodesInfo: [],
        haNodes: [],
        appNodes: [],
        storNodes: [],
        dbNodes: [],
        indexNodes: [],
        nodesCompleteInfo: [],
        loading: false,
        showNodeConfig: false,
        errorMessage: null,
        opState: Operation.NoOperation,
        indexServiceState: true,
        searchKey: '',
        confirmOperation: false
    }

    // 当前操作的节点
    node = null;

    // 重启操作后轮询请求的定时器
    timeout: number | null = null;

    // 集群部署模式
    deploymentMode: string = '';

    async componentWillMount() {
        this.setState({
            loading: true,
            opState: Operation.LoadingInfo
        })
        this.getDeploymentMode();
        this.setState({
            nodesInfo: await ECMSManagerClient.get_all_node_info()
        }, () => {
            this.getAllRoleNodes();
        })
    }

    /**
     * 获取集群部署模式
     */
    private async getDeploymentMode() {
        try {
            this.deploymentMode = await ECMSManagerClient.get_deployment_mode();
        } catch (ex) {
            this.deploymentMode = DeployMode.BasicMode
        }
    }

    /**
     * 按照节点ip从小到大排序
     */
    sortNodes(nodes) {
        return nodes.sort((pre, next) => pre.node_ip.split('.').join('') - next.node_ip.split('.').join(''))
    }

    /**
     * 更新站点内部节点信息
     */
    protected updateNodesInfo(operation, results) {
        // 先关闭配置节点弹窗
        this.setState({
            showNodeConfig: false
        }, async () => {
            if (operation === Operation.NoOperation) {
                return;
            } else {
                if (results.needRedirectToIndex) {
                    // 跳转到新的集群控制节点登录页
                    location.assign(`${location.protocol}//${this.node.nodeIp}:8080`)
                } else {
                    if (results.success.length) { // 有执行成功的请求
                        this.setState({
                            nodesInfo: await ECMSManagerClient.get_all_node_info()
                        }, () => {
                            this.getAllRoleNodes();
                        })
                    }
                    if (results.failed.length) { // 有操作失败的请求                 
                        this.setState({
                            opState: operation,
                            errorMessage: results
                        })
                    } else {
                        this.setState({
                            errorMessage: null,
                            nodesInfo: await ECMSManagerClient.get_all_node_info()
                        }, () => {
                            this.node = null;
                            this.context.toast(operation === Operation.AddNode ? __('添加成功') : __('设置成功'), { code: '\uf02f', size: 24, color: 'green' });
                        })
                        results.success.length && this.handleUpdateNodeConfig(results.success)
                    }
                }
            }
        })
    }

    /**
     * 添加/设置节点后存在以下情况,更新NavTree,跳转到新的服务器管理路由
     * 1.当前站点没有应用节点
     * 2.添加了第一个应用节点
     * 3.添加节点
     */
    handleUpdateNodeConfig(successConfig) {
        successConfig.some(([, progress]) =>
            progress === 'addApplicationNode' && this.state.appNodes.length === 0 ||
            progress === 'delApplicationNode' && this.state.appNodes.length === 1 ||
            progress === 'addNode'
        ) ?
            this.props.onUpdateNodeConfig()
            : null
    }

    /**
     * 获取指定节点索引服务状态
     */
    protected async getIndexServiceState(indexNodes) {
        if (indexNodes.length) {
            try {
                this.setState({
                    indexServiceState: await createESearchMgntClient({ ip: indexNodes[0].node_ip }).GetServiceStatus()
                })
            } catch (ex) {
                this.setState({
                    indexServiceState: false
                })
            }
        }
    }

    private async getAllRoleNodes() {
        const [haNodes, appNodes, storNodes, indexNodes, dbNodes] = await Promise.all([
            ECMSManagerClient.get_ha_node_info(),
            ECMSManagerClient.get_app_node_info(),
            ECMSManagerClient.get_storage_node_info(),
            this.getIndexNodes(),
            ECMSManagerClient.get_db_node_info()
        ])

        this.setState({
            haNodes,
            appNodes,
            storNodes,
            dbNodes,
            indexNodes,
        }, () => {
            // 获取索引节点服务状态
            this.getIndexServiceState(indexNodes);

            const nodesAllInfo = this.sortNodes(this.state.nodesInfo).map(node => {
                return {
                    nodeUuid: node.node_uuid,
                    nodeIp: node.node_ip,
                    nodeAlias: node.node_alias,
                    nodeRoles: {
                        haRole: this.state.haNodes.filter(hanode => hanode.node_ip === node.node_ip).length ?
                            this.determineHaRole(this.state.haNodes.find(hanode => hanode.node_ip === node.node_ip)) : null,
                        dbRole: node.role_db ?
                            node.role_db === DataBaseType.Master ? Roles.MasterDb : Roles.SlaveDb
                            : null,
                        indexRole: this.state.indexNodes.filter(indexnode => indexnode.node_uuid === node.node_uuid).length ?
                            Roles.Index : null,
                        storageRole: node.role_storage ? Roles.Storage : null,
                        appRole: node.role_app ? Roles.App : null,
                        ecmsRole: node.role_ecms === 1 ? Roles.ClusterManage : null
                    },
                    lvsLoadBalanceState: {
                        app: node.role_app > 0 ? appNodes.find(appnode => appnode.node_uuid === node.node_uuid).lvs_status : null,
                        storage: node.role_storage > 0 ? storNodes.find(stornode => stornode.node_uuid === node.node_uuid).lvs_status : null
                    },
                    consistencyStatus: node.consistency_status,
                    isOnline: node.is_online
                }
            })

            this.setState({
                nodesCompleteInfo: nodesAllInfo,
                loading: false,
                opState: Operation.NoOperation
            })
        })
    }

    /**
     * 判断高可用角色
     */
    private determineHaRole(hanode) {
        switch (hanode.sys) {
            case ncTHaSys.Basic:
                return hanode.is_master ? Roles.MasterBasicHa : Roles.SlaveBasicHa

            case ncTHaSys.App:
                return hanode.is_master ? Roles.MasterAppHa : Roles.SlaveAppHa

            case ncTHaSys.Storage:
                return hanode.is_master ? Roles.MasterStorHa : Roles.SlaveStorHa

            case ncTHaSys.Database:
                return hanode.is_master ? Roles.MasterDbHa : Roles.SlaveDbHa

            default:
                return null
        }
    }

    /**
     * 获取具有索引角色的节点
     */
    private async getIndexNodes() {
        const indexNodeUuid = await ECMSManagerClient.get_node_uuid_by_app_name('eftsearch');
        return this.state.nodesInfo.filter(node => node.node_uuid === indexNodeUuid)
    }

    /**
     * 修复节点不一致性
     */
    protected async repairConsistency(node) {
        const { nodesCompleteInfo } = this.state;
        this.setState({
            opState: Operation.FixConsistency,
            loading: true
        }, async () => {
            try {
                await createECMSManagerClient({ ip: node.nodeIp }).consistency_repair()
                // 更新该节点一致性状态
                this.setState({
                    nodesCompleteInfo: nodesCompleteInfo.map(nodeInfo => {
                        if (nodeInfo.nodeIp === node.nodeIp) {
                            return {
                                ...node,
                                consistencyStatus: true
                            }
                        } else {
                            return nodeInfo
                        }
                    })
                })
            } catch (ex) {
                this.setState({
                    errorMessage: ex.expMsg
                })
            } finally {
                this.setState({
                    loading: false,
                    opState: Operation.NoOperation
                })
            }
        })
    }

    /**
     * 打开添加节点窗口
     */
    protected showNodeConfig() {
        this.setState({
            showNodeConfig: true
        })
    }

    /**
     * 打开设置节点窗口
     */
    protected setNodeConfig(node) {
        this.node = node;
        this.setState({
            showNodeConfig: true
        })
    }

    /**
     * 关闭添加节点窗口
     */
    protected closeNodeConfig() {
        this.setState({
            showNodeConfig: false
        })
        this.node = null
    }

    /**
     * 关闭错误弹窗
     */
    protected async closeErrorDialog(errorInfo?) {
        this.node = null;
        this.setState({
            errorMessage: null,
            opState: Operation.NoOperation
        })
        // 部分设置操作成功，判断是否需要跳转新的服务器管理路由
        if (errorInfo && errorInfo.success && errorInfo.success.length) {
            this.handleUpdateNodeConfig(errorInfo.success)
        } else if (errorInfo && errorInfo.failed && errorInfo.failed.length) {
            this.setState({
                nodesInfo: await ECMSManagerClient.get_all_node_info()
            }, () => {
                this.getAllRoleNodes();
            })
        }
    }

    /**
     * 打开警告提示框
     */
    protected showConfirmMessage(node, operation) {
        this.node = node;
        this.setState({
            opState: operation,
            confirmOperation: true
        })
    }

    /**
     * 切换LVS应用负载均衡开关状态
     */
    protected changeLVSAppBanlancingStatus(node, active) {
        const { nodesCompleteInfo } = this.state;

        if (active) { // 开启
            this.setState({
                opState: Operation.OpenLVSAppBalancing,
                loading: true
            }, async () => {
                try {
                    await ECMSManagerClient.enable_app_lvs(node.nodeUuid);
                    this.setState({
                        nodesCompleteInfo: nodesCompleteInfo.map(nodeInfo => {
                            if (nodeInfo.nodeIp === node.nodeIp) {
                                return {
                                    ...nodeInfo,
                                    lvsLoadBalanceState: {
                                        app: true,
                                        storage: node.lvsLoadBalanceState.storage
                                    }
                                }
                            } else {
                                return nodeInfo
                            }
                        })
                    })
                } catch (ex) {
                    this.setState({
                        errorMessage: ex.expMsg
                    })
                } finally {
                    this.setState({
                        loading: false,
                        opState: Operation.NoOperation
                    })
                    if (!this.state.errorMessage) {
                        this.node = null;
                    }
                }
            })
        } else { // 关闭
            this.showConfirmMessage(node, Operation.CloseLVSAppBalancing);
        }
    }

    /**
     * 切换LVS存储负载均衡开关状态
     */
    protected changeLVSStorBanlancingStatus(node, active) {
        const { nodesCompleteInfo } = this.state;

        if (active) {
            this.setState({
                opState: Operation.OpenLVSStorageBalancing,
                loading: true
            }, async () => {
                try {
                    await ECMSManagerClient.enable_storage_lvs(node.nodeUuid);
                    this.setState({
                        nodesCompleteInfo: nodesCompleteInfo.map(nodeInfo => {
                            if (nodeInfo.nodeIp === node.nodeIp) {
                                return {
                                    ...nodeInfo,
                                    lvsLoadBalanceState: {
                                        app: node.lvsLoadBalanceState.app,
                                        storage: true
                                    }
                                }
                            } else {
                                return nodeInfo
                            }
                        })
                    })
                } catch (ex) {
                    this.setState({
                        errorMessage: ex.expMsg
                    })
                } finally {
                    this.setState({
                        loading: false,
                        opState: Operation.NoOperation
                    })
                    if (!this.state.errorMessage) {
                        this.node = null;
                    }
                }
            })
        } else { // 关闭
            this.showConfirmMessage(node, Operation.CloseLVSStorageBalancing);
        }
    }

    /**
     * 执行当前操作
     */
    protected async implementOperation() {
        const { opState, nodesCompleteInfo } = this.state;

        this.setState({
            confirmOperation: false
        })

        switch (opState) {
            case Operation.CloseLVSAppBalancing:
                this.setState({
                    loading: true
                }, async () => {
                    try {
                        await ECMSManagerClient.disable_app_lvs(this.node.nodeUuid);
                        this.setState({
                            nodesCompleteInfo: nodesCompleteInfo.map(nodeInfo => {
                                if (nodeInfo.nodeIp === this.node.nodeIp) {
                                    return {
                                        ...this.node,
                                        lvsLoadBalanceState: {
                                            app: false,
                                            storage: this.node.lvsLoadBalanceState.storage
                                        }
                                    }
                                } else {
                                    return nodeInfo
                                }
                            })
                        })
                    } catch (ex) {
                        this.setState({
                            errorMessage: ex.expMsg
                        })
                    } finally {
                        this.setState({
                            loading: false
                        })
                        if (!this.state.errorMessage) {
                            this.node = null;
                        }
                    }
                })
                break;

            case Operation.CloseLVSStorageBalancing:
                this.setState({
                    loading: true
                }, async () => {
                    try {
                        await ECMSManagerClient.disable_storage_lvs(this.node.nodeUuid);
                        this.setState({
                            nodesCompleteInfo: nodesCompleteInfo.map(nodeInfo => {
                                if (nodeInfo.nodeIp === this.node.nodeIp) {
                                    return {
                                        ...this.node,
                                        lvsLoadBalanceState: {
                                            app: this.node.lvsLoadBalanceState.app,
                                            storage: false
                                        }
                                    }
                                } else {
                                    return nodeInfo
                                }
                            })
                        })
                    } catch (ex) {
                        this.setState({
                            errorMessage: ex.expMsg
                        })
                    } finally {
                        this.setState({
                            loading: false
                        })
                        if (!this.state.errorMessage) {
                            this.node = null;
                        }
                    }
                })
                break;

            case Operation.RestartService:
                this.setState({
                    loading: true,
                    opState: this.node.nodeRoles.ecmsRole ? Operation.RestartService : Operation.NoOperation
                }, async () => {
                    try {
                        await ECMSManagerClient.restart_eisooapp(this.node.nodeUuid);
                        if (this.node.nodeRoles.ecmsRole) {
                            await this.checkServiceStatus();
                            manageLog({
                                level: ncTLogLevel['NCT_LL_INFO'],
                                opType: ncTManagementType['NCT_MNT_RESTART'],
                                msg: __('重启节点“${nodeIp}”的后台服务 成功', { nodeIp: this.node.nodeIp }),
                                exMsg: 'eisooapp'
                            })
                        } else {
                            manageLog({
                                level: ncTLogLevel['NCT_LL_INFO'],
                                opType: ncTManagementType['NCT_MNT_RESTART'],
                                msg: __('重启节点“${nodeIp}”的后台服务 成功', { nodeIp: this.node.nodeIp }),
                                exMsg: 'eisooapp'
                            })
                        }
                    } catch (ex) {
                        this.setState({
                            errorMessage: ex.expMsg
                        })
                    } finally {
                        if (!this.node.nodeRoles.ecmsRole) {
                            this.setState({
                                loading: false
                            })
                        }

                        if (!this.state.errorMessage) {
                            this.node = null;
                        }
                    }
                })
                break;

            case Operation.RestartNode:
                this.setState({
                    loading: true,
                    opState: this.node.nodeRoles.ecmsRole ? Operation.RestartNode : Operation.NoOperation
                }, async () => {
                    try {
                        await ECMSManagerClient.reboot_node(this.node.nodeUuid);
                        if (this.node.nodeRoles.ecmsRole) {
                            await this.checkServiceStatus();
                            manageLog({
                                level: ncTLogLevel['NCT_LL_INFO'],
                                opType: ncTManagementType['NCT_MNT_RESTART'],
                                msg: __('重启节点“${nodeIp}” 成功', { nodeIp: this.node.nodeIp }),
                                exMsg: __('节点名称：${alias}，节点角色：${roles}', {
                                    alias: this.node.nodeAlias,
                                    roles: reduce(this.node.nodeRoles, (pre, value) => value ? `${pre}${pre ? ',' : ''}${renderRolesName(value)}` : pre, '') || '---'
                                })
                            })
                        } else {
                            manageLog({
                                level: ncTLogLevel['NCT_LL_INFO'],
                                opType: ncTManagementType['NCT_MNT_RESTART'],
                                msg: __('重启节点“${nodeIp}” 成功', { nodeIp: this.node.nodeIp }),
                                exMsg: __('节点名称：${alias}，节点角色：${roles}', {
                                    alias: this.node.nodeAlias,
                                    roles: reduce(this.node.nodeRoles, (pre, value) => value ? `${pre}${pre ? ',' : ''}${renderRolesName(value)}` : pre, '') || '---'
                                })
                            })
                        }
                    } catch (ex) {
                        this.setState({
                            errorMessage: ex.expMsg
                        })
                    } finally {
                        if (!this.node.nodeRoles.ecmsRole) {
                            this.setState({
                                loading: false
                            })
                        }

                        if (!this.state.errorMessage) {
                            this.node = null;
                        }
                    }
                })
                break;

            case Operation.DeleteNode:
                this.setState({
                    loading: true
                }, async () => {
                    try {
                        const { nodesInfo } = this.state;

                        await ECMSManagerClient.del_node(this.node.nodeUuid);
                        // 更新列表
                        this.setState({
                            nodesCompleteInfo: nodesCompleteInfo.filter(nodeInfo => nodeInfo.nodeIp !== this.node.nodeIp),
                            nodesInfo: nodesInfo.filter(nodeInfo => nodeInfo.node_ip !== this.node.nodeIp)
                        })
                        manageLog({
                            level: ncTLogLevel['NCT_LL_INFO'],
                            opType: ncTManagementType['NCT_MNT_REMOVE'],
                            msg: __('移除节点“${nodeIp}” 成功', { nodeIp: this.node.nodeIp }),
                            exMsg: this.node.nodeAlias ? __('节点名称：${alias}', { alias: this.node.nodeAlias }) : '',
                        })
                        // 删除节点后更新NavTree
                        this.props.onUpdateNodeConfig();
                    } catch (ex) {
                        // 删除失败
                        this.setState({
                            errorMessage: ex.expMsg
                        })
                    } finally {
                        this.setState({
                            loading: false
                        })
                        if (!this.state.errorMessage) {
                            this.node = null;
                        }
                    }
                })
                break;
        }
    }

    /**
     * 执行重启节点/服务后轮询判断服务是否恢复状态
     */
    private checkServiceStatus() {
        return new Promise(async resolve => {
            try {
                await ECMSManagerClient.get_all_node_info();
                this.setState({
                    opState: Operation.NoOperation,
                    loading: false
                })
                resolve();
            } catch (ex) {
                setTimeout(() => this.checkServiceStatus(), 10000)
            }
        })
    }

    /**
     * 取消当前操作
     */
    protected handleCancelOperate() {
        this.node = null;
        this.setState({
            opState: Operation.NoOperation
        })
    }

    /**
     * 改变搜索关键字
     */
    protected changeSearchKey(key: string) {
        this.setState({
            searchKey: key
        });
    }

    /**
     * 搜索节点方法
     */
    protected async searchNodes(key: string) {
        const allNodes = await ECMSManagerClient.get_all_node_info()
        if (key.trim()) {
            return allNodes.filter(node => node.node_ip.match(key) || node.node_alias.match(key)
            )
        } else {
            return allNodes
        }
    }

    /**
     * 载入搜索结果
     */
    protected loadSearchResult(data: Array<Core.ECMSManager.ncTNodeInfo>) {
        this.setState({
            nodesInfo: data
        }, () => {
            this.getAllRoleNodes()
        });
    }
}