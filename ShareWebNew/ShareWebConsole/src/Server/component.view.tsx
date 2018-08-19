import * as React from 'react';
import { values, some } from 'lodash';
import * as classnames from 'classnames';
import Button from '../../ui/Button/ui.desktop';
import SearchBox from '../../ui/SearchBox/ui.desktop';
import DataList from '../../ui/DataList/ui.desktop';
import DataListItem from '../../ui/DataList.Item/ui.desktop';
import SwitchButton2 from '../../ui/SwitchButton2/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import InlineButton from '../../ui/InlineButton/ui.desktop';
import Title from '../../ui/Title/ui.desktop';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop';
import { ncTHaSys } from '../../core/thrift/ecmsmanager/helper';
import { shrinkText } from '../../util/formatters/formatters';
import NodeConfig from './NodeConfig/component.view';
import ErrorMsg from './ErrorMsg/component.view';
import ConfirmMessage from './ConfirmMessage/component.view';
import ServerBase from './component.base';
import { Operation, Roles, renderRolesName } from './helper';
import __ from './locale';
import * as styles from './styles.view';
import * as icon_role_disable from './assets/icon_role_disable.png';
import * as icon_app from './assets/icon_app.png';
import * as icon_storage from './assets/icon_storage.png';
import * as icon_db_master from './assets/icon_db_master.png';
import * as icon_db_slave from './assets/icon_db_slave.png';
import * as icon_ecms from './assets/icon_ecms.png';
import * as icon_index from './assets/icon_index.png';
import * as icon_ha_master from './assets/icon_ha_master.png';
import * as icon_ha_slave from './assets/icon_ha_slave.png';
import * as icon_remove_disable from './assets/icon_remove_disable.png';
import * as icon_restart_node_disable from './assets/icon_restart_node_disable.png';
import * as icon_restart_service_disable from './assets/icon_restart_service_disable.png';
import * as icon_setting_disable from './assets/icon_setting_disable.png';
import * as icon_refresh_disable from './assets/icon_refresh_disable.png';

const OperationDescription = {
    [Operation.LoadingInfo]: __('正在加载，请稍候......'),
    [Operation.CloseLVSAppBalancing]: __('正在关闭LVS负载均衡-应用，请稍候......'),
    [Operation.CloseLVSStorageBalancing]: __('正在关闭LVS负载均衡-存储，请稍候......'),
    [Operation.OpenLVSAppBalancing]: __('正在开启LVS负载均衡-应用，请稍候......'),
    [Operation.OpenLVSStorageBalancing]: __('正在开启LVS负载均衡-存储，请稍候......'),
    [Operation.FixConsistency]: __('正在同步系统配置，请稍候......'),
    [Operation.RestartNode]: __('此过程将持续较长时间，请勿刷新页面。'),
    [Operation.RestartService]: __('此过程将持续较长时间，请勿刷新页面。'),
    [Operation.DeleteNode]: __('正在删除节点，请稍候......')
}

