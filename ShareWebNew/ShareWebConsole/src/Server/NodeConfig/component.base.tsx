import * as React from 'react';
import { values, isEqual, reduce, omit } from 'lodash';
import WebComponent from '../../webcomponent';
import '../../../gen-js/ECMSManager_types';
import '../../../gen-js/ECMSAgent_types';
import { ECMSManagerClient, createECMSManagerClient, createEVFSClient, createESearchMgntClient } from '../../../core/thrift2/thrift2';
import { manageLog } from '../../../core/log2/log2';
import { ErrorCode as EcmsmanagerErrcode } from '../../../core/thrift/ecmsmanager/errcode';
import { IP, subNetMask } from '../../../util/validators/validators';
import { Operation, Roles, DeployMode, ncTHaSys, renderRolesName } from '../helper';
import { ValidateState, OperationStatus, getDefaultRolesInBasicDeployment, DefaultNicText } from './helper';
import __ from './locale';

export default class NodeConfigBase extends WebComponent<Components.Server.NodeConfig.Props, Components.Server.NodeConfig.State> {
    static defaultPorps = {
    }

    state = {
        nodeHost: '',
        rolesConfig: {
            haRole: 0,
            dbRole: 0,
            appRole: 0,
            storageRole: 0,
            indexRole: 0,
            ecmsRole: 0
        },
        vipConfig: {
            vip: '',
            mask: '',
            nic: '',
            sys: 0
        },
        ivip: '',
        nodeAlias: '',
        roles: {
            ha: 0,
            db: 0,
            index: [],
            haMode: []
        },
        validateState: {
            host: ValidateState.Normal,
            alias: ValidateState.Normal,
            vip: ValidateState.Normal,
            ivip: ValidateState.Normal,
            mask: ValidateState.Normal
        },
        selectedHaMode: 0,
        disableHaCheckBox: false,
        disableDbCheckBox: false,
        showDialog: false,
        operationStatus: OperationStatus.None,
        warningOperation: {
            cancelHaMaster: false,
            cancelHaSlave: false,
            cancelDbSlave: false,
            cancelIndex: false,
            setHaMaster: false,
            setHaMasterBasic: false,
            setHaMasterApp: false
        },
        requestInProgress: '',
        useExternalDb: false,
        thirdPartyOSS: '',
        nicOptions: []
    }

    // 待修改节点原始信息
    nodeOriginalInfo = {
        nodeInfo: {},
        aliasInfo: '',
        rolesInfo: {},
        vipInfo: {},
        ivip: '',
        ha: null,
        haMode: [],
        selectedHaMode: 0,
        disableHaCheckBox: false
    }

    // 卸载索引节点是否删除索引目录
    deleteIndexByUninstall: boolean = false;

    async componentDidMount() {
        // 判断是否使用第三方数据库
        this.setState({
            useExternalDb: await ECMSManagerClient.is_external_db()
        })
        // 检查第三方存储信息
        this.checkThirdInfo();
        // 设置节点时获取节点角色信息
        if (this.props.node) {
            // 获取可选择的网卡名
            this.getAllNicsName(this.props.node)
            this.getNodeRoles(this.props.node);
        }
    }

    /**
     * 获取当前配置节点的所有网卡名
     */
    private async getAllNicsName(node) {
        this.setState({
            nicOptions: [DefaultNicText.selectNic, ...(await ECMSManagerClient.get_all_nics_name(node.nodeUuid))]
        })
    }

    /**
     * 检查第三方存储信息
     */
    private async checkThirdInfo() {
        const appIp = await ECMSManagerClient.get_app_master_node_ip();

        try {
            if (appIp !== '') {
                const thirdPartyOSSInfo = await createEVFSClient({ ip: appIp }).GetThirdPartyOSSInfo();
                this.setState({
                    thirdPartyOSS: thirdPartyOSSInfo ? thirdPartyOSSInfo.provider : ''
                })
            }
        } catch (ex) {
            this.setState({
                thirdPartyOSS: ''
            })
        }
    }

    /**
     * 获取当前选择节点的所有角色信息
     */
    private getNodeRoles(node) {
        const { haNodes, dbNodes, indexNodes } = this.props.roles;
        const { rolesConfig, roles } = this.state;
        const haInfo = haNodes.filter(hanode => hanode.node_uuid === node.nodeUuid);

        this.setState({         
            nodeHost: node.nodeIp,
            nodeAlias: node.nodeAlias,
            rolesConfig: {
                ...rolesConfig,
                haRole: node.nodeRoles.haRole,
                dbRole: node.nodeRoles.dbRole,
                appRole: node.nodeRoles.appRole,
                storageRole: node.nodeRoles.storageRole,
                indexRole: node.nodeRoles.indexRole,
                ecmsRole: node.nodeRoles.ecmsRole
            }
        }, async () => {
            const [ha, hamode, selectedHaMode, disableHaCheckStatus] = await this.buildRolesWhenSetting(haInfo);
            this.setState({
                roles: {
                    ...roles,
                    ha,
                    db: this.state.rolesConfig.dbRole ?
                        this.state.rolesConfig.dbRole
                        : dbNodes.length === 1 ?
                            Roles.SlaveDb
                            : Roles.MasterDb,
                    haMode: hamode,
                    index: indexNodes
                },
                selectedHaMode,
                disableHaCheckBox: disableHaCheckStatus,
                disableDbCheckBox: this.getDbCheckDisableStatus()
            })
            this.nodeOriginalInfo = {
                nodeInfo: this.state.nodeHost,
                aliasInfo: this.state.nodeAlias,
                rolesInfo: this.state.rolesConfig,
                vipInfo: this.state.vipConfig,
                ivip: this.state.ivip,
                ha, // 可选的高可用节点默认角色(初始状态)
                haMode: hamode, // 可选择的高可用模式(初始状态)
                selectedHaMode: selectedHaMode, // 初始状态下选择的高可用模式
                disableHaCheckBox: disableHaCheckStatus
            }
        })
    }

    /**
     * 设置节点时构造节点角色
     */
    private async buildRolesWhenSetting(haInfo) {
        const { deploymentMode } = this.props;
        let hamode, selectedHaMode, ha, disableHaCheckStatus; // 高可用模式 高可用角色 高可用复选框禁用状态

        // 是高可用主节点时获取vip配置
        if (haInfo.length && haInfo[0].is_master) {
            const allVipInfo = await ECMSManagerClient.get_vip_info();
            const { vip, mask, nic, sys } = allVipInfo.find(vip => vip.sys === haInfo[0].sys);

            this.setState({
                vipConfig: {
                    vip,
                    mask,
                    nic,
                    sys
                },
                // 高可用模式为全局时再获取sys为数据库子系统的ip
                ivip: haInfo[0].sys === 1 ? allVipInfo.find(vip => vip.sys === ncTHaSys.Database) && allVipInfo.find(vip => vip.sys === ncTHaSys.Database).vip || this.state.ivip : this.state.ivip,
            })
        }

        try {
            const keepAliveStatus = await ECMSManagerClient.get_keepalived_status()
            if (keepAliveStatus) { // 高可用服务已启用
                ha = this.getHa(haInfo, deploymentMode);
                [hamode, selectedHaMode] = this.getHaMode(haInfo, deploymentMode);
                disableHaCheckStatus = this.getHaCheckDisableStatus(haInfo, deploymentMode);
            } else { // 高可用服务未启用
                disableHaCheckStatus = true;
                [ha, hamode, selectedHaMode] = this.getHaWhenServiceDisabled(deploymentMode)
            }
        } catch (ex) {
            disableHaCheckStatus = true;
            [ha, hamode, selectedHaMode] = this.getHaWhenServiceDisabled(deploymentMode)
        }

        return [ha, hamode, selectedHaMode, disableHaCheckStatus];
    }

    /**
     * 高可用服务未启用时高可用角色的判断(灵活模式/公有云模式)
     * return [ha, hamode, selectedHaMode]
     */
    private getHaWhenServiceDisabled(deploymentMode) {
        if (deploymentMode === DeployMode.ProfessionalMode) { // 灵活模式
            return [Roles.MasterBasicHa, [ncTHaSys.Basic], ncTHaSys.Basic]
        } else if (deploymentMode === DeployMode.CloudMode) { // 公有云模式
            return [Roles.MasterAppHa, [ncTHaSys.App], ncTHaSys.App]
        }
    }

    /**
     * 设置节点时获取数据库复选框禁用状态
     */
    private getDbCheckDisableStatus() {
        const { haNodes, dbNodes } = this.props.roles;
        const { rolesConfig } = this.state;

        if (this.state.useExternalDb) { // 使用了第三方数据库
            return true
        } else {
            if (this.props.node.nodeRoles.dbRole === Roles.MasterDb) {
                return true
            } else if (this.props.node.nodeRoles.dbRole === Roles.SlaveDb) {
                return false
            } else { // 该节点本身不是数据库节点
                if (dbNodes.length === 2) { // 已经有足够的数据库节点
                    return true
                } else {
                    // 当前节点是高可用主节点(应用/存储)并存在相应的高可用从节点,则禁用数据库节点复选框
                    if (rolesConfig.haRole === Roles.MasterAppHa && haNodes.some(node => node.sys === ncTHaSys.App && !node.is_master) ||
                        rolesConfig.haRole === Roles.MasterStorHa && haNodes.some(node => node.sys === ncTHaSys.Storage && !node.is_master)) {
                        return true
                    } else {
                        return false
                    }
                }
            }
        }
    }

