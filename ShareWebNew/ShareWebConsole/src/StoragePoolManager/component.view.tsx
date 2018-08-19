import * as React from 'react';
import * as classnames from 'classnames';
import * as _ from 'lodash';
import { Link } from 'react-router';
import StoragePoolManagerBase from './component.base';
import Button from '../../ui/Button/ui.desktop';
import ConfirmDialog from '../../ui/ConfirmDialog/ui.desktop';
import ErrorDialog from '../../ui/ErrorDialog/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import ProgressCircle from '../../ui/ProgressCircle/ui.desktop';
import Title from '../../ui/Title/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import { InitStatus, ReplicasMode } from '../StorageSubSystem/helper';
import AddDevicesDialog from './AddDevicesDialog/component.view';
import PoolDevicesList from './PoolDevicesList/component.desktop';
import StorageInitPanel from './StorageInitPanel/component.view';
import StrategyModeDialog from './StrategyModeDialog/component.view';
import ReplaceDevicesDialog from './ReplaceDevicesDialog/component.view';
import __ from './locale';
import * as styles from './styles.view.css';
import { LoadingStatus, ErrorStatus, WarningStatus, ConfirmStatus } from './helper';

export default class StoragePoolManager extends StoragePoolManagerBase {

    render() {
        let { waitForReplacedDevice, showReplaceDeviceDialog, showStorageStrategyDialog,
            showAddDevicesDialog, storageInitStatus, warningStatus,
            errorMsg, errorStatus, loadingStatus, storagePoolDevices,
            storagePoolNodeInfo, replicasHealth, storagePoolInfo,
            confirmStatus, freeReplacePoolDevices,
            isSomeDeviceOffline, serverPath } = this.state;

        return (

            <div className={classnames(styles['storage-pool-body'])}>

                {
                    this.renderLoadingContent(loadingStatus)
                }

                {
                    storageInitStatus === InitStatus.TOINIT ?
                        <StorageInitPanel
                            onInit={this.handleInitSucceed.bind(this)}
                        />
                        :
                        <div className={classnames(styles['storage-pool-manager'])}>
                            <div className={classnames(styles['storage-manager-head'])}>
                                <div className={classnames(styles['storage-manager-infos'])}>
                                    <div className={classnames(styles['storage-manager-infoItem'])}>
                                        <span className={classnames(styles['storage-manager-infoInline-title'])}>
                                            {__('系统存储策略：')}
                                        </span>
                                        <span className={classnames(styles['font-real-bold'], styles['storage-manager-infoInline-content'])}>
                                            {
                                                this.renderReplicasModeTitle(storagePoolInfo, true)
                                            }
                                        </span>
                                        <Title
                                            content={__('设置')}
                                        >
                                            <UIIcon
                                                className={styles['storage-manager-infoInline-operation']}
                                                code={'\uf044'}
                                                size="14px"
                                                onClick={() => { this.handleSettingReplicasMode() }}
                                            />
                                        </Title>
                                    </div>
                                    <div className={classnames(styles['storage-manager-infoItem-logicChart'])}>

                                        {
                                            isSomeDeviceOffline ?
                                                null
                                                :
                                                <div
                                                    id="logic_pie"
                                                    className={classnames(styles['login-offline'])}
                                                ></div>
                                        }
                                        {
                                            isSomeDeviceOffline ?
                                                <div className={classnames(styles['login-offline'])}></div>
                                                :
                                                null
                                        }
                                        <span className={classnames(styles['storage-manager-infoInline-title'])}>
                                            {__('逻辑空间使用率：')}
                                        </span>
                                        <span className={classnames(styles['storage-manager-infoInline-percent'], { [styles['font-color-red']]: isSomeDeviceOffline })}>
                                            {isSomeDeviceOffline ? __('无法读取') : this.renderUsedSize(storagePoolInfo, true)}
                                        </span>
                                        <span className={classnames(styles['storage-percent-info'])}>
                                            {isSomeDeviceOffline ? null : `( ${this.formatProgressSize(storagePoolInfo.logical_used_size_gb)}/${this.formatProgressSize(storagePoolInfo.ring.logical_capacity_gb)} )`}
                                        </span>

                                    </div>

                                </div>
                                <div className={classnames(styles['storage-manager-infos'])}>
                                    <div className={classnames(styles['storage-manager-infoItem'])}>
                                        <span className={classnames(styles['storage-manager-infoInline-title'])}>
                                            {__('副本健康度：')}
                                        </span>
                                        <span className={classnames(styles['font-bold'], styles['storage-manager-infoInline-content'])}>
                                            {
                                                replicasHealth === -99 || replicasHealth === -1.0 ? '---' : `${replicasHealth.toFixed(2)}%`
                                            }
                                        </span>

                                        {
                                            replicasHealth === 100.00 ?
                                                <span className={classnames(styles['font-color-green'])}>{__('最佳')}</span>
                                                :
                                                replicasHealth === -1.0 ?
                                                    null
                                                    :
                                                    null
                                        }

                                    </div>
                                    <div className={classnames(styles['storage-manager-infoItem-physicalChart'])}>
                                        {
                                            isSomeDeviceOffline ?
                                                null
                                                :
                                                <div
                                                    id="physical_pie"
                                                    className={classnames(styles['physical-offline'])}
                                                >

                                                </div>
                                        }
                                        {
                                            isSomeDeviceOffline ?
                                                <div className={classnames(styles['physical-offline'])}></div>
                                                :
                                                null
                                        }
                                        <span className={classnames(styles['storage-manager-infoInline-title'])}>
                                            {__('物理空间使用率：')}
                                        </span>
                                        <span className={classnames(styles['storage-manager-infoInline-percent'], { [styles['font-color-red']]: isSomeDeviceOffline })}>
                                            {isSomeDeviceOffline ? __('无法读取') : this.renderUsedSize(storagePoolInfo, false)}
                                        </span>
                                        <span className={classnames(styles['storage-percent-info'])}>
                                            {isSomeDeviceOffline ? null : `( ${this.formatProgressSize(storagePoolInfo.physical_used_size_gb)}/${this.formatProgressSize(storagePoolInfo.ring.physical_capacity_gb)} )`}
                                        </span>

                                    </div>
                                </div>

                                <div className={classnames(styles['storage-manager-infos'])}>
                                    <div className={classnames(styles['storage-manager-infoItem'])}>
                                        <span className={classnames(styles['storage-manager-infoInline-title'])}>
                                            {__('负载均衡状态：')}
                                        </span>
                                        <span className={classnames(styles['font-bold'], styles['storage-manager-infoInline-content'])}>
                                            {
                                                storagePoolInfo.ring.balance === 'None' ? '---' : `${storagePoolInfo.ring.balance.toFixed(2)}`
                                            }
                                        </span>

                                        {
                                            storagePoolInfo.ring.balance === 0 ?
                                                <span className={classnames(styles['font-color-green'])}>{__('最佳')}</span>
                                                :
                                                <Button
                                                    className={classnames(styles['storage-balance-btn'])}
                                                    onClick={() => this.handleClickOverloadBalanceBtn()}
                                                >
                                                    {__('重载均衡')}
                                                </Button>

                                        }

                                    </div>

                                </div>
                            </div>
                            <div className={classnames(styles['storage-manager-body'])}>
                                <Button
                                    className={classnames(styles['storage-manager-addDevices'])}
                                    onClick={() => { this.handleClickAddDevicesBtn() }}
                                    theme="dark"
                                >
                                    <UIIcon
                                        className={styles['storage-manager-addIcon']}
                                        code={'\uf089'}
                                        size="14px"
                                    />
                                    <span className={styles['storage-manager-addLabel']}>{__('添加设备')}</span>
                                </Button>
                                {
                                    this.renderPoolDevices(storagePoolNodeInfo, storagePoolDevices)
                                }


                            </div>
                        </div>
                }

                {
                    this.renderMessageContent(confirmStatus, serverPath)
                }

                {
                    this.renderWarningContent(warningStatus)
                }

                {
                    this.renderErrorContent(errorStatus, errorMsg)
                }

                {
                    showAddDevicesDialog ?
                        <AddDevicesDialog
                            storagePoolNodeInfo={storagePoolNodeInfo}
                            onAddDevicesConfirm={this.handleConfirmAddDevices.bind(this)}
                            onAddDevicesCancel={this.handleCancelAddDevices.bind(this)}
                        />
                        :
                        null
                }

                {
                    showStorageStrategyDialog ?
                        <StrategyModeDialog
                            currentMode={this.renderReplicasModeTitle(storagePoolInfo)}
                            onStrategyChangeConfirm={(mode) => { this.handleUpdateStrategyMode(mode); }}
                            onStrategyChangeCancel={() => { this.handleCancelUpdateStrategyMode(); }}
                        />
                        :
                        null
                }

                {
                    showReplaceDeviceDialog ?
                        <ReplaceDevicesDialog
                            freePoolDevices={freeReplacePoolDevices}
                            replacedPoolDevice={waitForReplacedDevice}
                            onReplaceDevicesConfirm={this.handleConfirmReplaceDevices.bind(this)}
                            onReplaceDevicesCancel={this.handleCancelReplaceDevices.bind(this)}
                        />
                        :
                        null
                }
            </div>

        )
    }