export default class Server extends ServerBase {
    render() {
        const {
            nodesInfo,
            haNodes,
            dbNodes,
            indexNodes,
            loading,
            showNodeConfig,
            errorMessage,
            opState,
            searchKey,
            nodesCompleteInfo,
            indexServiceState,
            confirmOperation
        } = this.state;
        return (
            <div className={styles['server']}>
                {
                    loading ?
                        <ProgressCircle
                            detail={OperationDescription[opState]}
                        />
                        : null
                }
                {
                    errorMessage ?
                        <ErrorMsg
                            operation={opState}
                            errorInfo={errorMessage}
                            onConfirmErrMsg={(errorInfo?) => this.closeErrorDialog(errorInfo)}
                        />
                        : null
                }
                {
                    confirmOperation ?
                        <ConfirmMessage
                            opState={opState}
                            onMessageConfirm={this.implementOperation.bind(this)}
                            onMessageCancel={() => { this.handleCancelOperate() }}
                        />
                        : null
                }
                {
                    showNodeConfig ?
                        <NodeConfig
                            roles={{
                                'haNodes': haNodes,
                                'dbNodes': dbNodes,
                                'indexNodes': indexNodes
                            }}
                            allNodes={nodesInfo}
                            node={this.node}
                            deploymentMode={this.deploymentMode}
                            onNodeConfigConfirm={(operation, results) => { this.updateNodesInfo(operation, results) }}
                            onNodeConfigCancel={() => this.closeNodeConfig()}
                        />
                        : null
                }
                <Button
                    icon={'\uf089'}
                    theme="dark"
                    onClick={this.showNodeConfig.bind(this)}
                >
                    {__('添加节点')}
                </Button>
                <SearchBox
                    className={styles['search-box']}
                    placeholder={__('输入节点名称/节点IP')}
                    value={searchKey}
                    onChange={key => { this.changeSearchKey(key) }}
                    loader={key => this.searchNodes(key)}
                    onLoad={data => { this.loadSearchResult(data) }}
                />
                <DataList className={styles['data-list']}>
                    {
                        nodesCompleteInfo.map(node => {
                            return (
                                <DataListItem
                                    key={node.nodeIp}
                                    checkbox={false}
                                    selectable={false}
                                    className={styles['list-item']}
                                >
                                    <div className={styles['item']} style={{ width: '15%' }}>
                                        <div>
                                            <UIIcon
                                                className={styles['icon']}
                                                code={'\uf0af'}
                                                fallback={'\uf0af'}
                                                size={16}
                                            />
                                            <span>
                                                {node.nodeIp}
                                            </span>
                                        </div>
                                        <Title
                                            className={styles['node-alias']}
                                            content={node.nodeAlias || '---'}
                                        >
                                            {shrinkText(node.nodeAlias, { limit: 30 }) || '---'}
                                        </Title>
                                    </div>
                                    <div className={styles['item']} style={{ width: '40%', whiteSpace: 'normal' }}>
                                        {
                                            node.nodeRoles.haRole ?
                                                this.renderHaRole(node)
                                                : null
                                        }
                                        {
                                            node.nodeRoles.dbRole ?
                                                <div className={styles['item']}>
                                                    <UIIcon
                                                        className={classnames(
                                                            [styles['node-role']]
                                                        )}
                                                        code={node.nodeRoles.dbRole === Roles.MasterDb ? '\uf0c1' : '\uf0c2'}
                                                        fallback={
                                                            node.isOnline ?
                                                                node.nodeRoles.dbRole === Roles.MasterDb ? icon_db_master : icon_db_slave
                                                                : icon_role_disable
                                                        }
                                                        color={node.isOnline ? '#d2a2ff' : '#cacaca'}
                                                        size={20}
                                                    />
                                                    <span>
                                                        {
                                                            node.nodeRoles.dbRole === Roles.MasterDb ?
                                                                __('数据库主节点')
                                                                : __('数据库从节点')
                                                        }
                                                    </span>
                                                </div>
                                                : null
                                        }
                                        {
                                            node.nodeRoles.appRole ?
                                                <div className={styles['item']}>
                                                    <UIIcon
                                                        className={classnames(
                                                            [styles['node-role']]
                                                        )}
                                                        code={'\uf0c2'}
                                                        fallback={node.isOnline ? icon_app : icon_role_disable}
                                                        color={node.isOnline ? '#ffc045' : '#cacaca'}
                                                        size={20}
                                                    />
                                                    <span>{__('应用节点')}</span>
                                                </div>
                                                : null
                                        }
                                        {
                                            node.nodeRoles.storageRole ?
                                                <div className={styles['item']}>
                                                    <UIIcon
                                                        className={classnames(
                                                            [styles['node-role']]
                                                        )}
                                                        code={'\uf0c2'}
                                                        fallback={node.isOnline ? icon_storage : icon_role_disable}
                                                        color={node.isOnline ? '#5dd176' : '#cacaca'}
                                                        size={20}
                                                    />
                                                    <span>{__('存储节点')}</span>
                                                </div>
                                                : null
                                        }
                                        {
                                            node.nodeRoles.ecmsRole ?
                                                <div className={styles['item']}>
                                                    <UIIcon
                                                        className={classnames(
                                                            [styles['node-role']]
                                                        )}
                                                        code={'\uf0c2'}
                                                        fallback={node.isOnline ? icon_ecms : icon_role_disable}
                                                        color={node.isOnline ? '#448aab' : '#cacaca'}
                                                        size={20}
                                                    />
                                                    <span>{__('集群管理节点')}</span>
                                                </div>
                                                : null
                                        }
                                        {
                                            node.nodeRoles.indexRole ?
                                                <div className={styles['item']}>
                                                    <UIIcon
                                                        className={classnames(
                                                            [styles['node-role']]
                                                        )}
                                                        code={'\uf0c2'}
                                                        fallback={node.isOnline ? icon_index : icon_role_disable}
                                                        color={node.isOnline ? '#e28a00' : '#cacaca'}
                                                        size={20}
                                                    />
                                                    <span>{__('文档索引节点')}</span>
                                                </div>
                                                : null
                                        }
                                    </div>
                                    <div className={styles['item']} style={{ width: '20%' }}>
                                        {
                                            <div className={classnames(
                                                { [styles['color-green']]: node.isOnline },
                                                { [styles['color-red']]: !node.isOnline }
                                            )}>
                                                {
                                                    node.isOnline ?
                                                        __('在线') :
                                                        __('离线')
                                                }
                                            </div>
                                        }
                                        {
                                            !node.consistencyStatus ?
                                                <div>
                                                    <span className={styles['color-red']}>
                                                        {__('配置信息不一致')}
                                                    </span>
                                                    <div className={styles['margin-left']}>
                                                        <InlineButton
                                                            title={__('同步系统配置')}
                                                            code={'\uf04a'}
                                                            className={styles['inline-button']}
                                                            fallback={node.isOnline ? '\uf04a' : icon_refresh_disable}
                                                            onClick={this.repairConsistency.bind(this, node)}
                                                            disabled={!node.isOnline}
                                                        />
                                                    </div>
                                                </div>
                                                : null
                                        }
                                        {
                                            node.nodeRoles.indexRole ?
                                                <div>
                                                    <span>{__('索引服务状态：')}</span>
                                                    {
                                                        indexServiceState ?
                                                            <span className={classnames(
                                                                styles['color-green'],
                                                                styles['margin-left']
                                                            )}>{__('正常')}</span>
                                                            :
                                                            <span className={classnames(
                                                                styles['color-red'],
                                                                styles['margin-left']
                                                            )}>{__('停止')}</span>
                                                    }
                                                </div>
                                                : null
                                        }
                                    </div>
                                    <div className={styles['item']}>
                                        <div>
                                            <div className={styles['operation']}>
                                                <InlineButton
                                                    code={'\uf044'}
                                                    className={styles['inline-button']}
                                                    fallback={node.isOnline ? null : icon_setting_disable}
                                                    title={__('设置')}
                                                    onClick={this.setNodeConfig.bind(this, node)}
                                                    disabled={!node.isOnline}
                                                />
                                            </div>
                                            <div className={styles['operation']}>
                                                <InlineButton
                                                    code={'\uf0ca'}
                                                    className={styles['inline-button']}
                                                    fallback={
                                                        some(values(node.nodeRoles), role => role) && node.isOnline ?
                                                            icon_remove_disable : null
                                                    }
                                                    title={__('移除')}
                                                    disabled={some(values(node.nodeRoles), role => role) && node.isOnline}
                                                    onClick={() => { this.showConfirmMessage(node, Operation.DeleteNode) }}
                                                />
                                            </div>
                                            <div className={styles['operation']}>
                                                <InlineButton
                                                    code={'\uf06d'}
                                                    className={styles['inline-button']}
                                                    fallback={node.isOnline ? null : icon_restart_node_disable}
                                                    title={__('重启节点')}
                                                    onClick={() => { this.showConfirmMessage(node, Operation.RestartNode) }}
                                                    disabled={!node.isOnline}
                                                />
                                            </div>
                                            <div className={styles['operation']}>
                                                <InlineButton
                                                    code={'\uf0c7'}
                                                    className={styles['inline-button']}
                                                    fallback={node.isOnline ? null : icon_restart_service_disable}
                                                    title={__('重启服务')}
                                                    onClick={() => { this.showConfirmMessage(node, Operation.RestartService) }}
                                                    disabled={!node.isOnline}
                                                />
                                            </div>
                                        </div>
                                        {
                                            node.isOnline && haNodes.some(hanode => hanode.sys === ncTHaSys.BASIC || hanode.sys === ncTHaSys.APP) && node.nodeRoles.appRole ?
                                                <div>
                                                    <span>{__('LVS负载均衡-应用：')}</span>
                                                    <div className={styles['switch-button']}>
                                                        <SwitchButton2
                                                            value={node}
                                                            active={node.lvsLoadBalanceState.app}
                                                            onChange={this.changeLVSAppBanlancingStatus.bind(this)}
                                                        />
                                                    </div>
                                                </div>
                                                : null
                                        }
                                        {
                                            node.isOnline && haNodes.some(hanode => hanode.sys === ncTHaSys.BASIC || hanode.sys === ncTHaSys.STORAGE) && node.nodeRoles.storageRole ?
                                                <div>
                                                    <span>{__('LVS负载均衡-存储：')}</span>
                                                    <div className={styles['switch-button']}>
                                                        <SwitchButton2
                                                            value={node}
                                                            active={node.lvsLoadBalanceState.storage}
                                                            onChange={this.changeLVSStorBanlancingStatus.bind(this)}
                                                        />
                                                    </div>
                                                </div>
                                                : null
                                        }
                                    </div>
                                </DataListItem >
                            )
                        })
                    }
                </DataList >
            </div >
        )
    }

