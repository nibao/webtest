import * as React from 'react'
import { DataGrid, ConfirmDialog, ProgressCircle, Text, InlineButton } from '../../../ui/ui.desktop'
import { formatSize } from '../../../util/formatters/formatters'
import HotSpareBase from './component.base'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class HotSpare extends HotSpareBase {
    render() {
        const { hotSpareDisk, deleteInfo, processingDel } = this.state

        return (

            <div
                className={styles['wrapper']}
            >
                <p
                    className={styles['category']}
                >
                    {__('物理磁盘')}
                </p>
                <DataGrid
                    data={hotSpareDisk}
                    headless={false}
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
                        width="100"
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
                        field="ld_devid"
                        label={__('关联逻辑设备')}
                        width="100"
                        formatter={(ld_devid) => (
                            <Text className={styles['text']}>
                                {
                                    ld_devid === ''
                                        ?
                                        (
                                            __('全局')
                                        )
                                        :
                                        (
                                            ld_devid
                                        )
                                }
                            </Text>
                        )}
                    />
                    <DataGrid.Field
                        field="operate"
                        label={__('操作')}
                        width="50"
                        formatter={(operate, record) => (
                            <InlineButton
                                code={'\uf014'}
                                size={16}
                                title={__('移除')}
                                onClick={() => { this.delDialog(record) }}
                            />
                        )}
                    />
                </DataGrid>

                {
                    deleteInfo ?
                        (
                            <ConfirmDialog
                                onConfirm={() => { this.deleteHotSpare() }}
                                onCancel={() => { this.setState({ deleteInfo: null }) }}
                            >
                                {__('移除热备盘可能造成系统风险，您确定要执行此操作吗？')}
                            </ConfirmDialog>
                        ) : null
                }

                {
                    processingDel ?
                        (
                            <ProgressCircle
                                detail={__('正在移除，请稍候......')}
                            />
                        ) : null
                }
            </div>
        )
    }
}