    /**
     * 返回 800.34MB / 100.22GB格式的字符串
     * @param size 转换的值
     */
    formatProgressSize(size) {
        if (size === -1) {
            return '---'
        }
        if (!size) return '0.00GB';
        let resultSize = '0.00';
        if (size < 1) {
            resultSize = (size * 1024).toFixed(2).toString() + 'MB';
        } else if (size > 1024) {
            resultSize = (size / 1024).toFixed(2).toString() + 'TB';
        } else {
            resultSize = size.toFixed(2).toString() + 'GB';
        }
        return resultSize
    }

    /**
     * 返回空间使用率百分比 如3.54%
     */
    renderUsedSize(storagePoolInfo, logical?) {
        if (storagePoolInfo.physical_used_size_gb === -1 && storagePoolInfo.logical_used_size_gb === -1) {
            return '---'
        }

        let result = !logical ?
            (storagePoolInfo.physical_used_size_gb / storagePoolInfo.ring.physical_capacity_gb * 100).toFixed(2)
            :
            (storagePoolInfo.logical_used_size_gb / storagePoolInfo.ring.logical_capacity_gb * 100).toFixed(2)
        result = isNaN(result) ? '0.00' : result;
        return `${result}%`;
    }

    /**
     * 返回副本模式
     */
    renderReplicasModeTitle(storagePoolInfo, simple?) {
        if (_.values(storagePoolInfo).length === 0) {
            return 0.00;
        }
        switch (storagePoolInfo['ring']['replicas']) {
            case ReplicasMode.NONE:
                return simple ? '---' : null
            case ReplicasMode.ONE:
                return simple ? __('1副本模式') : { name: __('1副本模式'), mode: ReplicasMode.ONE }
            case ReplicasMode.THREE:
                return simple ? __('3副本模式') : { name: __('3副本模式'), mode: ReplicasMode.THREE }
            default:
                break;
        }

    }

