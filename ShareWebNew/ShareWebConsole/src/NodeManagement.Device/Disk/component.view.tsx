import * as React from 'react'
import { DataGrid, Text } from '../../../ui/ui.desktop'
import { formatSize } from '../../../util/formatters/formatters'
import { USAGE } from '../helper'
import * as styles from './styles.desktop.css'
import __ from './locale'

/**
 * 根据use属性，展示相应的磁盘用途
 */
function showUsage(use: number): string {
    switch (use) {
        case USAGE.System:
            return __('系统');
        case USAGE.Cache:
            return __('缓存');
        case USAGE.Storage:
            return __('存储');
        case USAGE.Sysvol:
            return `Sysvol`;
        default:
            return __('空闲');
    }
}
const Disk: React.StatelessComponent<Console.NodeManagementDevice.Disk.Props> = ({
    diskDevices
}) => (
        <div
            className={styles['disk-wrapper']}
        >
            <DataGrid
                data={diskDevices}
                headless={false}
            >
                <DataGrid.Field
                    field="disk_dev_path"
                    label={__('路径')}
                    width="100"
                    formatter={(disk_dev_path) => (
                        <Text className={styles['text']}>
                            {disk_dev_path}
                        </Text>

                    )}
                />

                <DataGrid.Field
                    field="capacity_gb"
                    label={__('总容量')}
                    width="100"
                    formatter={(capacity_gb) => (
                        <Text className={styles['text']}>
                            {formatSize(capacity_gb * Math.pow(1024, 3))}
                        </Text>
                    )}
                />

                <DataGrid.Field
                    field="used_size_gb"
                    label={__('可用容量')}
                    width="100"
                    formatter={(used_size_gb, data) => (
                        <Text className={styles['text']}>
                            {
                                data.use === USAGE.Storage || data.use === USAGE.Sysvol
                                    ?
                                    (
                                        formatSize((data['capacity_gb'] - used_size_gb) * Math.pow(1024, 3))
                                    )
                                    :
                                    (
                                        '--'
                                    )
                            }
                        </Text>
                    )}
                />
                <DataGrid.Field
                    field="disk_model"
                    label={__('类型')}
                    width="100"
                    formatter={(disk_model) => (
                        <Text className={styles['text']}>
                            {disk_model}
                        </Text>
                    )}
                />
                <DataGrid.Field
                    field="use"
                    label={__('用途')}
                    width="100"
                    formatter={(use) => (
                        <Text className={styles['text']}>
                            {
                                showUsage(use)
                            }
                        </Text>
                    )}
                />
            </DataGrid>
        </div>
    )

export default Disk



