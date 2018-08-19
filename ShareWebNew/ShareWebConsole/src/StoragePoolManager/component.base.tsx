import * as React from 'react';
import * as Highcharts from 'highcharts';
import * as _ from 'lodash';
import WebComponent from '../webcomponent';
import { ECMSManagerClient, createShareSiteClient } from '../../core/thrift2/thrift2';
import { appStatusReady } from '../../core/cluster/cluster';
import '../../gen-js/EVFS_types';
import '../../gen-js/EACPLog_types';
import '../../gen-js/ECMSAgent_types';
import { manageLog } from '../../core/log2/log2'
import { InitStatus } from '../StorageSubSystem/helper';
import { LoadingStatus, ErrorStatus, WarningStatus, ConfirmStatus } from './helper';
import __ from './locale';

export default class StoragePoolManagerBase extends WebComponent<Console.StoragePoolManager.Props, Console.StoragePoolManager.State>{

    static contextTypes = {
        toast: React.PropTypes.func
    }

    static defaultProps = {
        storageInitStatus: InitStatus.TOINIT
    }

    state = {

        /**
         * 存储池初始化状态
         */
        storageInitStatus: this.props.storageInitStatus,

        /**
         * 选择的系统存储策略
         */
        storageStrategyMode: { name: '-', mode: 0 },

        /**
         * 存储池信息
         */
        storagePoolInfo: {
            'physical_used_size_gb': -1,
            'ring': {
                'partition_count': 0,
                'region_count': 0,
                'replicas': 0,
                'min_part_hours': 0,
                'device_count': 0,
                'part_power': 0,
                'physical_capacity_gb': -1,
                'logical_capacity_gb': -1,
                'build_version': 0,
                'zone_count': 0,
                'balance': 'None'
            },
            'logical_used_size_gb': -1
        },

        /**
         * 副本健康度 0.00 - 100.00
         */
        replicasHealth: -1.0,

        /**
         * 存储池中节点设备列表
         */
        storagePoolDevices: {},

        /**
         * 存储池节点信息
         */
        storagePoolNodeInfo: [],

        /**
         * 错误提示信息
         */
        errorStatus: ErrorStatus.NOVISIBLE,

        /**
         * 警告提示信息
         */
        warningStatus: WarningStatus.NOVISIBLE,

        /**
         * 等待提示
         */
        loadingStatus: LoadingStatus.LOADING,

        /**
         * 是否显示存储策略配置对话框
         */
        showStorageStrategyDialog: false,

        /**
         * 是否确认进行重载均衡操作
         */
        showConfirmOverload: false,

        /**
         * 是否显示添加设备对话框
         */
        showAddDevicesDialog: false,

        /**
         * 是否显示替换设备对话框
         */
        showReplaceDeviceDialog: false,

        /**
         * 待替换的设备对象
         */
        waitForReplacedDevice: {},

        /**
         * 待移除的设备对象
         */
        waitForDeleteDevice: {},

        /**
         * 信息提示信息
         */
        confirmStatus: ConfirmStatus.NOVISIBLE,

        /**
         * 可用于替换指定存储池设备的备选空闲数据盘列表
         */
        freeReplacePoolDevices: [],

        /**
         * 是否有设备离线，若有逻辑存储空间和物理存储空间使用率值用红色文字显示为：无法读取，进度条不显示
         */
        isSomeDeviceOffline: false,

        /**
         * 服务器管理路由
         */
        serverPath: '',

        /**
         * 错误信息
         */
        errorMsg: '',

        /**
         * 待清空的设备对象
         */
        pendingEmptyingDevices: {}
    }

