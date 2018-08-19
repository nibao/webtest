import * as React from 'react';
import * as classnames from 'classnames';
import * as _ from 'lodash';
import Button from '../../../ui/Button/ui.desktop';
import ProgressBar from '../../../ui/ProgressBar/ui.desktop';
import DataGrid from '../../../ui/DataGrid/ui.desktop';
import IconGroup from '../../../ui/IconGroup/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Title from '../../../ui/Title/ui.desktop';
import Fold from '../../../ui/Fold/ui.desktop';
import InlineButton from '../../../ui/InlineButton/ui.desktop';
import { decorateText } from '../../../util/formatters/formatters';
import PoolDevicesListBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';


export default class PoolDevicesList extends PoolDevicesListBase {

    render() {

        let { storagePoolNodeInfo, storagePoolDevices } = this.props;

        let { showPoolDevicesList, deviceSelection } = this.state;

        return (
            <Fold
                label={
                    <span>
                        <span className={classnames(styles['storage-manager-ip-content'])}>
                            {storagePoolNodeInfo.node_ip}
                        </span>
                        <Button
                            className={classnames(styles['storage-manager-empty-icon'])}
                            onClick={(e) => { e.stopPropagation(); this.props.emptyDevicesList(storagePoolNodeInfo, storagePoolDevices) }}
                        >
                            {__('全部移除')}
                        </Button>
                    </span>
                }
                labelProps={{
                    className: styles['storage-manager-ip']
                }}
                open={showPoolDevicesList}
                onToggle={() => { this.handleExpandDeviceList() }}
                className={styles['storage-manager-devices']}
            >

                <div className={classnames(styles['storage-manager-list'])}>
                    <DataGrid
                        data={_.values(storagePoolDevices)}
                        className={styles['storage-manager-list-body']}
                        select={false}
                    >
                        <DataGrid.Field
                            label={__('设备ID')}
                            field="name"
                            width="60"
                            formatter={(name, device) => (
                                <span className={styles['list-name']}>{device.swift_device.dev_id}</span>
                            )}
                        />
                        <DataGrid.Field
                            label={__('设备路径')}
                            field="path"
                            width="90"
                            formatter={(path, device) => {
                                return (
                                    <span className={styles['list-path']}>{_.keys(device.data_volume).length === 0 ? '---' : decorateText(device.data_volume.vol_dev_path, { limit: 10 })}</span>
                                )
                            }}
                        />
                        <DataGrid.Field
                            label={__('Region')}
                            field="region"
                            width="50"
                            formatter={(region, device) => {
                                return (
                                    <span className={styles['list-region']}>{device.swift_device.region}</span>
                                )
                            }}
                        />
                        <DataGrid.Field
                            label={__('Zone')}
                            field="zone"
                            width="50"
                            formatter={(zone, device) => {
                                return (
                                    <span className={styles['list-zone']}>{device.swift_device.zone}</span>
                                )
                            }}
                        />
                        <DataGrid.Field
                            label={__('Weight')}
                            field="weight"
                            width="50"
                            formatter={(weight, device) => {
                                return (
                                    <span className={styles['list-weight']}>{device.swift_device.weight}</span>
                                )
                            }}
                        />
                        <DataGrid.Field
                            label={__('负载均衡状态')}
                            field="balance"
                            width="100"
                            formatter={(balance, device) => {
                                return (
                                    <span>{device.swift_device.balance}</span>
                                )
                            }}
                        />
                        <DataGrid.Field
                            label={__('空间使用情况')}
                            field="size"
                            width="140"
                            formatter={(size, device) => {
                                return (
                                        <ProgressBar
                                            value={this.getRate(device)}
                                            renderValue={(value) => this.getQuotaText(device)}
                                        />
                                )
                            }}
                        />
                        <DataGrid.Field
                            label={__('设备名称')}
                            field="dev"
                            width="230"
                            formatter={(dev, device) => {
                                return (
                                    <span className={styles['list-device']}>
                                        <Title
                                            content={device.swift_device.dev_name}
                                        >
                                            {decorateText(device.swift_device.dev_name, { limit: 30 })}
                                        </Title>


                                    </span>
                                )
                            }}
                        />
                        <DataGrid.Field
                            label={__('状态')}
                            field="status"
                            width="50"
                            formatter={(status, device) => {
                                return (
                                    <span className={classnames(styles['list-status'], { [styles['font-color-green']]: this.chargeIfDeviceOnline(device), [styles['font-color-red']]: !this.chargeIfDeviceOnline(device) })}>
                                        {
                                            this.chargeIfDeviceOnline(device) ?
                                                __('在线')
                                                :
                                                __('离线')
                                        }
                                    </span>
                                )
                            }}
                        />
                        <DataGrid.Field
                            label={__('操作')}
                            field="operation"
                            width="100"
                            formatter={(operation, device) => {
                                return (
                                    <div className={styles['list-operation']}>
                                        <div className={styles['storage-manager-replace-icon']}>
                                            <InlineButton
                                                code={'\uf058'}
                                                fallback={'\uf058'}
                                                title={__('替换设备')}
                                                onClick={() => { this.props.replaceDevice(device) }}
                                            />
                                        </div>
                                        <div className={styles['storage-manager-replace-icon']}>
                                            <InlineButton
                                                code={'\uf0ca'}
                                                fallback={'\uf0ca'}
                                                title={__('移除设备')}
                                                onClick={() => { this.props.deleteDevice(device) }}
                                            />
                                        </div>
                                    </div>

                                )
                            }}
                        />
                    </DataGrid>

                </div>

            </Fold>

        )
    }

    /**
     * 获取百分比
     */
    getRate(device) {
        let s = device.data_volume ?
            isNaN(device.data_volume.used_size_gb / device.data_volume.capacity_gb) ?
                0
                :
                device.data_volume.used_size_gb / device.data_volume.capacity_gb
            :
            0
        return s;
    }

    /**
     * 获取进度文字百分比
     */
    getQuotaText(device) {
        return this.chargeIfDeviceOnline(device) ?
            `${this.formatProgressSize(device.data_volume.used_size_gb)}/${this.formatProgressSize(device.swift_device.capacity_gb)}`
            :
            `--/${this.formatProgressSize(device.swift_device.capacity_gb)}`
    }

    /**
     * 返回 800.34MB / 100.22GB格式的字符串
     * @param size 转换的值
     */
    formatProgressSize(size) {
        if (!size) {
            return '--';
        }
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
     * 判断设备是否已离线
     */
    chargeIfDeviceOnline(device) {
        // 当 data_volume 为 None 或 data_volume.mount_path 为空 时，则该设备在存储池中意味着已离线
        if (!device.data_volume || !device.data_volume.mount_path) {
            return false;
        }


        return true;
    }



}