    /**
     * 设置节点时获取默认显示的高可用角色
     */
    private getHa(haInfo, deploymentMode) {
        const { haNodes, dbNodes } = this.props.roles;
        const { rolesConfig, useExternalDb } = this.state;

        // 固化模式下
        if (deploymentMode === DeployMode.BasicMode) {
            if (rolesConfig.dbRole === Roles.MasterDb) { // 当前节点是数据库主节点
                // 高可用复选框显示高可用主节点，复选框可用
                return Roles.MasterBasicHa;
            } else if (rolesConfig.dbRole === Roles.SlaveDb) { // 当前节点是数据库从节点
                // 高可用复选框显示高可用从节点，复选框可用
                return Roles.SlaveBasicHa;
            } else { // 当前节点不是数据库节点
                if (rolesConfig.haRole === Roles.MasterBasicHa) { // 是高可用主节点，则显示高可用主节点（即使用第三方数据库）
                    return Roles.MasterBasicHa;
                } else if (rolesConfig.haRole === Roles.SlaveBasicHa) { // 是高可用从节点，则显示高可用从节点（即使用第三方数据库）
                    return Roles.SlaveBasicHa;
                } else { // 不是高可用主节点
                    if (dbNodes.length) { // 当前站点已有数据库主节点时，则显示高可用主节点，复选框不勾选，且灰化
                        return Roles.MasterBasicHa;
                    } else { // 当前站点没有数据库主节点时（即使用第三方数据库）
                        if (!haNodes.length) { // 此时站点中没有高可用主节点
                            return Roles.MasterBasicHa;
                        } else if (haNodes.length === 1) { // 此时站点中已有高可用主节点 且 没有高可用从节点
                            return Roles.SlaveBasicHa;
                        } else if (haNodes.length === 2) { // 有足够的高可用节点
                            return Roles.MasterBasicHa;
                        }
                    }
                }
            }
        } else if (deploymentMode === DeployMode.ProfessionalMode) { // 灵活模式下
            if (!haInfo.length) { // 当前节点不是高可用节点
                if (rolesConfig.dbRole === Roles.MasterDb) { // 当前节点是数据库主节点
                    if (!haNodes.length) { // 系统中没有高可用主从节点
                        return Roles.MasterBasicHa;
                    } else {
                        // 存在高可用主节点(应用) 或 高可用主节点(存储)
                        if (haNodes.some(node => (node.sys === ncTHaSys.App || node.sys === ncTHaSys.Storage) && node.is_master)) {
                            return Roles.MasterDbHa;
                        }
                    }
                } else if (rolesConfig.dbRole === Roles.SlaveDb) { // 当前节点是数据库从节点
                    // 存在用于数据库的高可用主节点，则可选项为：<当前已有的用于数据库的高可用模式>
                    if (haNodes.some(node => node.sys === ncTHaSys.Basic)) {
                        return Roles.SlaveBasicHa;
                    } else if (haNodes.some(node => node.sys === ncTHaSys.Database)) {
                        return Roles.SlaveDbHa;
                    } else { // 不存在用于数据库的高可用主节点，则灰化复选框和下拉菜单
                        return Roles.SlaveBasicHa;
                    }
                } else { // 当前节点不是数据库主从节点
                    if (!haNodes.length) { // 没有高可用节点
                        if (useExternalDb) { // 使用第三方数据库
                            return Roles.MasterBasicHa;
                        } else { // 使用本地数据库
                            return Roles.MasterAppHa;
                        }
                    } else if (haNodes.length === 1) {
                        if (haNodes[0].sys === ncTHaSys.App && haNodes[0].is_master) { // 只有一个高可用主节点（应用），无从节点
                            return Roles.SlaveAppHa;
                        } else if (haNodes[0].sys === ncTHaSys.Storage && haNodes[0].is_master) { // 只有一个高可用主节点（存储），无从节点
                            return Roles.SlaveStorHa;
                        } else if (haNodes[0].sys === ncTHaSys.Basic && haNodes[0].is_master) { // 只有一个高可用主节点（全局），无从节点
                            return Roles.SlaveBasicHa;
                        } else { // 只有一个高可用主节点（数据库），无从节点
                            return Roles.MasterAppHa;
                        }
                    } else if (haNodes.length === 2) {
                        if (haNodes.some(hanode => hanode.sys === ncTHaSys.App && !hanode.is_master)) { // 存在高可用从节点（应用）
                            return Roles.MasterStorHa;
                        } else if (haNodes.some(hanode => hanode.sys === ncTHaSys.Storage && !hanode.is_master)) { // 存在高可用从节点（存储）
                            return Roles.MasterAppHa;
                        } else if (haNodes.some(hanode => hanode.sys === ncTHaSys.Database && !hanode.is_master)) { // 存在高可用从节点（数据库）
                            return Roles.MasterAppHa;
                        } else if (haNodes.some(hanode => hanode.sys === ncTHaSys.Basic && !hanode.is_master)) { // 存在高可用从节点（全局）
                            return Roles.MasterBasicHa;
                        } else if (haNodes.some(hanode => hanode.sys === ncTHaSys.App && hanode.is_master)) { // 存在高可用主节点（应用）
                            return Roles.SlaveAppHa;
                        } else if (haNodes.some(hanode => hanode.sys === ncTHaSys.Storage && hanode.is_master)) { // 存在高可用主节点（存储）
                            return Roles.SlaveStorHa;
                        }
                    } else if (haNodes.length === 3) {
                        if (useExternalDb) { // 使用第三方数据库
                            if (haNodes.some(hanode => hanode.sys === ncTHaSys.App && !hanode.is_master)) { // 存在高可用从节点（应用）
                                return Roles.SlaveStorHa;
                            } else { // 存在高可用从节点（存储）
                                return Roles.SlaveAppHa;
                            }
                        } else { // 使用本地数据库
                            if (haNodes.some(hanode => hanode.sys === ncTHaSys.App && !hanode.is_master)) { // 存在高可用从节点（应用）
                                if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用主节点(存储)
                                    return Roles.SlaveStorHa;
                                } else if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用主节点(数据库)
                                    return Roles.SlaveDbHa;
                                }
                            } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用从节点(存储)
                                if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用主节点(应用)
                                    return Roles.SlaveAppHa;
                                } else if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Database)) {
                                    return Roles.SlaveDbHa;
                                }
                            } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用从节点(数据库)
                                if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用主节点(应用)
                                    return Roles.SlaveAppHa;
                                } else if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用主节点(存储)
                                    return Roles.SlaveStorHa;
                                }
                            }
                        }
                    } else if (haNodes.length === 4) {
                        if (useExternalDb) { // 使用第三方数据库
                            return Roles.MasterBasicHa;
                        } else { // 使用本地数据库
                            if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用从节点(应用)
                                if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用从节点(存储)
                                    return Roles.MasterDbHa;
                                } else if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用主节点(存储)
                                    return Roles.SlaveStorHa;
                                } else { // 不存在高可用主节点(存储)
                                    return Roles.MasterStorHa;
                                }
                            } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用从节点(存储)
                                if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用从节点(应用)
                                    return Roles.MasterDbHa;
                                } else if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用主节点(应用)
                                    return Roles.SlaveAppHa;
                                } else { // 不存在高可用主节点(应用)
                                    return Roles.MasterAppHa;
                                }
                            } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用从节点(数据库)
                                if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用从节点(应用)
                                    return Roles.MasterStorHa;
                                } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用从节点(存储)
                                    return Roles.MasterAppHa;
                                } else { // 存在高可用主节点(应用)和高可用主节点(存储)
                                    return Roles.SlaveAppHa;
                                }
                            }
                        }
                    } else if (haNodes.length === 5) {
                        if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App) &&
                            haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用从节点(应用)和高可用从节点(存储)
                            return Roles.MasterBasicHa;
                        } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App) &&
                            haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用从节点(应用)和高可用从节点(数据库)
                            return Roles.SlaveStorHa;
                        } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage) &&
                            haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用从节点(存储)和高可用从节点(数据库)
                            return Roles.SlaveAppHa;
                        }
                    } else { // 存在足够的高可用节点
                        return Roles.MasterBasicHa;
                    }
                }
            } else { // 当前节点是高可用节点
                return rolesConfig.haRole;
            }
        } else if (deploymentMode === DeployMode.CloudMode) { // 公有云模式下
            if (!haInfo.length) { // 当前节点不是高可用节点
                if (!haNodes.length) { // 系统中没有高可用主从节点
                    return Roles.MasterAppHa;
                } else if (haNodes.length === 1) { // 只存在高可用主节点(应用)
                    return Roles.SlaveAppHa;
                } else if (haNodes.length === 2) { // 有足够的高可用节点
                    return Roles.MasterAppHa;
                }
            } else { // 当前节点是高可用节点
                return rolesConfig.haRole;
            }
        }
    }

    /**
     * 设置节点时获取高可用模式选项及默认选项
     */
    private getHaMode(haInfo, deploymentMode) {
        const { haNodes } = this.props.roles;
        const { rolesConfig, useExternalDb } = this.state;
        let hamode, selectedHaMode; // 高可用模式 高可用角色

        if (deploymentMode === DeployMode.ProfessionalMode) { // 灵活模式下
            if (!haInfo.length) { // 当前节点不是高可用节点
                if (rolesConfig.dbRole === Roles.MasterDb) { // 当前节点是数据库主节点
                    if (!haNodes.length) { // 系统中没有高可用主从节点
                        hamode = [ncTHaSys.Basic, ncTHaSys.Database];
                        selectedHaMode = ncTHaSys.Basic;
                    } else {
                        // 存在高可用主节点(应用) 或 高可用主节点(存储)
                        if (haNodes.some(node => (node.sys === ncTHaSys.App || node.sys === ncTHaSys.Storage) && node.is_master)) {
                            hamode = [ncTHaSys.Database];
                            selectedHaMode = ncTHaSys.Database;
                        }
                    }
                } else if (rolesConfig.dbRole === Roles.SlaveDb) { // 当前节点是数据库从节点
                    // 存在用于数据库的高可用主节点，则可选项为：<当前已有的用于数据库的高可用模式>
                    if (haNodes.some(node => node.sys === ncTHaSys.Basic)) {
                        hamode = [ncTHaSys.Basic];
                        selectedHaMode = ncTHaSys.Basic;
                    } else if (haNodes.some(node => node.sys === ncTHaSys.Database)) {
                        hamode = [ncTHaSys.Database];
                        selectedHaMode = ncTHaSys.Database;
                    } else { // 不存在用于数据库的高可用主节点，则灰化复选框和下拉菜单
                        hamode = [ncTHaSys.Basic];
                        selectedHaMode = ncTHaSys.Basic;
                    }
                } else { // 当前节点不是数据库主从节点
                    if (!haNodes.length) { // 没有高可用节点
                        if (useExternalDb) { // 使用第三方数据库
                            hamode = [ncTHaSys.Basic, ncTHaSys.App, ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.Basic;
                        } else { // 使用本地数据库
                            hamode = [ncTHaSys.App, ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.App;
                        }
                    } else if (haNodes.length === 1) {
                        if (haNodes[0].sys === ncTHaSys.App && haNodes[0].is_master) { // 只有一个高可用主节点（应用），无从节点
                            hamode = [ncTHaSys.App, ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.App;
                        } else if (haNodes[0].sys === ncTHaSys.Storage && haNodes[0].is_master) { // 只有一个高可用主节点（存储），无从节点
                            hamode = [ncTHaSys.App, ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.Storage;
                        } else if (haNodes[0].sys === ncTHaSys.Basic && haNodes[0].is_master) { // 只有一个高可用主节点（全局），无从节点
                            hamode = [ncTHaSys.Basic];
                            selectedHaMode = ncTHaSys.Basic;
                        } else { // 只有一个高可用主节点（数据库），无从节点
                            hamode = [ncTHaSys.App, ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.App;
                        }
                    } else if (haNodes.length === 2) {
                        if (haNodes.some(hanode => hanode.sys === ncTHaSys.App && !hanode.is_master)) { // 存在高可用从节点（应用）
                            hamode = [ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.Storage;
                        } else if (haNodes.some(hanode => hanode.sys === ncTHaSys.Storage && !hanode.is_master)) { // 存在高可用从节点（存储）
                            hamode = [ncTHaSys.App];
                            selectedHaMode = ncTHaSys.App;
                        } else if (haNodes.some(hanode => hanode.sys === ncTHaSys.Database && !hanode.is_master)) { // 存在高可用从节点（数据库）
                            hamode = [ncTHaSys.App, ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.App;
                        } else if (haNodes.some(hanode => hanode.sys === ncTHaSys.Basic && !hanode.is_master)) { // 存在高可用从节点（全局）
                            hamode = [ncTHaSys.Basic];
                            selectedHaMode = ncTHaSys.Basic;
                        } else if (haNodes.some(hanode => hanode.sys === ncTHaSys.App && hanode.is_master) &&
                            haNodes.some(hanode => hanode.sys === ncTHaSys.Storage && hanode.is_master)) { // 存在高可用主节点（应用）和 高可用主节点（存储）
                            hamode = [ncTHaSys.App, ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.Basic;
                        } else if (haNodes.some(hanode => hanode.sys === ncTHaSys.Database && hanode.is_master) &&
                            haNodes.some(hanode => hanode.sys === ncTHaSys.App && hanode.is_master)) { // 存在高可用主节点（数据库）和 高可用主节点（应用）
                            hamode = [ncTHaSys.App, ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.App;
                        } else { // 存在高可用主节点(数据库)和高可用主节点(存储)
                            hamode = [ncTHaSys.App, ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.Storage;
                        }
                    } else if (haNodes.length === 3) {
                        if (useExternalDb) { // 使用第三方数据库
                            if (haNodes.some(hanode => hanode.sys === ncTHaSys.App && !hanode.is_master)) { // 存在高可用从节点（应用）
                                hamode = [ncTHaSys.Storage];
                                selectedHaMode = ncTHaSys.Storage;
                            } else if (haNodes.some(hanode => hanode.sys === ncTHaSys.Storage && !hanode.is_master)) { // 存在高可用从节点(存储)
                                hamode = [ncTHaSys.App];
                                selectedHaMode = ncTHaSys.App;
                            }
                        } else { // 使用本地数据库
                            if (haNodes.some(hanode => hanode.sys === ncTHaSys.App && !hanode.is_master)) { // 存在高可用从节点（应用）
                                if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用主节点(存储)
                                    hamode = [ncTHaSys.Storage, ncTHaSys.Database];
                                    selectedHaMode = ncTHaSys.Storage;
                                } else if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用主节点(数据库)
                                    hamode = [ncTHaSys.Database, ncTHaSys.Storage];
                                    selectedHaMode = ncTHaSys.Database;
                                }
                            } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用从节点(存储)
                                if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用主节点(应用)
                                    hamode = [ncTHaSys.App, ncTHaSys.Database];
                                    selectedHaMode = ncTHaSys.App;
                                } else if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用主节点(数据库)
                                    hamode = [ncTHaSys.Database, ncTHaSys.App];
                                    selectedHaMode = ncTHaSys.Database;
                                }
                            } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用从节点(数据库)
                                if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用主节点(应用)
                                    hamode = [ncTHaSys.App, ncTHaSys.Storage];
                                    selectedHaMode = ncTHaSys.App;
                                } else if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用主节点(存储)
                                    hamode = [ncTHaSys.Storage, ncTHaSys.App];
                                    selectedHaMode = ncTHaSys.Storage;
                                }
                            }
                        }
                    } else if (haNodes.length === 4) {
                        if (useExternalDb) { // 使用第三方数据库
                            // 高可用节点已足够
                            hamode = [ncTHaSys.Basic]
                            selectedHaMode = ncTHaSys.Basic;
                        } else { // 使用本地数据库
                            if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用从节点(应用)
                                if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用从节点(存储)
                                    hamode = [ncTHaSys.Database]
                                    selectedHaMode = ncTHaSys.Database;
                                } else if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用主节点(存储)
                                    hamode = [ncTHaSys.Storage, ncTHaSys.Database]
                                    selectedHaMode = ncTHaSys.Storage;
                                } else { // 不存在高可用主节点(存储)
                                    hamode = [ncTHaSys.Storage];
                                    selectedHaMode = ncTHaSys.Storage;
                                }
                            } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用从节点(存储)
                                if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用从节点(应用)
                                    hamode = [ncTHaSys.Database]
                                    selectedHaMode = ncTHaSys.Database;
                                } else if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用主节点(应用)
                                    hamode = [ncTHaSys.App, ncTHaSys.Database]
                                    selectedHaMode = ncTHaSys.App;
                                } else { // 不存在高可用主节点(应用)
                                    hamode = [ncTHaSys.App]
                                    selectedHaMode = ncTHaSys.App;
                                }
                            } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用从节点(数据库)
                                if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用从节点(应用)
                                    hamode = [ncTHaSys.Storage];
                                    selectedHaMode = ncTHaSys.Storage;
                                } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用从节点(存储)
                                    hamode = [ncTHaSys.App]
                                    selectedHaMode = ncTHaSys.App;
                                } else { // 存在高可用主节点(应用)和高可用主节点(存储)
                                    hamode = [ncTHaSys.App, ncTHaSys.Storage];
                                    selectedHaMode = ncTHaSys.App;
                                }
                            }
                        }                      
                    } else if (haNodes.length === 5) { // 使用本地数据库
                        if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App) &&
                            haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用从节点(应用)和高可用从节点(存储)
                                hamode = [ncTHaSys.Database]
                                selectedHaMode = ncTHaSys.Database;
                        } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App) &&
                            haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用从节点(应用)和高可用从节点(数据库)
                            hamode = [ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.Storage;
                        } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage) &&
                            haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用从节点(存储)和高可用从节点(数据库)
                            hamode = [ncTHaSys.App];
                            selectedHaMode = ncTHaSys.App;
                        }
                    } else { // 存在足够的高可用节点
                        hamode = [ncTHaSys.Basic];
                        selectedHaMode = ncTHaSys.Basic;
                    }
                }
            } else { // 当前节点是高可用节点
                if (rolesConfig.haRole === Roles.MasterBasicHa) { // 当前节点是高可用主节点(全局)
                    selectedHaMode = ncTHaSys.Basic;
                    // 当前节点为高可用主节点(全局) 且 不存在高可用从节点(全局)
                    if (haNodes.length === 1) {
                        // 可选项为：使用第三方数据库 ? 全局、应用、存储 : 全局、数据库
                        hamode = useExternalDb ? [ncTHaSys.Basic, ncTHaSys.App, ncTHaSys.Storage] : [ncTHaSys.Basic, ncTHaSys.Database];
                    } else if (haNodes.length === 2) {
                        // 当前节点为高可用主节点(全局) 且 存在高可用从节点(全局) 则下拉框显示：全局
                        hamode = [ncTHaSys.Basic];
                    }
                } else if (rolesConfig.haRole === Roles.SlaveBasicHa) { // 当前节点为高可用从节点(全局)
                    hamode = [ncTHaSys.Basic];
                    selectedHaMode = ncTHaSys.Basic;
                } else if (rolesConfig.haRole === Roles.MasterDbHa) { // 当前节点是高可用主节点(数据库) 即使用本地数据库 且 当前节点是数据库主节点
                    selectedHaMode = ncTHaSys.Database;
                    // 存在高可用从节点(数据库)，则高可用主节点复选框为选中并灰化状态，下拉框显示：数据库，并灰化
                    if (haNodes.some(node => !node.is_master && node.sys === ncTHaSys.Database)) {
                        hamode = [ncTHaSys.Database];
                    } else { // 不存在高可用从节点(数据库)
                        // 存在高可用主节点(应用) 或 存在高可用主节点(存储)
                        if (haNodes.some(node => node.is_master && (node.sys === ncTHaSys.App || node.sys === ncTHaSys.Storage))) {
                            hamode = [ncTHaSys.Database];
                        } else { // 不存在高可用主节点(应用) 且 不存在高可用主节点(存储)
                            hamode = [ncTHaSys.Basic, ncTHaSys.Database];
                        }
                    }
                }
                // 当前节点为高可用从节点(数据库)
                else if (rolesConfig.haRole === Roles.SlaveDbHa) {
                    selectedHaMode = ncTHaSys.Database;
                    if (haNodes.some(node => node.is_master && (node.sys === ncTHaSys.App)) &&
                        !haNodes.some(node => node.is_master && (node.sys === ncTHaSys.Storage))) {
                        // 存在高可用主节点(应用) 且 不存在高可用主节点(存储)

                        if (haNodes.length === 3) { // 不存在高可用从节点(应用)
                            rolesConfig.dbRole === Roles.SlaveDb ?
                                hamode = [ncTHaSys.Database] // 勾选数据库从节点，则可选项为：数据库
                                :
                                hamode = [ncTHaSys.App, ncTHaSys.Storage] // 不勾选数据库从节点，则可选项为：应用、存储
                        } else if (haNodes.length === 4) { // 存在高可用从节点(应用)
                            rolesConfig.dbRole === Roles.SlaveDb ?
                                hamode = [ncTHaSys.Database] // 勾选数据库从节点，则可选项为：数据库
                                :
                                hamode = [ncTHaSys.Storage] // 不勾选数据库从节点，则可选项为：存储
                        }
                    } else if (!haNodes.some(node => node.is_master && (node.sys === ncTHaSys.App)) &&
                        haNodes.some(node => node.is_master && (node.sys === ncTHaSys.Storage))) {
                        // 存在高可用主节点(存储) 且 不存在高可用主节点(应用)
                        if (haNodes.length === 3) { // 不存在高可用从节点(存储)
                            rolesConfig.dbRole === Roles.SlaveDb ?
                                hamode = [ncTHaSys.Database] // 勾选数据库从节点，则可选项为：数据库
                                :
                                hamode = [ncTHaSys.App, ncTHaSys.Storage] // 不勾选数据库从节点，则可选项为：应用、存储
                        } else if (haNodes.length === 4) { // 存在高可用从节点(存储)
                            rolesConfig.dbRole === Roles.SlaveDb ?
                                hamode = [ncTHaSys.Database] // 勾选数据库从节点，则可选项为：数据库
                                :
                                hamode = [ncTHaSys.App] // 不勾选数据库从节点，则可选项为：应用
                        }
                    } else if (!haNodes.some(node => node.is_master && (node.sys === ncTHaSys.App || node.sys === ncTHaSys.Storage))) {
                        // 不存在高可用主节点(应用) 且 不存在高可用主(存储)                     
                        rolesConfig.dbRole === Roles.SlaveDb ?
                            hamode = [ncTHaSys.Database] // 勾选数据库从节点，则可选项为：数据库
                            :
                            hamode = [ncTHaSys.App, ncTHaSys.Storage, ncTHaSys.Database] // 不勾选数据库从节点，则可选项为：数据库、应用、存储
                    } else { // 存在高可用主节点(应用) 且 存在高可用主(存储)
                        hamode = [ncTHaSys.Database]
                    }
                }
                // 当前节点为高可用主节点(应用)
                else if (rolesConfig.haRole === Roles.MasterAppHa) {
                    selectedHaMode = ncTHaSys.App;
                    if (haNodes.some(node => !node.is_master && node.sys === ncTHaSys.App)) { // 存在高可用从(应用)
                        hamode = [ncTHaSys.App];
                    } else { // 不存在高可用从(应用)
                        if (haNodes.some(node => node.is_master && node.sys === ncTHaSys.Storage)) { // 存在高可用主节点(存储)
                            if (haNodes.some(node => !node.is_master && node.sys === ncTHaSys.Storage)) { // 存在高可用从节点(存储)
                                hamode = [ncTHaSys.App];
                            } else { // 不存在高可用从节点(存储)
                                hamode = [ncTHaSys.App, ncTHaSys.Storage];
                            }
                        } else { // 不存在高可用主节点(存储)      
                            hamode = useExternalDb ? [ncTHaSys.Basic, ncTHaSys.App, ncTHaSys.Storage] : [ncTHaSys.App, ncTHaSys.Storage];
                        }
                    }
                }
                // 当前节点为高可用从节点(应用)
                else if (rolesConfig.haRole === Roles.SlaveAppHa) {
                    selectedHaMode = ncTHaSys.App;
                    if (haNodes.some(node => !node.is_master && node.sys === ncTHaSys.Storage)) { // 存在高可用从节点(存储)
                        hamode = [ncTHaSys.App];
                    } else { // 不存在高可用从节点(存储)
                        hamode = [ncTHaSys.App, ncTHaSys.Storage];
                    }
                }
                // 当前节点为高可用主节点(存储)
                else if (rolesConfig.haRole === Roles.MasterStorHa) {
                    selectedHaMode = ncTHaSys.Storage;
                    // 存在高可用从(存储)
                    if (haNodes.some(node => !node.is_master && node.sys === ncTHaSys.Storage)) {
                        hamode = [ncTHaSys.Storage];
                    } else { // 不存在高可用从(存储)
                        if (haNodes.some(node => node.is_master && node.sys === ncTHaSys.App)) { // 存在高可用主节点(应用)
                            if (haNodes.some(node => !node.is_master && node.sys === ncTHaSys.App)) { // 存在高可用从节点(应用)
                                hamode = [ncTHaSys.Storage];
                            } else { // 不存在高可用从节点(应用)
                                hamode = [ncTHaSys.App, ncTHaSys.Storage];
                            }
                        } else { // 不存在高可用主节点(应用)
                            hamode = useExternalDb ? [ncTHaSys.Basic, ncTHaSys.App, ncTHaSys.Storage] : [ncTHaSys.App, ncTHaSys.Storage];
                        }
                    }
                }
                // 当前节点为高可用从节点(存储)
                else if (rolesConfig.haRole === Roles.SlaveStorHa) {
                    selectedHaMode = ncTHaSys.Storage;
                    if (haNodes.some(node => !node.is_master && node.sys === ncTHaSys.App)) { // 存在高可用从节点(应用)
                        hamode = [ncTHaSys.Storage];
                    } else { // 不存在高可用从节点(应用)
                        hamode = [ncTHaSys.App, ncTHaSys.Storage];
                    }
                }
            }
        } else if (deploymentMode === DeployMode.CloudMode) { // 公有云模式下
            hamode = [ncTHaSys.App];
            selectedHaMode = ncTHaSys.App;
        }

        return [hamode, selectedHaMode];
    }

    /**
     * 设置节点时获取高可用复选框禁用状态
     */
    private getHaCheckDisableStatus(haInfo, deploymentMode) {
        const { haNodes } = this.props.roles;
        const { rolesConfig, useExternalDb } = this.state;

        // 固化模式下
        if (deploymentMode === DeployMode.BasicMode) {
            if (rolesConfig.dbRole === Roles.MasterDb) { // 当前节点是数据库主节点
                if (haInfo.length && haInfo[0].is_master && haNodes.some(hanode => !hanode.is_master)) { // 当前节点是高可用主节点 且 存在高可用从节点
                    return true
                } else {
                    return false
                }
            } else if (rolesConfig.dbRole === Roles.SlaveDb) { // 当前节点是数据库从节点
                if (!haNodes.length) { // 当前站点没有高可用节点
                    return true
                } else {
                    return false
                }
            } else { // 当前节点不是数据库节点
                if (useExternalDb) { // 使用第三方数据库
                    if (!haInfo.length && haNodes.length === 2) { // 当前节点不是高可用节点 且 有足够的高可用节点
                        return true
                    } else {
                        return false
                    }
                } else { // 使用本地数据库
                    return true
                }
            }
        } else if (deploymentMode === DeployMode.ProfessionalMode) { // 灵活模式下
            if (!haInfo.length) { // 当前节点不是高可用节点
                if (rolesConfig.dbRole === Roles.MasterDb) { // 当前节点是数据库主节点
                    return false
                } else if (rolesConfig.dbRole === Roles.SlaveDb) { // 当前节点是数据库从节点
                    // 不存在用于数据库的高可用主节点，则灰化复选框和下拉菜单
                    if (!haNodes.some(node => (node.sys === ncTHaSys.Basic || node.sys === ncTHaSys.Database) && node.is_master)) {
                        return true
                    } else {
                        return false
                    }
                } else { // 当前节点不是数据库主从节点
                    if (useExternalDb) { // 使用第三方数据库
                        if (haNodes.length === 2 && haNodes.some(hanode => hanode.sys === ncTHaSys.Basic) || haNodes.length === 4) { // 有足够的高可用节点
                            return true
                        } else {
                            return false
                        }
                    } else { // 使用本地数据库
                        if (!haNodes.length) {
                            return false
                        } else if (haNodes.some(hanode => hanode.sys === ncTHaSys.Basic)) { // 系统内高可用使用全局模式
                            return true
                        } else { // 系统内高可用使用独立模式
                            if (haNodes.some(node => !node.is_master && node.sys === ncTHaSys.App) && haNodes.some(node => !node.is_master && node.sys === ncTHaSys.Storage)) {
                                return true
                            } else {
                                return false
                            }
                        }
                    }
                }
            } else { // 当前节点是高可用节点
                if (rolesConfig.haRole === Roles.MasterBasicHa) { // 当前节点是高可用主节点(全局)
                    if (haNodes.length === 2) { // 存在高可用从节点(全局), 则高可用主节点复选框为选中并灰化状态
                        return true
                    } else {
                        return false
                    }
                }
                // 当前节点为高可用从节点(全局)
                else if (rolesConfig.haRole === Roles.SlaveBasicHa) {
                    return false
                }
                // 当前节点是高可用主节点(数据库)
                else if (rolesConfig.haRole === Roles.MasterDbHa) {
                    // 存在高可用从节点(数据库)，则高可用主节点复选框为选中并灰化状态
                    if (haNodes.some(node => !node.is_master && node.sys === ncTHaSys.Database)) {
                        return true
                    } else { // 不存在高可用从节点(数据库)
                        return false
                    }
                }
                // 当前节点为高可用从节点(数据库)
                else if (rolesConfig.haRole === Roles.SlaveDbHa) {
                    return false
                }
                // 当前节点为高可用主节点(应用)
                else if (rolesConfig.haRole === Roles.MasterAppHa) {
                    if (haNodes.some(node => !node.is_master && node.sys === ncTHaSys.App)) { // 存在高可用从(应用)
                        return true
                    } else { // 不存在高可用从(应用)
                        return false
                    }
                }
                // 当前节点为高可用从节点(应用)
                else if (rolesConfig.haRole === Roles.SlaveAppHa) {
                    return false
                }
                // 当前节点为高可用主节点(存储)
                else if (rolesConfig.haRole === Roles.MasterStorHa) {
                    // 存在高可用从(存储)
                    if (haNodes.some(node => !node.is_master && node.sys === ncTHaSys.Storage)) {
                        return true
                    } else { // 不存在高可用从(存储)
                        return false
                    }
                }
                // 当前节点为高可用从节点(存储)
                else if (rolesConfig.haRole === Roles.SlaveStorHa) {
                    return false
                }
            }
        } else if (deploymentMode === DeployMode.CloudMode) {
            if (!haInfo.length) { // 当前节点不是高可用节点
                if (haNodes.length === 2) { // 有足够的高可用节点
                    return true
                } else {
                    return false
                }
            } else { // 当前节点是高可用节点
                if (rolesConfig.haRole === Roles.MasterAppHa) { // 当前节点为高可用主节点(应用)
                    if (haNodes.some(node => !node.is_master && node.sys === ncTHaSys.App)) { // 存在高可用从(应用)
                        return true
                    } else { // 不存在高可用从(应用)
                        return false
                    }
                } else if (rolesConfig.haRole === Roles.SlaveAppHa) { // 当前节点为高可用从节点(应用)
                    return false
                }
            }
        }
    }

    /**
     * 改变节点配置信息
     */
    protected handleChange(config = {}) {
        const { validateState, nodeAlias, nodeHost } = this.state;

        this.setState({
            nodeHost: 'host' in config ? config.host : nodeHost,
            nodeAlias: 'nodeAlias' in config ? config.nodeAlias : nodeAlias,
            validateState: {
                ...validateState,
                host: 'host' in config ? ValidateState.Normal : validateState.host,
                alias: 'nodeAlias' in config ? ValidateState.Normal : validateState.alias
            }
        })
    }

    /**
     * 改变vip配置
     */
    protected handleChangeVip(vipInfo = {}) {
        const { deploymentMode } = this.props;
        const { validateState, vipConfig, selectedHaMode, ivip } = this.state;

        this.setState({
            vipConfig: {
                ...vipConfig,
                vip: 'vip' in vipInfo ? vipInfo.vip : vipConfig.vip,
                mask: 'mask' in vipInfo ? vipInfo.mask : vipConfig.mask,
                nic: 'nic' in vipInfo ? vipInfo.nic : vipConfig.nic,
                sys: deploymentMode === DeployMode.BasicMode ? ncTHaSys.Basic : selectedHaMode
            },
            ivip: 'ivip' in vipInfo ? vipInfo.ivip : ivip,
            validateState: {
                ...validateState,
                ip: 'ip' in vipInfo ? ValidateState.Normal : validateState.vip,
                ivip: 'ivip' in vipInfo ? ValidateState.Normal : validateState.ivip,
                mask: 'mask' in vipInfo ? ValidateState.Normal : validateState.mask
            }
        })
    }

    /**
     * 验证配置信息
     */
    protected validateConfig() {
        const { nodeHost, nodeAlias, vipConfig, ivip, validateState, rolesConfig, useExternalDb } = this.state;
        const nodes = this.props.node ? this.props.allNodes.filter(node => node.node_ip !== this.props.node.nodeIp) : this.props.allNodes

        this.setState({
            validateState: {
                ...validateState,
                host: nodeHost ?
                    IP(nodeHost) ?
                        nodes.some(node => (node.node_ip === nodeHost || node.nodeIp === nodeHost)) ?
                            ValidateState.DuplicateHost :
                            ValidateState.Normal :
                        ValidateState.InvalidHost :
                    ValidateState.Normal,
                alias: nodeAlias ?
                    /[\\/:*?"<>|]/.test(nodeAlias) ?
                        ValidateState.InvalidAlias :
                        nodes.some(node => (node.node_alias === nodeAlias || node.nodeAlias === nodeAlias)) ?
                            ValidateState.DuplicateAlias :
                            ValidateState.Normal :
                    ValidateState.Normal,
                vip: this.props.node && (rolesConfig.haRole === Roles.MasterBasicHa ||
                    rolesConfig.haRole === Roles.MasterAppHa ||
                    rolesConfig.haRole === Roles.MasterStorHa ||
                    rolesConfig.haRole === Roles.MasterDbHa) && vipConfig.vip ?
                    IP(vipConfig.vip) ?
                        ValidateState.Normal :
                        ValidateState.InvalidVip :
                    ValidateState.Normal,
                ivip: this.props.node && !useExternalDb && rolesConfig.haRole === Roles.MasterBasicHa && ivip ?
                    IP(ivip) ?
                        ivip === vipConfig.vip ?
                            ValidateState.ReusedIp :
                            ValidateState.Normal :
                        ValidateState.InvalidIvip :
                    ValidateState.Normal,
                mask: this.props.node && (rolesConfig.haRole === Roles.MasterBasicHa ||
                    rolesConfig.haRole === Roles.MasterAppHa ||
                    rolesConfig.haRole === Roles.MasterStorHa ||
                    rolesConfig.haRole === Roles.MasterDbHa) && vipConfig.mask ?
                    subNetMask(vipConfig.mask) ?
                        ValidateState.Normal :
                        ValidateState.InvalidMask :
                    ValidateState.Normal
            }
        }, async () => {
            if (!(values(this.state.validateState).some(state => state !== ValidateState.Normal))) {
                if (this.props.node) {
                    await this.checkBeforeConfirm()
                } else {
                    this.addNode()
                }
            }
        })
    }

    /**
     * 改变高可用子系统模式
     */
    protected changeMode(mode) {
        if (!this.state.disableHaCheckBox && this.state.rolesConfig.haRole) { // 非禁用状态下才切换模式
            const haNodes = this.props.roles.haNodes.filter(hanode => hanode.node_ip !== this.props.node.nodeIp);
            const nodeRoles = this.props.node.nodeRoles;
            const { roles, rolesConfig, vipConfig } = this.state;
            let harole, vip, ivip;

            switch (mode) {
                case ncTHaSys.Basic:
                    if (nodeRoles.haRole === Roles.MasterBasicHa || nodeRoles.haRole === Roles.SlaveBasicHa) {
                        harole = nodeRoles.haRole;
                    } else {
                        if (!haNodes.length) {
                            harole = Roles.MasterBasicHa;
                        } else if (haNodes.length === 1) {
                            harole = Roles.SlaveBasicHa;
                        } else {
                            harole = Roles.MasterBasicHa;
                        }
                    }
                    // 由数据库模式切换为全局模式，数据库vip对应全局ivip，全局vip为空
                    vip = nodeRoles.haRole === Roles.MasterDbHa ? '' : this.nodeOriginalInfo.vipInfo.vip
                    ivip = nodeRoles.haRole === Roles.MasterDbHa ? vipConfig.vip : this.nodeOriginalInfo.ivip
                    break;

                case ncTHaSys.App:
                    if (nodeRoles.haRole === Roles.MasterAppHa || nodeRoles.haRole === Roles.SlaveAppHa) {
                        harole = nodeRoles.haRole;
                    } else {
                        if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.App)) {
                            harole = Roles.SlaveAppHa
                        } else {
                            harole = Roles.MasterAppHa
                        }
                    }
                    break;

                case ncTHaSys.Storage:
                    if (nodeRoles.haRole === Roles.MasterStorHa || nodeRoles.haRole === Roles.SlaveStorHa) {
                        harole = nodeRoles.haRole;
                    } else {
                        if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Storage)) {
                            harole = Roles.SlaveStorHa
                        } else {
                            harole = Roles.MasterStorHa
                        }
                    }
                    break;

                case ncTHaSys.Database:
                    if (nodeRoles.haRole === Roles.MasterDbHa || nodeRoles.haRole === Roles.SlaveDbHa) {
                        harole = nodeRoles.haRole;
                    } else {
                        harole = rolesConfig.dbRole === Roles.MasterDb ? Roles.MasterDbHa : Roles.SlaveDbHa
                    }
                    vip = nodeRoles.haRole === Roles.MasterBasicHa ? this.state.ivip : this.nodeOriginalInfo.vipInfo.vip
            }
            this.setState({
                selectedHaMode: mode,
                roles: {
                    ...roles,
                    ha: harole,
                },
                rolesConfig: {
                    ...rolesConfig,
                    haRole: rolesConfig.haRole ? harole : null
                },
                vipConfig: {
                    ...vipConfig,
                    vip,
                    sys: mode
                },
                ivip
            })
        }
    }

    /**
     * 选择节点角色
     */
    protected handleRoleCheck(checkedStatus = {}) {
        let rolesConfig = { ...this.state.rolesConfig };

        if ('dbChecked' in checkedStatus) {
            this.getRolesWhenCheckDb(checkedStatus);
        } else {
            if ('haChecked' in checkedStatus) {
                rolesConfig.haRole = checkedStatus.haChecked ? this.state.roles.ha : null
            } else if ('appChecked' in checkedStatus) {
                rolesConfig.appRole = checkedStatus.appChecked ? Roles.App : null
                rolesConfig.indexRole = checkedStatus.appChecked ? rolesConfig.indexRole : null
            } else if ('storChecked' in checkedStatus) {
                rolesConfig.storageRole = checkedStatus.storChecked ? Roles.Storage : null
            } else if ('indexChecked' in checkedStatus) {
                rolesConfig.indexRole = checkedStatus.indexChecked ? Roles.Index : null
            }

            this.setState({
                rolesConfig
            })
        }
    }

    /**
     * 勾选/去勾选数据库节点时重新获取可选节点角色
     */
    private getRolesWhenCheckDb(checkedStatus) {
        const { roles, deploymentMode } = this.props;
        let rolesConfig = { ...this.state.rolesConfig };
        let disableHaCheckBox = this.state.disableHaCheckBox;
        let rolesForCheck = { ...this.state.roles };
        let selectedHaMode = this.state.selectedHaMode;
        let haNodes = roles.haNodes.filter(node => node.node_uuid !== this.props.node.nodeUuid);

        rolesConfig.haRole = null; // 重置高可用角色

        if (!checkedStatus.dbChecked) { // 取消勾选数据库节点
            rolesConfig.dbRole = null;
            if (this.state.rolesConfig.dbRole === Roles.MasterDb) { // 取消勾选的是数据库主节点
                rolesForCheck.ha = this.nodeOriginalInfo.rolesInfo.haRole;
                rolesConfig.appRole = null;
                rolesConfig.indexRole = null;
            }
            if (deploymentMode === DeployMode.BasicMode) { // 固化模式下              
                disableHaCheckBox = true;
            } else if (deploymentMode === DeployMode.ProfessionalMode) { // 灵活模式下
                if (this.state.rolesConfig.dbRole === Roles.MasterDb) { // 取消勾选的是数据库主节点(即当前节点本身不是数据库节点)
                    rolesForCheck.ha = this.nodeOriginalInfo.rolesInfo.haRole ? this.nodeOriginalInfo.rolesInfo.haRole : this.nodeOriginalInfo.ha;
                    rolesForCheck.haMode = this.nodeOriginalInfo.haMode;
                    selectedHaMode = this.nodeOriginalInfo.selectedHaMode;
                    disableHaCheckBox = this.nodeOriginalInfo.disableHaCheckBox;
                } else { // 取消勾选的是数据库从节点
                    if (!haNodes.length) { // 站点内没有高可用节点
                        rolesForCheck.ha = Roles.MasterAppHa;
                        rolesForCheck.haMode = [ncTHaSys.App, ncTHaSys.Storage];
                        selectedHaMode = ncTHaSys.App;
                        disableHaCheckBox = false;
                    } else if (haNodes.length === 1) {
                        if (haNodes[0].sys === ncTHaSys.Basic) { // 只有高可用主节点(全局)
                            rolesForCheck.ha = Roles.SlaveBasicHa;
                            rolesForCheck.haMode = [ncTHaSys.Basic];
                            selectedHaMode = ncTHaSys.Basic;
                            disableHaCheckBox = true;
                        } else if (haNodes[0].sys === ncTHaSys.App) { // 只有高可用主节点(应用)
                            rolesForCheck.ha = Roles.SlaveAppHa;
                            rolesForCheck.haMode = [ncTHaSys.App, ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.App;
                            disableHaCheckBox = false;
                        } else if (haNodes[0].sys === ncTHaSys.Storage) { // 只有高可用主节点(存储)
                            rolesForCheck.ha = Roles.SlaveStorHa;
                            rolesForCheck.haMode = [ncTHaSys.App, ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.Storage;
                            disableHaCheckBox = false;
                        } else { // 只有高可用主节点(数据库)
                            rolesForCheck.ha = Roles.MasterAppHa;
                            rolesForCheck.haMode = [ncTHaSys.App, ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.App;
                            disableHaCheckBox = false;
                        }
                    } else if (haNodes.length === 2) {
                        if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Basic)) { // 存在高可用从节点(全局)
                            rolesForCheck.ha = Roles.MasterBasicHa;
                            rolesForCheck.haMode = [ncTHaSys.Basic];
                            selectedHaMode = ncTHaSys.Basic;
                            disableHaCheckBox = true;
                        } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用从节点(应用)
                            rolesForCheck.ha = Roles.MasterStorHa;
                            rolesForCheck.haMode = [ncTHaSys.Storage];
                            selectedHaMode = ncTHaSys.Storage;
                            disableHaCheckBox = false;
                        } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用从节点(存储)
                            rolesForCheck.ha = Roles.MasterAppHa;
                            rolesForCheck.haMode = [ncTHaSys.App];
                            selectedHaMode = ncTHaSys.App;
                            disableHaCheckBox = false;
                        } else if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用主节点(数据库)
                            if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用主节点(应用)
                                rolesForCheck.ha = Roles.SlaveAppHa;
                                rolesForCheck.haMode = [ncTHaSys.App, ncTHaSys.Storage];
                                selectedHaMode = ncTHaSys.App;
                                disableHaCheckBox = false;
                            } else if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用主节点(存储)
                                rolesForCheck.ha = Roles.SlaveStorHa;
                                rolesForCheck.haMode = [ncTHaSys.App, ncTHaSys.Storage];
                                selectedHaMode = ncTHaSys.Storage;
                                disableHaCheckBox = false;
                            }
                        }
                    } else if (haNodes.length === 3) {
                        if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用主节点(数据库)
                            if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用从节点(应用)
                                rolesForCheck.ha = Roles.MasterStorHa;
                                rolesForCheck.haMode = [ncTHaSys.Storage];
                                selectedHaMode = ncTHaSys.Storage;
                            } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) { // 存在高可用从节点(存储)
                                rolesForCheck.ha = Roles.MasterAppHa;
                                rolesForCheck.haMode = [ncTHaSys.App];
                                selectedHaMode = ncTHaSys.App;
                            } else { // 存在高可用主节点(应用)和高可用主节点(存储) 
                                rolesForCheck.ha = Roles.SlaveAppHa;
                                rolesForCheck.haMode = [ncTHaSys.App];
                                selectedHaMode = ncTHaSys.App;
                            }
                        } else { // 不存在高可用主节点(数据库)
                            if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用从节点(应用)
                                rolesForCheck.ha = Roles.SlaveStorHa;
                                rolesForCheck.haMode = [ncTHaSys.Storage];
                                selectedHaMode = ncTHaSys.Storage;
                            } else { // 存在高可用从节点(存储)
                                rolesForCheck.ha = Roles.SlaveAppHa;
                                rolesForCheck.haMode = [ncTHaSys.App];
                                selectedHaMode = ncTHaSys.App;
                            }
                        }
                        disableHaCheckBox = false;
                    } else if (haNodes.length === 4) {
                        if (haNodes.some(hanode => hanode.is_master && hanode.sys === ncTHaSys.Database)) { // 存在高可用主节点(数据库)
                            if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.App)) { // 存在高可用从节点(应用)
                                rolesForCheck.ha = Roles.SlaveStorHa;
                                rolesForCheck.haMode = [ncTHaSys.Storage];
                                selectedHaMode = ncTHaSys.Storage;
                            } else if (haNodes.some(hanode => !hanode.is_master && hanode.sys === ncTHaSys.Storage)) {
                                rolesForCheck.ha = Roles.SlaveAppHa;
                                rolesForCheck.haMode = [ncTHaSys.App];
                                selectedHaMode = ncTHaSys.App;
                            }
                            disableHaCheckBox = false;
                        } else {
                            rolesForCheck.ha = Roles.MasterBasicHa;
                            rolesForCheck.haMode = [ncTHaSys.Basic];
                            selectedHaMode = ncTHaSys.Basic;
                            disableHaCheckBox = true;
                        }
                    } else { // 有足够的高可用节点
                        rolesForCheck.ha = Roles.MasterBasicHa;
                        rolesForCheck.haMode = [ncTHaSys.Basic];
                        selectedHaMode = ncTHaSys.Basic;
                        disableHaCheckBox = true;
                    }
                }
            }
        }

        else { // 勾选了数据库节点
            rolesConfig.dbRole = this.state.roles.db;

            if (rolesConfig.dbRole === Roles.MasterDb) { // 勾选的是数据库主节点
                if (haNodes.some(hanode => hanode.is_master && (hanode.sys === ncTHaSys.App || hanode.sys === ncTHaSys.Storage))) {
                    // 存在高可用主节点(应用)或高可用主节点(存储)
                    rolesForCheck.haMode = [ncTHaSys.Database];
                    selectedHaMode = ncTHaSys.Database;
                    rolesForCheck.ha = Roles.MasterDbHa;
                } else {
                    rolesForCheck.haMode = [ncTHaSys.Basic, ncTHaSys.Database];
                    selectedHaMode = ncTHaSys.Basic;
                    rolesForCheck.ha = Roles.MasterBasicHa;
                }
            } else { // 勾选的是数据库从节点
                if (deploymentMode === DeployMode.BasicMode) { // 固化模式下
                    rolesForCheck.ha = Roles.SlaveBasicHa;
                    disableHaCheckBox = haNodes.length ? false : true // 站点内没有高可用节点时禁用高可用选项
                } else if (deploymentMode === DeployMode.ProfessionalMode) { // 灵活模式下
                    if (this.nodeOriginalInfo.rolesInfo.dbRole) { // 当前节点本身是数据库节点
                        rolesForCheck.ha = this.nodeOriginalInfo.ha;
                        rolesForCheck.haMode = this.nodeOriginalInfo.haMode;
                        selectedHaMode = this.nodeOriginalInfo.selectedHaMode;
                        disableHaCheckBox = this.nodeOriginalInfo.disableHaCheckBox;
                    } else { // 当前节点本身不是数据库节点
                        if (!haNodes.length) { // 站点内没有高可用节点
                            rolesForCheck.ha = Roles.SlaveBasicHa;
                            rolesForCheck.haMode = [ncTHaSys.Basic];
                            selectedHaMode = ncTHaSys.Basic;
                            disableHaCheckBox = true;
                        } else {
                            if (haNodes.some(hanode => hanode.is_master && (hanode.sys === ncTHaSys.Basic))) { // 存在高可用主节点(全局)
                                rolesForCheck.ha = Roles.SlaveBasicHa;
                                rolesForCheck.haMode = [ncTHaSys.Basic];
                                selectedHaMode = ncTHaSys.Basic;
                                disableHaCheckBox = false;
                            } else if (haNodes.some(hanode => hanode.is_master && (hanode.sys === ncTHaSys.Database))) { // 存在高可用主节点(数据库)
                                rolesForCheck.ha = Roles.SlaveDbHa;
                                rolesForCheck.haMode = [ncTHaSys.Database];
                                selectedHaMode = ncTHaSys.Database;
                                disableHaCheckBox = false;
                            } else { // 不存在高可用主节点(全局/数据库)
                                rolesForCheck.ha = Roles.SlaveBasicHa;
                                rolesForCheck.haMode = [ncTHaSys.Basic];
                                selectedHaMode = ncTHaSys.Basic;
                                disableHaCheckBox = true;
                            }
                        }
                    }
                }
            }
        }

        this.setState({
            rolesConfig,
            roles: rolesForCheck,
            disableHaCheckBox,
            selectedHaMode
        })
    }

    /**
     * 确认设置节点信息前检查是否取消勾选相应角色/新设置数据库从节点
     */
    private checkBeforeConfirm() {
        const { deploymentMode } = this.props;
        const { rolesConfig, warningOperation } = this.state;

        if (this.nodeOriginalInfo.rolesInfo) {
            this.setState({
                warningOperation: {
                    ...warningOperation,
                    cancelHaMaster: (this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterBasicHa ||
                        this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterAppHa ||
                        this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterStorHa ||
                        this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterDbHa) && !rolesConfig.haRole,
                    cancelHaSlave: (this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveBasicHa ||
                        this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveAppHa ||
                        this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveStorHa ||
                        this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveDbHa) && !rolesConfig.haRole,
                    cancelDbSlave: this.nodeOriginalInfo.rolesInfo.dbRole === Roles.SlaveDb && !rolesConfig.dbRole,
                    cancelIndex: this.nodeOriginalInfo.rolesInfo.indexRole === Roles.Index && !rolesConfig.indexRole,
                    setHaMaster: deploymentMode === DeployMode.BasicMode && !rolesConfig.ecmsRole && rolesConfig.haRole === Roles.MasterBasicHa,
                    setHaMasterBasic: deploymentMode === DeployMode.ProfessionalMode && !rolesConfig.ecmsRole && rolesConfig.haRole === Roles.MasterBasicHa,
                    setHaMasterApp: (deploymentMode === DeployMode.ProfessionalMode || deploymentMode === DeployMode.CloudMode) && !rolesConfig.ecmsRole && rolesConfig.haRole === Roles.MasterAppHa
                }
            }, () => {
                if (!values(this.state.warningOperation).some(op => op === true)) {
                    this.setNode();
                }
            })
        }
    }

    /**
     * 响应卸载索引节点是否删除索引目录选项变化
     */
    protected handleDeleteIndexByUninstallChange(checked) {
        this.deleteIndexByUninstall = checked;
    }

    /**
     * 固化模式下默认添加存储节点的前提条件判断
     */
    private buildConditionsOfAddStor() {
        // 配置了本地SWIFT存储，则添加存储节点；配置了本地Ceph存储或者第三方存储，则不添加存储节点
        return this.state.thirdPartyOSS === '' ? true : false
    }

    /**
     * 固化模式下默认添加数据库从节点的前提条件判断
     */
    private buildConditionsOfAddDbSlave() {
        const { haNodes, dbNodes } = this.props.roles;

        if (this.state.useExternalDb) { // 使用第三方数据库
            return false
        } else { // 使用本地数据库
            if (!dbNodes.length) { // 无数据库主节点
                return false
            } else if (dbNodes.length === 1) { // 无数据库从节点
                // 有高可用从节点时不添加数据库从节点，否则添加数据库从节点
                return haNodes.length === 2 ? false : true
            } else if (dbNodes.length === 2) { // 有数据库从节点时，不再添加数据库从节点
                return false
            }
        }
    }

    /**
     * 固化模式下使用第三方数据库添加高可用从节点(全局)的前提条件判断
     */
    private buildConditionsOfAddHaSlave() {
        const { haNodes } = this.props.roles;

        if (this.state.useExternalDb) { // 使用第三方数据库
            if (!haNodes.length || haNodes.length === 2) { // 当前站点中无高可用主节点 或 有高可用从节点
                return false
            } else if (haNodes.length === 1) { // 无高可用从节点
                return true
            }
        } else { // 使用本地数据库
            return false
        }
    }

    /**
     * 固化模式下使用本地数据库添加高可用从节点(全局)的前提条件判断
     */
    private buildConditionsOfAddHaSlaveWithInteralDb() {
        const { haNodes, dbNodes } = this.props.roles;

        if (this.state.useExternalDb) { // 使用第三方数据库
            return false
        } else { // 使用本地数据库
            if (!haNodes.length) { // 当前站点中无高可用主节点
                return false
            } else if (haNodes.length === 1) { // 无高可用从节点
                if (!dbNodes.length || dbNodes.length === 1) { // 无数据库主节点 或 有数据库主节点但无数据库从节点
                    return true
                } else { // 有数据库从节点
                    return false
                }
            } else { // 有高可用从节点
                return false
            }
        }
    }

    /**
     * 添加节点(固化/灵活模式/公有云模式)
     */
    async addNode() {
        const { nodeHost } = this.state;

        let requestQueue = [],
            results = {
                // 执行成功的请求 
                success: [],
                // 某个失败的请求
                failed: [],
                // 剩余未执行的请求
                notCompleted: []
            },
            currentIndex = 0;

        this.setState({
            operationStatus: OperationStatus.Running
        })

        requestQueue.push([() => ECMSManagerClient.add_node(nodeHost), 'addNode'])

        if (this.props.deploymentMode === DeployMode.BasicMode) { // 固化模式下执行配置默认角色
            const actionSets = [
                [
                    [(nodeUuid) => ECMSManagerClient.set_db_slave(nodeUuid), 'setDbSlave'],
                    this.buildConditionsOfAddDbSlave()
                ],
                [
                    [(nodeUuid) => new Promise(async (resolve, reject) => {
                        try {
                            await ECMSManagerClient.set_ha_slave(nodeUuid, ncTHaSys.Basic)
                            await ECMSManagerClient.set_db_ha_slave()
                            resolve({})
                        } catch (ex) {
                            reject(ex)
                        }
                    }), 'setHaSlave'],
                    this.buildConditionsOfAddHaSlaveWithInteralDb()
                ],
                [
                    [(nodeUuid) => ECMSManagerClient.set_ha_slave(nodeUuid, ncTHaSys.Basic), 'setHaSlave'],
                    this.buildConditionsOfAddHaSlave()
                ],
                [
                    [(nodeUuid) => ECMSManagerClient.add_application_node(nodeUuid), 'addApplicationNode'],
                    true
                ],
                [
                    [(nodeUuid) => ECMSManagerClient.add_storage_node(nodeUuid), 'addStorageNode'],
                    this.buildConditionsOfAddStor()
                ]
            ];

            for (let [action, condition] of actionSets) {
                // 将符合条件的操作添加到请求队列中
                if (condition) {
                    requestQueue.push(action)
                }
            }
        } else if (this.props.deploymentMode === DeployMode.CloudMode) { // 公有云模式下执行配置应用角色
            requestQueue.push([(nodeUuid) => ECMSManagerClient.add_application_node(nodeUuid), 'addApplicationNode'])
        }

        for (let [request, progress] of requestQueue) {
            await new Promise((resolve) => {
                this.setState({
                    requestInProgress: progress
                }, resolve)
            })
            try {
                if (currentIndex === 0) { // 执行第一个请求add_node
                    results = {
                        ...results,
                        success: [...results.success, [await request(), progress]]
                    }
                } else {
                    const [[nodeUuid, ]] = results.success
                    results = {
                        ...results,
                        success: [...results.success, [await request(nodeUuid), progress]]
                    }
                }
            } catch (ex) {
                if (ex.errID === EcmsmanagerErrcode.NodeNumOverFlow) {
                    manageLog({
                        level: ncTLogLevel['NCT_LL_WARN'],
                        opType: ncTManagementType['NCT_MNT_SET'],
                        msg: __('添加节点“${nodeIp}” 失败', { nodeIp: nodeHost }),
                        exMsg: __('添加的节点数已达节点授权总数上限')
                    })
                }
                results = {
                    ...results,
                    failed: [{
                        errID: ex.errID ? ex.errID : -1,
                        errorRequest: progress,
                        errorMsg: ex.expMsg,
                        host: this.state.nodeHost
                    }]
                }
                if (currentIndex < requestQueue.length - 1) { // 还有未执行的请求
                    requestQueue.slice(currentIndex + 1).forEach(([, progress]) => {
                        results = {
                            ...results,
                            notCompleted: [
                                ...results.notCompleted,
                                progress
                            ]
                        }
                    })
                }

                break;
            } finally {
                currentIndex = currentIndex + 1
            }
        }

        if (requestQueue.length) {
            if (!results.failed.length) { // 本次设置全部成功
                // 对该节点环境进行一致性检测，保证操作完成后获取最新的节点一致性状态                       
                createECMSManagerClient({ ip: nodeHost }).consistency_check();
            }
            // 记录添加节点日志
            if (results.success.length) {
                manageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_ADD'],
                    msg: __('添加节点“${nodeIp}” 成功', { nodeIp: nodeHost }),
                    exMsg: __('节点名称：${alias}，节点角色：${roles}', {
                        alias: this.state.nodeAlias ? this.state.nodeAlias : '---',
                        roles: reduce(results.success, (pre, [, progress]) => `${pre}${pre ? ',' : ''}${getDefaultRolesInBasicDeployment(progress) || ''}`, '') || '---',
                    })
                })
            }
            this.props.onNodeConfigConfirm(Operation.AddNode, results);
        } else {
            this.props.onNodeConfigConfirm(Operation.NoOperation);
        }
    }

    /**
     * 设置节点(固化/灵活模式/公有云模式)
     */
    protected async setNode() {
        const { deploymentMode } = this.props;
        const { nodeHost, rolesConfig, selectedHaMode, vipConfig, ivip, nodeAlias, useExternalDb } = this.state;
        const nodeUuid = this.props.node.nodeUuid;
        let requestQueue = [],
            results = {
                // 执行成功的请求
                success: [],
                // 某个失败的请求
                failed: [],
                // 剩余未执行的请求
                notCompleted: [],
                // 是否需要重新登录
                needRedirectToIndex: false
            },
            currentIndex = 0,
            ecmsIp = this.props.allNodes.find(node => node.role_ecms === 1).node_ip;

        this.setState({
            operationStatus: OperationStatus.Running
        })

        if (rolesConfig.dbRole) {
            if (this.nodeOriginalInfo.rolesInfo.dbRole !== rolesConfig.dbRole) {
                if (deploymentMode === DeployMode.ProfessionalMode && !rolesConfig.haRole) {
                    // 设置数据库的同时仅取消原有高可用(应用/存储)角色
                    if (this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterAppHa ||
                        this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveAppHa ||
                        this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterStorHa ||
                        this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveStorHa) {
                        requestQueue.push([() => createECMSManagerClient({ ip: ecmsIp }).cancel_ha_node(nodeUuid), 'cancelHaNode'])
                    }

                    requestQueue.push([
                        rolesConfig.dbRole === Roles.MasterDb ?
                            () => createECMSManagerClient({ ip: ecmsIp }).set_db_master(nodeUuid) :
                            () => createECMSManagerClient({ ip: ecmsIp }).set_db_slave(nodeUuid),
                        rolesConfig.dbRole === Roles.MasterDb ? 'setDbMaster' : 'setDbSlave'
                    ])
                } else {
                    requestQueue.push([
                        () => new Promise(async (resolve, reject) => {
                            try {
                                deploymentMode === DeployMode.ProfessionalMode && rolesConfig.haRole && (
                                    this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterAppHa ||
                                    this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveAppHa ||
                                    this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterStorHa ||
                                    this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveStorHa
                                ) ? // 该节点本身是高可用(应用/存储)，先取消高可用才能设置数据库节点
                                    await createECMSManagerClient({ ip: ecmsIp }).cancel_ha_node(nodeUuid) : null

                                rolesConfig.dbRole === Roles.MasterDb ?
                                    await createECMSManagerClient({ ip: ecmsIp }).set_db_master(nodeUuid) :
                                    await createECMSManagerClient({ ip: ecmsIp }).set_db_slave(nodeUuid)
                                resolve({})
                            } catch (ex) {
                                reject(ex)
                            }
                        }),
                        rolesConfig.dbRole === Roles.MasterDb ? 'setDbMaster' : 'setDbSlave'
                    ])
                }
            }
        } else {
            // 修改节点时取消了数据库角色
            if (this.nodeOriginalInfo.rolesInfo.dbRole) {
                // 也取消了高可用节点
                if (deploymentMode === DeployMode.ProfessionalMode && !rolesConfig.haRole) {
                    requestQueue.push([() => new Promise(async (resolve, reject) => {
                        try {
                            (!useExternalDb && this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveBasicHa || this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveDbHa) ?
                                await createECMSManagerClient({ ip: ecmsIp }).cancel_db_ha_node(nodeUuid) : null
                            this.nodeOriginalInfo.rolesInfo.haRole && this.nodeOriginalInfo.rolesInfo.haRole !== Roles.SlaveDbHa ?
                                await createECMSManagerClient({ ip: ecmsIp }).cancel_ha_node(nodeUuid) : null
                            resolve({})
                        } catch (ex) {
                            reject(ex)
                        }
                    }), 'cancelHaNode'])

                    requestQueue.push([() => createECMSManagerClient({ ip: ecmsIp }).cancel_db_node(nodeUuid), 'cancelDbNode'])
                } else {
                    requestQueue.push([() => new Promise(async (resolve, reject) => {
                        try {
                            deploymentMode === DeployMode.ProfessionalMode &&
                                rolesConfig.haRole && (
                                    this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterBasicHa ||
                                    this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveBasicHa ||
                                    this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterDbHa ||
                                    this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveDbHa
                                ) ? // 灵活模式下因取消数据库角色导致高可用所属子系统发生改变，则先取消原有的高可用角色
                                await createECMSManagerClient({ ip: ecmsIp }).cancel_db_ha_node(nodeUuid) : null
                            deploymentMode === DeployMode.ProfessionalMode && rolesConfig.haRole && (
                                this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterBasicHa ||
                                this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveBasicHa
                            ) ?
                                await createECMSManagerClient({ ip: ecmsIp }).cancel_ha_node(nodeUuid) : null
                            await createECMSManagerClient({ ip: ecmsIp }).cancel_db_node(nodeUuid)
                            resolve({})
                        } catch (ex) {
                            reject(ex)
                        }
                    }), 'cancelDbNode'])
                }
            }
        }

        if (this.nodeOriginalInfo.aliasInfo !== nodeAlias) {
            requestQueue.push([() => createECMSManagerClient({ ip: ecmsIp }).set_node_alias(nodeUuid, nodeAlias), 'setNodeAlias'])
        }

        if (rolesConfig.haRole) {
            if (rolesConfig.haRole === Roles.MasterBasicHa ||
                rolesConfig.haRole === Roles.MasterAppHa ||
                rolesConfig.haRole === Roles.MasterStorHa ||
                rolesConfig.haRole === Roles.MasterDbHa
            ) { // 设置高可用主节点
                if (this.nodeOriginalInfo.rolesInfo.haRole) { // 节点本身是高可用节点
                    if (deploymentMode === DeployMode.BasicMode || deploymentMode === DeployMode.ProfessionalMode || deploymentMode === DeployMode.CloudMode && this.nodeOriginalInfo.vipInfo.sys === selectedHaMode) { // 固化模式 或 灵活模式下高可用节点所属子系统不变
                        if (!isEqual(omit(this.nodeOriginalInfo.vipInfo, 'sys'), omit(vipConfig, 'sys')) || this.nodeOriginalInfo.ivip !== ivip) { // 仅修改了高可用vip信息
                            if (rolesConfig.haRole === Roles.MasterBasicHa) {
                                requestQueue.push([() => new Promise(async (resolve, reject) => {
                                    try {
                                        await createECMSManagerClient({ ip: ecmsIp }).set_vip_info(new ncTVipInfo(vipConfig));
                                        this.nodeOriginalInfo.ivip === '' ?
                                            await createECMSManagerClient({ ip: ecmsIp }).set_db_ha_master(new ncTVipInfo({
                                                vip: ivip,
                                                mask: vipConfig.mask,
                                                nic: vipConfig.nic,
                                                sys: ncTHaSys.Database
                                            }))
                                            :
                                            await createECMSManagerClient({ ip: ecmsIp }).set_ivip_info(new ncTVipInfo({
                                                vip: ivip,
                                                mask: vipConfig.mask,
                                                nic: vipConfig.nic,
                                                sys: ncTHaSys.Database
                                            }));

                                        resolve({})
                                    } catch (ex) {
                                        reject(ex)
                                    }
                                }), 'setHaMaster']);
                            } else if (rolesConfig.haRole === Roles.MasterDbHa) {
                                requestQueue.push(
                                    [() => createECMSManagerClient({ ip: ecmsIp }).set_ivip_info(new ncTVipInfo(vipConfig)), 'setHaMaster']
                                );
                            } else {
                                requestQueue.push([() => createECMSManagerClient({ ip: ecmsIp }).set_vip_info(new ncTVipInfo(vipConfig)), 'setHaMaster']);
                            }
                        }
                    } else { // 高可用节点所属子系统改变,需要先删除原有的高可用节点再添加
                        requestQueue.push([() => new Promise(async (resolve, reject) => {
                            try {
                                this.nodeOriginalInfo.rolesInfo.dbRole === rolesConfig.dbRole && // 前提条件：高可用节点所属子系统改变不是由取消/勾选数据库角色导致的
                                    (!useExternalDb && this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterBasicHa || this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterDbHa) ?
                                    await createECMSManagerClient({ ip: ecmsIp }).cancel_db_ha_node(nodeUuid) : null
                                this.nodeOriginalInfo.rolesInfo.dbRole === rolesConfig.dbRole && this.nodeOriginalInfo.rolesInfo.haRole !== Roles.MasterDbHa ?
                                    await createECMSManagerClient({ ip: ecmsIp }).cancel_ha_node(nodeUuid) : null
                                rolesConfig.haRole !== Roles.MasterDbHa ?
                                    await createECMSManagerClient({ ip: ecmsIp }).set_ha_master(nodeUuid, new ncTVipInfo(vipConfig)) : null
                                !useExternalDb && rolesConfig.haRole === Roles.MasterBasicHa || rolesConfig.haRole === Roles.MasterDbHa ?
                                    await createECMSManagerClient({ ip: ecmsIp }).set_db_ha_master(new ncTVipInfo({
                                        vip: rolesConfig.haRole === Roles.MasterDbHa ? vipConfig.vip : ivip,
                                        mask: vipConfig.mask,
                                        nic: vipConfig.nic,
                                        sys: ncTHaSys.Database
                                    })) : null
                                resolve({})
                            } catch (ex) {
                                reject(ex)
                            }
                        }), 'setHaMaster'])
                    }
                } else { // 节点本身不是高可用节点
                    if (!useExternalDb && rolesConfig.haRole === Roles.MasterBasicHa) { // 使用本地数据库 且 设置高可用主节点（全局）
                        requestQueue.push([() => new Promise(async (resolve, reject) => {
                            try {
                                await createECMSManagerClient({ ip: ecmsIp }).set_ha_master(nodeUuid, new ncTVipInfo(vipConfig))
                                await createECMSManagerClient({ ip: ecmsIp }).set_db_ha_master(new ncTVipInfo({
                                    vip: ivip,
                                    mask: vipConfig.mask,
                                    nic: vipConfig.nic,
                                    sys: ncTHaSys.Database
                                }))
                                resolve({})
                            } catch (ex) {
                                reject(ex)
                            }
                        }), 'setHaMaster'])
                    } else if (rolesConfig.haRole === Roles.MasterDbHa) { // 设置高可用主节点(数据库)
                        requestQueue.push([() => createECMSManagerClient({ ip: ecmsIp }).set_db_ha_master(new ncTVipInfo(vipConfig)), 'setHaMaster'])
                    } else {
                        requestQueue.push([() => createECMSManagerClient({ ip: ecmsIp }).set_ha_master(nodeUuid, new ncTVipInfo(vipConfig)), 'setHaMaster'])
                    }
                }
            } else { // 设置高可用从节点
                if (this.nodeOriginalInfo.rolesInfo.haRole !== rolesConfig.haRole) { // 高可用角色发生改变
                    requestQueue.push([() => new Promise(async (resolve, reject) => {
                        try {
                            this.nodeOriginalInfo.rolesInfo.dbRole === rolesConfig.dbRole &&
                                (!useExternalDb && this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveBasicHa || this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveDbHa) ?
                                await createECMSManagerClient({ ip: ecmsIp }).cancel_db_ha_node(nodeUuid) : null
                            this.nodeOriginalInfo.rolesInfo.dbRole === rolesConfig.dbRole && this.nodeOriginalInfo.rolesInfo.haRole && this.nodeOriginalInfo.rolesInfo.haRole !== Roles.SlaveDbHa ?
                                await createECMSManagerClient({ ip: ecmsIp }).cancel_ha_node(nodeUuid) : null
                            rolesConfig.haRole !== Roles.SlaveDbHa ?
                                await createECMSManagerClient({ ip: ecmsIp }).set_ha_slave(nodeUuid, deploymentMode === DeployMode.BasicMode ? ncTHaSys.Basic : selectedHaMode) : null
                            !useExternalDb && rolesConfig.haRole === Roles.SlaveBasicHa || rolesConfig.haRole === Roles.SlaveDbHa ?
                                await createECMSManagerClient({ ip: ecmsIp }).set_db_ha_slave() : null
                            resolve({})
                        } catch (ex) {
                            reject(ex)
                        }
                    }), 'setHaSlave'])
                }
            }
        } else { // 修改节点时取消了高可用角色   
            if (this.nodeOriginalInfo.rolesInfo.haRole &&
                (
                    deploymentMode === DeployMode.ProfessionalMode && this.nodeOriginalInfo.rolesInfo.dbRole === rolesConfig.dbRole ||
                    deploymentMode === DeployMode.BasicMode ||
                    deploymentMode === DeployMode.CloudMode
                )) {
                if (!useExternalDb && this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterBasicHa) { // 原有的高可用角色是高可用主节点（全局）
                    requestQueue.push([() => new Promise(async (resolve, reject) => {
                        try {
                            await createECMSManagerClient({ ip: ecmsIp }).cancel_db_ha_node(nodeUuid)
                            await createECMSManagerClient({ ip: ecmsIp }).cancel_ha_node(nodeUuid)
                            resolve({})
                        } catch (ex) {
                            reject(ex)
                        }
                    }), 'cancelHaNode'])
                } else if (this.nodeOriginalInfo.rolesInfo.haRole === Roles.MasterDbHa || this.nodeOriginalInfo.rolesInfo.haRole === Roles.SlaveDbHa) {
                    requestQueue.push([() => createECMSManagerClient({ ip: ecmsIp }).cancel_db_ha_node(nodeUuid), 'cancelHaNode'])
                } else {
                    requestQueue.push([() => createECMSManagerClient({ ip: ecmsIp }).cancel_ha_node(nodeUuid), 'cancelHaNode'])
                }
            }
        }

        if (!rolesConfig.indexRole && this.nodeOriginalInfo.rolesInfo.indexRole) { // 修改节点时取消了文档索引角色，先删除索引节点后删除应用节点
            requestQueue.push([() => createESearchMgntClient({ ip: nodeHost }).Uninstall(this.deleteIndexByUninstall), 'delSingleApplicationNode'])
        }

        if (rolesConfig.appRole) {
            if (this.nodeOriginalInfo.rolesInfo.appRole !== rolesConfig.appRole) {
                requestQueue.push([() => createECMSManagerClient({ ip: ecmsIp }).add_application_node(nodeUuid), 'addApplicationNode'])
            }
        } else {
            // 修改节点时取消了应用角色
            if (this.nodeOriginalInfo.rolesInfo.appRole) {
                requestQueue.push([() => createECMSManagerClient({ ip: ecmsIp }).del_application_node(nodeUuid), 'delApplicationNode'])
            }
        }

        if (rolesConfig.storageRole) {
            if (this.nodeOriginalInfo.rolesInfo.storageRole !== rolesConfig.storageRole) {
                requestQueue.push([() => createECMSManagerClient({ ip: ecmsIp }).add_storage_node(nodeUuid), 'addStorageNode'])
            }
        } else {
            // 修改节点时取消了存储角色
            if (this.nodeOriginalInfo.rolesInfo.storageRole) {
                requestQueue.push([() => createECMSManagerClient({ ip: ecmsIp }).del_storage_node(nodeUuid), 'delStorageNode'])
            }
        }

        if (rolesConfig.indexRole && !this.nodeOriginalInfo.rolesInfo.indexRole) { // 添加索引节点
            requestQueue.push([() => createESearchMgntClient({ ip: nodeHost }).Setup(), 'addSingleApplicationNode'])
        }

        for (let [request, progress] of requestQueue) {
            await new Promise((resolve) => {
                this.setState({
                    requestInProgress: progress
                }, resolve)
            })
            try {
                results = {
                    ...results,
                    success: [...results.success, [await request(), progress]]
                }
                // 如果在非集群管理节点上设置了高可用主节点(全局/应用),需要更改集群服务接口ip为该节点
                if (progress === 'setHaMaster' &&
                    (rolesConfig.haRole === Roles.MasterBasicHa || rolesConfig.haRole === Roles.MasterAppHa) && nodeHost !== ecmsIp) {
                    ecmsIp = nodeHost;
                    results = {
                        ...results,
                        needRedirectToIndex: true
                    }
                }
            } catch (ex) {
                results = {
                    ...results,
                    failed: [{
                        errID: ex.errID ? ex.errID : -1,
                        errorRequest: progress,
                        errorMsg: ex.expMsg
                    }]
                }
                if (currentIndex < requestQueue.length - 1) { // 还有未执行的请求
                    requestQueue.slice(currentIndex + 1).forEach(([, progress]) => {
                        results = {
                            ...results,
                            notCompleted: [
                                ...results.notCompleted,
                                progress
                            ]
                        }
                    })
                }

                break;
            } finally {
                currentIndex = currentIndex + 1
            }
        }

        if (requestQueue.length) {
            if (!results.failed.length) { // 本次设置全部成功
                // 对该节点环境进行一致性检测，保证操作完成后获取最新的节点一致性状态           
                createECMSManagerClient({ ip: nodeHost }).consistency_check();
            }
            // 记录设置节点日志
            if (results.success.length) {
                manageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_SET'],
                    msg: __('设置节点“${nodeIp}” 成功', { nodeIp: nodeHost }),
                    exMsg: !useExternalDb && rolesConfig.haRole === Roles.MasterBasicHa ?
                        __('节点名称：${alias}，节点角色：${roles}，访问IP：${ovip}，数据库访问IP：${ivip}，子网掩码：${mask}，网卡信息：${nic}', {
                            alias: nodeAlias ? nodeAlias : '---',
                            roles: reduce(rolesConfig, (pre, value) => value ? `${pre}${pre ? ',' : ''}${renderRolesName(value)}` : pre, '') || '---',
                            ovip: vipConfig.vip,
                            ivip: ivip,
                            mask: vipConfig.mask,
                            nic: vipConfig.nic
                        })
                        :
                        (useExternalDb && rolesConfig.haRole === Roles.MasterBasicHa || rolesConfig.haRole === Roles.MasterAppHa || rolesConfig.haRole === Roles.MasterStorHa || rolesConfig.haRole === Roles.MasterDbHa) ?
                            __('节点名称：${alias}，节点角色：${roles}，访问IP：${ip}，子网掩码：${mask}，网卡信息：${nic}', {
                                alias: nodeAlias ? nodeAlias : '---',
                                roles: reduce(rolesConfig, (pre, value) => value ? `${pre}${pre ? ',' : ''}${renderRolesName(value)}` : pre, '') || '---',
                                ip: vipConfig.vip,
                                mask: vipConfig.mask,
                                nic: vipConfig.nic
                            })
                            :
                            __('节点名称：${alias}，节点角色：${roles}', {
                                alias: nodeAlias ? nodeAlias : '---',
                                roles: reduce(rolesConfig, (pre, value) => value ? `${pre}${pre ? ',' : ''}${renderRolesName(value)}` : pre, '') || '---'
                            })
                })
            }

            this.props.onNodeConfigConfirm(Operation.SetNode, results);
        } else {
            this.props.onNodeConfigConfirm(Operation.NoOperation);
        }
    }

    /**
     * 禁止节点配置操作
     */
    protected disableConfigNode() {
        const { rolesConfig } = this.state;

        return this.props.node ?
            (
                this.state.useExternalDb && rolesConfig.haRole === Roles.MasterBasicHa ||
                rolesConfig.haRole === Roles.MasterAppHa ||
                rolesConfig.haRole === Roles.MasterStorHa ||
                rolesConfig.haRole === Roles.MasterDbHa
            )
            && values(this.state.vipConfig).some(item => !item)
            ||
            !this.state.useExternalDb && rolesConfig.haRole === Roles.MasterBasicHa && (!this.state.ivip || values(this.state.vipConfig).some(item => !item))
            :
            !this.state.nodeHost
    }
}