    async componentWillMount() {
        try {
            let { storageInitStatus } = this.state;
            this.setState({
                loadingStatus: LoadingStatus.LOADING,
            })
            if (storageInitStatus === InitStatus.INITED) {
                let { storagePoolInfo, replicasHealth, storagePoolNodeInfo, storagePoolDevices, isSomeDeviceOffline, loadingStatus } = await this.handleGetStoragePoolInfo();
                this.setState({
                    storagePoolInfo,
                    replicasHealth,
                    storagePoolNodeInfo,
                    storagePoolDevices,
                    isSomeDeviceOffline,
                    loadingStatus
                })
            } else {
                this.setState({
                    loadingStatus: LoadingStatus.NOVISIBLE
                })
            }
        } catch (error) {
            this.setState({
                loadingStatus: LoadingStatus.NOVISIBLE,
                errorStatus: ErrorStatus.LOADING_FAILED,
                errorMsg: error.expMsg ? error.expMsg : error
            })
        }
    }

    componentDidMount() {
        let { storagePoolInfo, storageInitStatus } = this.state;
        if (storageInitStatus === InitStatus.INITED) {
            this.renderCreateHighCharts('logic_pie', storagePoolInfo.logical_used_size_gb, storagePoolInfo.ring.logical_capacity_gb)
            this.renderCreateHighCharts('physical_pie', storagePoolInfo.physical_used_size_gb, storagePoolInfo.ring.physical_capacity_gb)
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let { storagePoolInfo, storageInitStatus } = this.state;
        if (prevState.storagePoolInfo !== storagePoolInfo && storageInitStatus === InitStatus.INITED) {
            this.renderCreateHighCharts('logic_pie', storagePoolInfo.logical_used_size_gb, storagePoolInfo.ring.logical_capacity_gb)
            this.renderCreateHighCharts('physical_pie', storagePoolInfo.physical_used_size_gb, storagePoolInfo.ring.physical_capacity_gb)
        }
    }

    /**
     * 点击副本模式设置按钮
     */
    protected handleSettingReplicasMode() {
        this.setState({
            showStorageStrategyDialog: true
        })
    }

    /**
     * 点击添加设备按钮
     */
    protected async handleClickAddDevicesBtn() {
        this.setState({
            loadingStatus: LoadingStatus.LOADING,
        })
        let { storagePoolNodeInfo } = this.state;
        if (storagePoolNodeInfo.length === 0 || !storagePoolNodeInfo) {
            // 如果存储节点不存在，则跳转到服务器管理页面
            // 获取站点信息
            try {
                const appIp = await appStatusReady();
                let [{ id }] = await createShareSiteClient({ ip: appIp }).GetSiteInfo();
                this.setState({
                    serverPath: `/home/system/${id}/server`,
                    confirmStatus: ConfirmStatus.LINK_TO_SERVER,
                    loadingStatus: LoadingStatus.NOVISIBLE,
                })
                return;
            } catch (ex) { }
        }

        this.setState({
            showAddDevicesDialog: true,
            loadingStatus: LoadingStatus.NOVISIBLE
        })
    }

    /**
     * 点击清空存储节点的设备列表
     */
    protected handleEmptyDeviceList(node, devs) {
        this.setState({
            waitForDeleteDevice: node,
            pendingEmptyingDevices: devs,
            warningStatus: WarningStatus.EMPTY_DISKS,
        })
    }

    /**
     * 点击替换存储设备按钮
     */
    protected async handleReplaceDevice(device) {
        this.setState({
            loadingStatus: LoadingStatus.LOADING,
        })
        try {
            let freeDevices = await ECMSManagerClient.get_free_data_disks_for_replace(device.swift_device.dev_id);
            if (_.keys(freeDevices).length === 0) {
                this.setState({
                    loadingStatus: LoadingStatus.NOVISIBLE,
                    confirmStatus: ConfirmStatus.NO_FREE_DISKS_FOR_REPLACE
                })
            } else {
                let result = _.values(freeDevices).map(dev => {
                    dev.name = `${dev.disk_dev_path}(${dev.capacity_gb.toFixed(2).toString()}GB)`;
                    return dev;
                })
                this.setState({
                    freeReplacePoolDevices: result,
                    loadingStatus: LoadingStatus.NOVISIBLE,
                    showReplaceDeviceDialog: true,
                    waitForReplacedDevice: device
                })
            }
        } catch (error) {
            this.setState({
                showReplaceDeviceDialog: false,
                loadingStatus: LoadingStatus.NOVISIBLE,
                errorStatus: ErrorStatus.GET_FREE_DISK_FAILED,
                errorMsg: error.expMsg ? error.expMsg : error
            })
        }

    }

    /**
     * 确认替换设备
     */
    protected async handleConfirmReplaceDevices(old_device, new_dev) {
        this.setState({
            showReplaceDeviceDialog: false,
        })
        try {
            this.setState({
                loadingStatus: LoadingStatus.REPLACING
            })
            let res = await ECMSManagerClient.replace_device_in_pool(old_device.dev_id, new_dev.disk_dev_path);

            // 更新存储池信息
            let { storagePoolInfo, replicasHealth, storagePoolNodeInfo, storagePoolDevices, isSomeDeviceOffline, loadingStatus } = await this.handleGetStoragePoolInfo();
            this.setState({
                storagePoolInfo,
                replicasHealth,
                storagePoolNodeInfo,
                storagePoolDevices,
                isSomeDeviceOffline,
                loadingStatus
            }, () => {
                // 记日志
                manageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_SET'],
                    msg: __('使用新设备“${old_dev}”替换设备“${new_dev}” 成功', { old_dev: old_device.dev_name, new_dev: new_dev.dev_name }),
                    exMsg: '',
                })
            })

        } catch (error) {
            this.setState({
                errorStatus: ErrorStatus.REPLACE_FAILED,
                loadingStatus: LoadingStatus.NOVISIBLE,
                errorMsg: error.expMsg ? error.expMsg : error
            })
        }


    }

    /**
     * 取消替换设备
     */
    protected handleCancelReplaceDevices() {
        this.setState({
            showReplaceDeviceDialog: false,
            waitForReplacedDevice: {}
        })
    }
    /**
     * 点击移除存储设备按钮
     */
    protected handleDeleteDevice(device) {
        this.setState({
            waitForDeleteDevice: device,
            warningStatus: WarningStatus.DELETE_DISK,
        })
    }

    /**
     * 点击警告提示框确认按钮
     */
    protected handleConfirmConfirmDialog() {
        let { warningStatus } = this.state;
        this.setState({
            warningStatus: WarningStatus.NOVISIBLE

        }, async () => {
            switch (warningStatus) {
                case WarningStatus.BALANCE:
                    try {
                        this.setState({
                            loadingStatus: LoadingStatus.BALANCING,
                        })
                        await ECMSManagerClient.rebalance_storage_pool();

                        // 更新存储池信息
                        let { storagePoolInfo, replicasHealth, storagePoolNodeInfo, storagePoolDevices, isSomeDeviceOffline, loadingStatus } = await this.handleGetStoragePoolInfo();
                        this.setState({
                            storagePoolInfo,
                            replicasHealth,
                            storagePoolNodeInfo,
                            storagePoolDevices,
                            isSomeDeviceOffline,
                            loadingStatus
                        }, () => {
                            this.context.toast(__('重载成功'), { code: '\uf02f', size: 24, color: 'green' })

                            // 记日志
                            manageLog({
                                level: ncTLogLevel['NCT_LL_INFO'],
                                opType: ncTManagementType['NCT_MNT_SET'],
                                msg: __('执行 存储池重新负载均衡 成功'),
                                exMsg: '',
                            })

                        })


                    } catch (error) {
                        this.setState({
                            loadingStatus: LoadingStatus.NOVISIBLE,
                            errorStatus: ErrorStatus.BALANCE_FAILED,
                            errorMsg: error.expMsg ? error.expMsg : error
                        })
                    }

                    break;
                case WarningStatus.DELETE_DISK:
                    try {
                        this.setState({
                            loadingStatus: LoadingStatus.REMOVING,
                        })
                        let res = await ECMSManagerClient.remove_device_from_pool(this.state.waitForDeleteDevice.swift_device.dev_id);
                        // 更新存储池信息
                        let { storagePoolInfo, replicasHealth, storagePoolNodeInfo, storagePoolDevices, isSomeDeviceOffline, loadingStatus } = await this.handleGetStoragePoolInfo();
                        this.setState({
                            storagePoolInfo,
                            replicasHealth,
                            storagePoolNodeInfo,
                            storagePoolDevices,
                            isSomeDeviceOffline,
                            loadingStatus
                        }, () => {
                            this.context.toast(__('重载成功'), { code: '\uf02f', size: 24, color: 'green' })

                            // 记日志
                            manageLog({
                                level: ncTLogLevel['NCT_LL_INFO'],
                                opType: ncTManagementType['NCT_MNT_DELETE'],
                                msg: __('移除 存储池内设备“${dev}” 成功', { dev: this.state.waitForDeleteDevice.swift_device.dev_name }),
                                exMsg: '',
                            })


                        })

                    } catch (error) {
                        this.setState({
                            loadingStatus: LoadingStatus.NOVISIBLE,
                            errorStatus: ErrorStatus.REMOVE_FAILED,
                            errorMsg: error.expMsg ? error.expMsg : error
                        })
                    }
                    break;
                case WarningStatus.EMPTY_DISKS:
                    try {
                        this.setState({
                            loadingStatus: LoadingStatus.REMOVING,
                        })
                        let res = await ECMSManagerClient.remove_node_devices_from_pool(this.state.waitForDeleteDevice.node_ip);

                        // 更新存储池信息
                        let { storagePoolInfo, replicasHealth, storagePoolNodeInfo, storagePoolDevices, isSomeDeviceOffline, loadingStatus } = await this.handleGetStoragePoolInfo();
                        this.setState({
                            storagePoolInfo,
                            replicasHealth,
                            storagePoolNodeInfo,
                            storagePoolDevices,
                            isSomeDeviceOffline,
                            loadingStatus
                        }, () => {
                            this.context.toast(__('重载成功'), { code: '\uf02f', size: 24, color: 'green' })

                            // 记日志
                            manageLog({
                                level: ncTLogLevel['NCT_LL_INFO'],
                                opType: ncTManagementType['NCT_MNT_DELETE'],
                                msg: __('移除 ${ip}上的所有设备“${devs}” 成功', { ip: this.state.waitForDeleteDevice.node_ip, devs: _.values(this.state.pendingEmptyingDevices).join(',') }),
                                exMsg: '',
                            })


                        })

                    } catch (error) {
                        this.setState({
                            loadingStatus: LoadingStatus.NOVISIBLE,
                            errorStatus: ErrorStatus.REMOVE_FAILED,
                            errorMsg: error.expMsg ? error.expMsg : error
                        })
                    }
                    break;
                default:
                    break;
            }
        })
    }

    /**
     * 点击警告提示框取消按钮
     */
    protected handleCancelConfirmDialog() {
        this.setState({
            warningStatus: WarningStatus.NOVISIBLE
        })
    }

    /**
     * 点击错误提示框确认按钮
     */
    protected handleConfirmErrorDialog() {
        this.setState({
            errorStatus: ErrorStatus.NOVISIBLE
        })
    }

    /**
     * 获取存储池节点、存储池设备等信息
     */
    private async handleGetStoragePoolInfo() {

        // 如果已经初始化过，执行获取存储池信息请求
        let storagePoolInfo = await ECMSManagerClient.get_storage_pool(true);

        // 执行获取存储池副本健康度请求
        let replicasHealth = -99

        try {
            // TODO 获取副本健康度耗时20s以上，改成异步显示
            replicasHealth = await ECMSManagerClient.get_replicas_health();
        } catch (error) {
            replicasHealth = -1.0;
            this.setState({
                errorStatus: ErrorStatus.LOADING_FAILED,
                errorMsg: error.expMsg ? error.expMsg : error

            })
        }

        // 执行获取存储节点请求
        let storagePoolNodeInfo = await ECMSManagerClient.get_storage_node_info();

        // 如果存储节点不存在，则不再继续请求存储设备
        if (storagePoolNodeInfo.length === 0 || !storagePoolNodeInfo) {

            return {
                storagePoolInfo,
                replicasHealth,
                storagePoolNodeInfo,
                storagePoolDevices: {},
                isSomeDeviceOffline: false,
                loadingStatus: LoadingStatus.NOVISIBLE,
            }
        }

        // 遍历存储节点，执行获取存储设备请求
        let storagePoolDevices = {};
        // 遍历存储节点，执行获取存储设备请求
        let isOffline = false;
        for (let i = 0; i < storagePoolNodeInfo.length; i++) {
            let devices = await ECMSManagerClient.get_storage_pool_devices(storagePoolNodeInfo[i].node_ip);
            _.keys(devices).map(dev => {
                if (!devices[dev].data_volume || _.keys(devices[dev].data_volume).length === 0 || !devices[dev].data_volume.mount_path) {
                    isOffline = true
                }
            })
            storagePoolDevices[storagePoolNodeInfo[i].node_ip] = devices;
        }

        return {
            storagePoolInfo,
            replicasHealth,
            storagePoolNodeInfo,
            storagePoolDevices,
            isSomeDeviceOffline: isOffline,
            loadingStatus: LoadingStatus.NOVISIBLE,
        }


    }

    /**
     * 确认变更添加存储设备，刷新页面
     */
    protected async handleConfirmAddDevices(waitForAddFreeDevices, shouldAddAllDevices) {
        this.setState({
            loadingStatus: LoadingStatus.ADDING,
            showAddDevicesDialog: false
        })

        // 执行添加设备请求
        try {

            let devs = {};

            for (let i = 0; i < this.state.storagePoolNodeInfo.length; i++) {
                let node_ip = this.state.storagePoolNodeInfo[i].node_ip;
                if (!waitForAddFreeDevices[node_ip] || waitForAddFreeDevices[node_ip] && !waitForAddFreeDevices[node_ip].length) {
                    continue;
                }

                let params = node_ip.toString();
                devs[params] = _.values(waitForAddFreeDevices[node_ip]).map((dev) => { return dev.disk_dev_path })
                // 添加设备到存储池
            }
            if (_.keys(devs).length !== 0) {
                await ECMSManagerClient.add_devices_to_pool(devs)
            }



            // 更新存储池信息
            let { storagePoolInfo, replicasHealth, storagePoolNodeInfo, storagePoolDevices, isSomeDeviceOffline, loadingStatus } = await this.handleGetStoragePoolInfo();
            this.setState({
                storagePoolInfo,
                replicasHealth,
                storagePoolNodeInfo,
                storagePoolDevices,
                isSomeDeviceOffline,
                loadingStatus
            }, () => {
                this.context.toast(__('添加成功'), { code: '\uf02f', size: 24, color: 'green' })

                // 记日志
                manageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_ADD'],
                    msg: __('添加 设备${devMsg}到存储池 成功', {
                        devMsg: _.keys(waitForAddFreeDevices).map((node_ip) => {
                            let params = node_ip.toString();
                            let devs = _.values(waitForAddFreeDevices[node_ip]).map((dev) => { return dev.disk_dev_path })
                            return `“${params}:${devs.join(',')}”`
                        }).join(',')
                    }),
                    exMsg: '',
                })
            })

        } catch (error) {
            this.setState({
                loadingStatus: LoadingStatus.NOVISIBLE,
                errorStatus: ErrorStatus.ADD_FAILED,
                errorMsg: error.expMsg ? error.expMsg : error

            })
        }


    }

    /**
     * 取消变更添加存储设备
     */
    protected handleCancelAddDevices() {
        this.setState({
            showAddDevicesDialog: false
        })
    }

    /**
     * 点击负载均衡按钮
     */
    protected handleClickOverloadBalanceBtn() {
        this.setState({
            warningStatus: WarningStatus.BALANCE
        })
    }

    /**
     * 更新副本模式
     */
    protected async handleUpdateStrategyMode(mode) {
        let { storagePoolInfo } = this.state;
        this.setState({
            loadingStatus: LoadingStatus.MODIFYING,
            showStorageStrategyDialog: false
        })
        if (storagePoolInfo.ring.replicas !== mode.mode) {
            try {
                await ECMSManagerClient.change_replicas(mode.mode);
                // 更新存储池信息
                let { storagePoolInfo, replicasHealth, storagePoolNodeInfo, storagePoolDevices, isSomeDeviceOffline, loadingStatus } = await this.handleGetStoragePoolInfo();
                this.setState({
                    storagePoolInfo,
                    replicasHealth,
                    storagePoolNodeInfo,
                    storagePoolDevices,
                    isSomeDeviceOffline,
                    loadingStatus
                }, () => {
                    this.context.toast(__('修改成功'), { code: '\uf02f', size: 24, color: 'green' })
                    manageLog({
                        level: ncTLogLevel['NCT_LL_INFO'],
                        opType: ncTManagementType['NCT_MNT_SET'],
                        msg: __('修改 系统存储策略为“3副本模式”成功'),
                        exMsg: '',
                    })
                });

            } catch (error) {
                this.setState({
                    loadingStatus: LoadingStatus.NOVISIBLE,
                    errorStatus: ErrorStatus.MODIFY_FAILED,
                    errorMsg: error.expMsg ? error.expMsg : error
                })
            }

        } else {
            storagePoolInfo.ring.replicas = mode.mode;
            this.setState({
                storagePoolInfo,
                loadingStatus: LoadingStatus.NOVISIBLE,
            })
        }


    }

    /**
     * 取消更新副本模式
     */
    protected handleCancelUpdateStrategyMode() {
        this.setState({
            showStorageStrategyDialog: false
        })
    }

    /**
     * 利用highcharts渲染生成饼状图
     */
    protected renderCreateHighCharts(id, used_size_gb, capacity_gb) {

        if (this.state.isSomeDeviceOffline) {
            return;
        }
        const usage = [
            {
                y: used_size_gb
            },
            {
                y: capacity_gb === 0 ? 1 : capacity_gb - used_size_gb
            }
        ]

        Highcharts.chart(id, {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                height: 150,
                width: 150,
                backgroundColor: '#fff'
            },
            credits: {
                enabled: false
            },
            title: {
                text: null
            },
            tooltip: {
                enabled: false
            },
            colors: id === 'physical_pie' ? ['#00b3d9', '#dedede'] : ['#517dde', '#dedede'],
            plotOptions: {
                pie: {
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    }
                }
            },
            series: [{
                data: usage,
            }]
        });
    }

    /**
     * 关闭信息提示框
     */
    protected handleConfirmMessageDialog() {
        this.setState({
            confirmStatus: ConfirmStatus.NOVISIBLE
        })
    }

    /**
     * 初始化完成
     */
    protected handleInitSucceed() {
        this.setState({
            storageInitStatus: InitStatus.INITED,
            loadingStatus: LoadingStatus.LOADING
        }, async () => {
            let { storageInitStatus } = this.state;
            if (storageInitStatus === InitStatus.INITED) {
                // 向父容器抛出初始化状态
                this.props.onInitedSucceed();

                // 更新存储池信息
                let { storagePoolInfo, replicasHealth, storagePoolNodeInfo, storagePoolDevices, isSomeDeviceOffline, loadingStatus } = await this.handleGetStoragePoolInfo();
                this.setState({
                    storagePoolInfo,
                    replicasHealth,
                    storagePoolNodeInfo,
                    storagePoolDevices,
                    isSomeDeviceOffline,
                    loadingStatus
                }, () => {
                    this.context.toast(__('初始化成功'), { code: '\uf02f', size: 24, color: 'green' })
                })
            }
        })
    }

}