    /**
     * 渲染设备列表
     */
    renderPoolDevices(storagePoolNodeInfo, storagePoolDevices) {
        let tag = 0;
        return storagePoolNodeInfo.map((poolNode) =>
            _.values(storagePoolDevices[poolNode.node_ip]).length === 0 ?
                null
                :
                <PoolDevicesList
                    expand={tag++ === 0}
                    storagePoolNodeInfo={poolNode}
                    storagePoolDevices={storagePoolDevices[poolNode.node_ip]}
                    emptyDevicesList={(node, dev) => this.handleEmptyDeviceList(node, dev)}
                    replaceDevice={(device) => this.handleReplaceDevice(device)}
                    deleteDevice={(device) => this.handleDeleteDevice(device)}
                />
        )
    }

    /**
     * 渲染等待提示
     */
    renderLoadingContent(loadingStatus) {
        let loadingMsg = '';
        switch (loadingStatus) {
            case LoadingStatus.NOVISIBLE:
                return;
            case LoadingStatus.ADDING:
                loadingMsg = __('正在添加，请稍候......');
                break;
            case LoadingStatus.BALANCING:
                loadingMsg = __('正在重载，请稍候......')
                break;
            case LoadingStatus.LOADING:
                loadingMsg = __('正在加载，请稍候......')
                break;
            case LoadingStatus.INITING:
                loadingMsg = __('正在初始化，请稍候......')
                break;
            case LoadingStatus.MODIFYING:
                loadingMsg = __('正在修改，请稍候......')
                break;
            case LoadingStatus.REMOVING:
                loadingMsg = __('正在移除，请稍候......')
                break;
            case LoadingStatus.REPLACING:
                loadingMsg = __('正在替换，请稍候......')
                break;
            default:
                return;
        }

        return (
            <div className={styles['loading']}>
                <ProgressCircle
                    detail={loadingMsg}
                />
            </div>


        )
    }

