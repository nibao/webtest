import * as React from 'react'
import { DataGrid, Button, Text } from '../../../ui/ui.desktop'
import { formatSize } from '../../../util/formatters/formatters'
import DetailsDialog from '../DetailsDialog/component.view'
import InitAsRAID from './InitAsRAID/component.view'
import SetAsHotSpare from './SetAsHotSpare/component.view'
import IdleDeviceBase from './component.base'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class IdleDevice extends IdleDeviceBase {
    render() {
        const { node } = this.props
        const { idleDeviceArr, selection, details, diskID, showInitRAIDDialog, showSetAsHotSpareDialog } = this.state
        return (
            <div
                className={styles['wrapper']}
            >
                <div
                    className={styles['button-part']}
                >
                    <Button
                        icon={'\uf0bf'}
                        theme={selection && selection.length >= 1 ? 'dark' : 'regular'}
                        disabled={selection && selection.length >= 1 ? false : true}
                        onClick={() => { this.handleInitRAIDClick() }}
                    >
                        {__('初始化RAID')}
                    </Button>
                    <Button
                        icon={'\uf0c0'}
                        theme={selection && selection.length === 1 ? 'dark' : 'regular'}
                        disabled={selection && selection.length === 1 ? false : true}
                        className={styles['hot-spare']}
                        onClick={() => { this.handleSetHotSpareClick() }}
                    >
                        {__('设为热备盘')}
                    </Button>
                </div>
                <p
                    className={styles['category']}
                >
                    {__('物理磁盘')}
                </p>

                <DataGrid
                    data={idleDeviceArr}
                    select={{ multi: true }}
                    onSelectionChange={(selection) => { this.handleSelectionChange(selection) }}
                >
                    <DataGrid.Field
                        field="pd_devid"
                        label={__('设备ID')}
                        width="100"
                        formatter={(pd_devid) => (
                            <Text className={styles['text']}>
                                {pd_devid}
                            </Text>
                        )}
                    />
                    <DataGrid.Field
                        field="capacity_gb"
                        label={__('容量')}
                        width="100"
                        formatter={(capacity_gb) => (
                            <Text className={styles['text']}>
                                {formatSize(capacity_gb * Math.pow(1024, 3))}
                            </Text>
                        )}
                    />
                    <DataGrid.Field
                        field="firmware_state"
                        label={__('Firmware状态')}
                        width="150"
                        formatter={(firmware_state) => (
                            <Text className={styles['text']}>
                                {firmware_state}
                            </Text>
                        )}
                    />
                    <DataGrid.Field
                        field="foreign_state"
                        label={__('Foreign状态')}
                        width="100"
                        formatter={(foreign_state) => (
                            <Text className={styles['text']}>
                                {foreign_state}
                            </Text>
                        )}
                    />
                    <DataGrid.Field
                        field="details"
                        label={__('详情')}
                        width="50"
                        formatter={(details, record) => (

                            <span
                                className={styles['show']}
                                onClick={() => { this.showDetails(record) }}
                            >

                                {__('查看')}
                            </span>

                        )}
                    />
                </DataGrid>

                {
                    diskID !== '' && details ?
                        (
                            <DetailsDialog
                                id={diskID}
                                details={details}
                                onDetailClose={() => { this.colseDetailsDialog() }}
                            />
                        ) : null
                }

                {
                    showInitRAIDDialog ?
                        (
                            <InitAsRAID
                                node={node}
                                disks={selection}
                                onInitRAIDCancel={() => { this.setState({ showInitRAIDDialog: false }) }}
                                onInitRAIDFail={() => { this.setState({ showInitRAIDDialog: false }) }}
                                onInitRAIDSuccess={(physicalDisk, logicDisk) => { this.confirmInitRAIDSuccess(physicalDisk, logicDisk) }}
                            />
                        ) : null
                }

                {
                    showSetAsHotSpareDialog ?
                        (
                            <SetAsHotSpare
                                node={node}
                                disks={selection}
                                onSetHotSpareCancel={() => { this.setState({ showSetAsHotSpareDialog: false }) }}
                                onSetHotSpareFail={() => { this.setState({ showSetAsHotSpareDialog: false }) }}
                                onSetHotSpareSuccess={(physicalDisk) => { this.confirmSetAsHotSpareSuccess(physicalDisk) }}
                            />
                        ) : null
                }
            </div >
        )
    }
}

