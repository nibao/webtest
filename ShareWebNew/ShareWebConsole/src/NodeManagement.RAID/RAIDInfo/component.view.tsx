import * as React from 'react'
import { pairs } from 'lodash'
import * as classnames from 'classnames'
import { Text } from '../../../ui/ui.desktop'
import { formatSize } from '../../../util/formatters/formatters'
import DetailsDialog from '../DetailsDialog/component.view'
import RAIDInfoBase from './component.base'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class RAIDInfo extends RAIDInfoBase {
    render() {
        const { diskID, details } = this.state
        const { physicalDisk, logicDisk } = this.props
        return (
            <div
                className={styles['wrapper']}
            >
                <table className={styles['table']}>
                    <thead>
                        <tr className={styles['category']}>
                            <th colSpan={5} className={styles['physical-category']}>{__('物理磁盘')}</th>
                            <th colSpan={5} className={styles['logic-category']}>{__('逻辑磁盘')}</th>
                        </tr>
                        <tr className={styles['parameter']}>
                            <th className={styles['head-cell']}>{__('设备ID')}</th>
                            <th className={styles['head-cell']}>{__('容量')}</th>
                            <th className={classnames(styles['head-cell'], styles['pd-firmware'])}>{__('Firmware状态')}</th>
                            <th className={styles['head-cell']}>{__('Foreign状态')}</th>
                            <th className={classnames(styles['head-cell'], styles['pd-details'], styles['separated'])}>{__('详情')}</th>
                            <th className={styles['head-cell']}>{__('设备ID')}</th>
                            <th className={styles['head-cell']}>{__('RAID容量')}</th>
                            <th className={styles['head-cell']}>{__('RAID级别')}</th>
                            <th className={styles['head-cell']}>{__('状态')}</th>
                            <th className={styles['head-cell']}>{__('详情')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pairs(logicDisk).reduce((preTrs, [ld_devid, { capacity_gb, raid_level, state, pd_devid_list }]) => {
                                return [
                                    ...preTrs,
                                    ...pd_devid_list.map((pd_devid, i) => {
                                        const pd_dev = physicalDisk[pd_devid]
                                        return (
                                            <tr className={styles['rows']}>
                                                <td className={styles['body-cell']}><Text className={styles['text']}>{pd_devid}</Text></td>
                                                <td className={styles['body-cell']}><Text className={styles['text']}>{formatSize(pd_dev.capacity_gb * Math.pow(1024, 3))}</Text></td>
                                                <td className={styles['body-cell']}><Text className={styles['text']}>{pd_dev.firmware_state}</Text></td>
                                                <td className={styles['body-cell']}><Text className={styles['text']}>{pd_dev.foreign_state}</Text></td>
                                                <td className={classnames(styles['body-cell'], styles['separated'])} >
                                                    <span
                                                        className={styles['show']}
                                                        onClick={() => { this.showDetails(pd_devid, 'physical') }}
                                                        title={__('查看')}
                                                    >
                                                        {__('查看')}
                                                    </span>
                                                </td>
                                                {
                                                    i === 0 ? [
                                                        <td className={styles['body-cell']} rowSpan={pd_devid_list.length}><Text className={styles['text']}>{ld_devid}</Text></td>,
                                                        <td className={styles['body-cell']} rowSpan={pd_devid_list.length}><Text className={styles['text']}>{formatSize(capacity_gb * Math.pow(1024, 3))}</Text></td>,
                                                        <td className={styles['body-cell']} rowSpan={pd_devid_list.length}><Text className={styles['text']}>{raid_level}</Text></td>,
                                                        <td className={styles['body-cell']} rowSpan={pd_devid_list.length}><Text className={styles['text']}>{state}</Text></td>,
                                                        <td className={styles['body-cell']} rowSpan={pd_devid_list.length}>
                                                            <span
                                                                className={styles['show']}
                                                                onClick={() => { this.showDetails(ld_devid, 'logic') }}
                                                                title={__('查看')}
                                                            >
                                                                {__('查看')}
                                                            </span>
                                                        </td>
                                                    ] : null
                                                }
                                            </tr>
                                        )
                                    })
                                ]
                            }, [])
                        }
                    </tbody>
                </table>

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
            </div >
        )
    }
}
