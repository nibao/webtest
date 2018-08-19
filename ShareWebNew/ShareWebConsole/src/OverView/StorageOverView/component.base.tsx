import * as React from 'react';
import { noop } from 'lodash';
import { formatSize } from '../../../util/formatters/formatters';
import WebComponent from '../../webcomponent';
import { ECMSManagerClient, createEVFSClient } from '../../../core/thrift2/thrift2';
import { appStatusReady } from '../../../core/cluster/cluster';

enum StorageStatus {
    /**
     * 第三方存储池
     */
    ThirdStorage,

    /**
     * ASU存储
     */
    ASUStorage,

    /**
     * 未初始化的存储池
     */
    UnInited,

    /**
     * 已初始化
     */
    Inited,

    /**
     * 加载中
     */
    Loading,

    /**
     * 错误
     */
    Error,

    /**
     * 没有应用服务
     */
    NotHasApplication

}

/**
 * 错误原因
 */
enum ErrorReason {
    /**
     * 获取存储配置失败
     */
    GetStorageInfoError,

    /**
     * 获取存储池报错
     */
    GetStoragePoolFail,

    /**
     * 初始化存储失败
     */
    InitStoragePoolFail,

    /**
     * 重在均衡失败
     */
    ResetBalanceFail

}

export default class StorageOverViewBase extends WebComponent<Console.StorageOverView.Props, Console.StorageOverView.State> {

    static defaultProps = {
        doStorageRedirect: noop,
        doServerRedirect: noop
    }

    static StorageStatus = StorageStatus;

    state = {
        storageStatus: StorageStatus.Loading,
        replicas: 0,
        replicasHealth: -1,
        balance: 0,
        resetBalanceWarn: false,
        error: null,
        changingStorageModel: false,
        resetingBalance: false,
        showEditReplicas: false
    }


    static ErrorReason = ErrorReason;

    async componentWillMount() {
        try {
            const appIp = await appStatusReady();
            if (appIp === '') {
                this.setState({
                    storageStatus: StorageStatus.NotHasApplication
                })
            } else {

                const { provider } = (await createEVFSClient({ ip: appIp }).GetThirdPartyOSSInfo())

                if (provider) {
                    if (provider === 'ASU') {
                        this.setState({
                            storageStatus: StorageStatus.ASUStorage
                        })
                    } else {
                        this.setState({
                            storageStatus: StorageStatus.ThirdStorage
                        })
                    }

                } else if (!await ECMSManagerClient.is_storage_pool_inited()) {
                    this.setState({
                        storageStatus: StorageStatus.UnInited
                    })
                } else {
                    this.getStoragePoolInfo();
                }
            }

        } catch (ex) {
            this.setState({
                error: {
                    errorReason: ErrorReason.GetStorageInfoError,
                    errorInfo: ex
                },
                storageStatus: StorageStatus.Error
            })

        }

    }

    /**
     * 获取存储副本
     */
    private async getStoragePoolInfo() {

        try {
            let [storagePool, replicasHealth] = await Promise.all([ECMSManagerClient.get_storage_pool([true]), ECMSManagerClient.get_replicas_health()])
            this.setState({
                storageStatus: StorageStatus.Inited,
                storagePool,
                replicasHealth
            })
        } catch (ex) {
            this.setState({
                error: {
                    errorReason: ErrorReason.GetStoragePoolFail,
                    errorInfo: ex
                }
            })
        }

    }

    /**
     * 打开设置副本模式弹窗
     */
    protected openReplicasSetPanel() {
        this.setState({
            editReplicas: this.state.storagePool.ring.replicas,
            showEditReplicas: true
        })
    }

    /**
     * 设置副本
     */
    protected setReplicas(value) {
        this.setState({
            editReplicas: value
        })
    }

    /**
     * 保存配置
     */
    protected async confirmReplicas() {

        try {
            if (this.state.editReplicas !== this.state.storagePool.ring.replicas) {

                this.setState({
                    changingStorageModel: true,
                    showEditReplicas: false
                })
                await ECMSManagerClient.change_replicas(this.state.editReplicas)
                this.setState({
                    storagePool: {
                        ...this.state.storagePool,
                        ring: {
                            ...this.state.storagePool.ring,
                            replicas: this.state.editReplicas
                        }
                    },
                    editReplicas: undefined,
                    changingStorageModel: false
                })
            } else {
                this.setState({
                    editReplicas: 0,
                    showEditReplicas: false
                })
            }

        } catch (ex) {
            this.setState({
                error: {
                    errorReason: ErrorReason.GetInitStoragePoolFail,
                    errorInfo: ex,
                    changingStorageModel: false,
                    showEditReplicas: false
                }
            })
        }
    }

    /**
     * 取消配置
     */
    protected cancelReplicas() {
        this.setState({
            showEditReplicas: false,
            editReplicas: 0
        })
    }

    /**
     * 重置负载均衡
     */
    protected resetBalance() {
        this.setState({
            resetBalanceWarn: true
        })
    }


    /**
     * 确定重载均衡
     */
    protected async confirmResetBalance() {
        this.setState({
            resetingBalance: true,
            resetBalanceWarn: false
        })
        try {
            await ECMSManagerClient.rebalance_storage_pool()
            this.setState({
                storagePool: await ECMSManagerClient.get_storage_pool(true),
                resetingBalance: false
            })
        } catch (ex) {
            this.setState({
                error: {
                    errorReason: ErrorReason.ResetBalanceFail,
                    errorInfo: ex,
                    resetingBalance: false
                }
            })
        }
    }

    /**
     * 取消重载均衡
     */
    protected cancelResetBalance() {
        this.setState({
            resetBalanceWarn: false
        })
    }

    /**
     * 关闭错误弹窗
     */
    protected closeErrorDialog() {
        this.setState({
            error: null
        })
    }
    /**
     * 配额图value
     */
    protected progressBarValue(size, totalSize) {
        return `${size ? formatSize(size * Math.pow(1024, 3), 2, { minUnit: 'MB' }) : 0}/${totalSize ? formatSize(totalSize * Math.pow(1024, 3), 2, { minUnit: 'MB' }) : 0}`
    }
}