    renderHaRole(hanode) {
        switch (hanode.nodeRoles.haRole) {
            case Roles.MasterBasicHa:
            case Roles.MasterAppHa:
            case Roles.MasterStorHa:
            case Roles.MasterDbHa:
                return (
                    <div className={styles['item']}>
                        <UIIcon
                            className={classnames(
                                [styles['node-role']]
                            )}
                            code={'\uf0c1'}
                            fallback={hanode.isOnline ? icon_ha_master : icon_role_disable}
                            color={hanode.isOnline ? '#84beff' : '#cacaca'}
                            size={20}
                        />
                        <span>
                            {renderRolesName(hanode.nodeRoles.haRole)}
                        </span>
                    </div >
                )
            case Roles.SlaveBasicHa:
            case Roles.SlaveAppHa:
            case Roles.SlaveStorHa:
            case Roles.SlaveDbHa:
                return (
                    <div className={styles['item']}>
                        <UIIcon
                            className={classnames(
                                [styles['node-role']]
                            )}
                            code={'\uf0c2'}
                            fallback={hanode.isOnline ? icon_ha_slave : icon_role_disable}
                            color={hanode.isOnline ? '#9fc5f8' : '#cacaca'}
                            size={20}
                        />
                        <span>
                            {renderRolesName(hanode.nodeRoles.haRole)}
                        </span>
                    </div>
                )
        }
    }
}