    /**
     * 渲染信息提示框
     */
    renderMessageContent(confirmStatus, serverPath) {
        let confirmMsg = '';
        switch (confirmStatus) {
            case ConfirmStatus.NOVISIBLE:
                return;
            case ConfirmStatus.LINK_TO_SERVER:
                return (
                    <MessageDialog
                        onConfirm={() => { this.handleConfirmMessageDialog() }}
                    >
                        <span>
                            {__('请先')}
                            <Link to={serverPath} activeClassName="font-color-green">{__('添加存储节点。')}</Link>
                        </span>
                    </MessageDialog>
                )
            case ConfirmStatus.NO_FREE_DISKS_FOR_REPLACE:
                confirmMsg = __('当前节点不存在可替换设备。');
                break;
            default:
                return;
        }

        return (
            <MessageDialog
                onConfirm={() => { this.handleConfirmMessageDialog() }}
            >
                {confirmMsg}
            </MessageDialog>
        )

    }

    /**
     * 渲染警告提示框
     */
    renderWarningContent(warningStatus) {
        let warningMsg = '';
        switch (warningStatus) {
            case WarningStatus.NOVISIBLE:
                return;
            case WarningStatus.BALANCE:
                warningMsg = __('此操作可能会导致集群系统内数据迁移，该过程可能会影响系统性能，您确定要执行此操作吗？');
                break;
            case WarningStatus.DELETE_DISK:
                warningMsg = __('移除磁盘会导致存储池内数据迁移，系统将重新进行负载均衡处理，您确定要执行此操作吗？')
                break;
            case WarningStatus.EMPTY_DISKS:
                warningMsg = __('移除磁盘会导致存储池内数据迁移，系统将重新进行负载均衡处理，您确定要移除该节点上的所有磁盘吗？')
                break;
            default:
                break;
        }

        return (
            <ConfirmDialog
                onConfirm={() => { this.handleConfirmConfirmDialog() }}
                onCancel={() => { this.handleCancelConfirmDialog() }}
            >
                {warningMsg}
            </ConfirmDialog>
        )
    }

    /**
     * 渲染错误提示框
     */
    renderErrorContent(errorStatus, errorMsg) {

        let errorTitle = '';
        switch (errorStatus) {
            case ErrorStatus.NOVISIBLE:
                return;
            case ErrorStatus.LOADING_FAILED:
                errorTitle = __('加载失败，错误信息如下：');
                break;
            case ErrorStatus.GET_FREE_DISK_FAILED:
                errorTitle = __('获取空闲设备失败，错误信息如下：');
                break;
            case ErrorStatus.REPLACE_FAILED:
                errorTitle = __('替换失败，错误信息如下：');
                break;
            case ErrorStatus.BALANCE_FAILED:
                errorTitle = __('重载失败，错误信息如下：');
                break;
            case ErrorStatus.REMOVE_FAILED:
                errorTitle = __('移除失败，错误信息如下：');
                break;
            case ErrorStatus.ADD_FAILED:
                errorTitle = __('添加失败，错误信息如下：');
                break;
            case ErrorStatus.MODIFY_FAILED:
                errorTitle = __('修改失败，错误信息如下：');
                break;
            default:
                return;
        }

        return (
            <ErrorDialog
                onConfirm={() => { this.handleConfirmErrorDialog() }}
            >
                <ErrorDialog.Title>
                    {errorTitle}
                </ErrorDialog.Title>
                <ErrorDialog.Detail>
                    <span>
                        {errorMsg}
                    </span>
                </ErrorDialog.Detail>
            </ErrorDialog>
        )
    }
}
