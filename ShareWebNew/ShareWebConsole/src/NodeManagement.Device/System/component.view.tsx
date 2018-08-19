import * as React from 'react'
import { Form } from '../../../ui/ui.desktop'
import { formatSize, formatRate } from '../../../util/formatters/formatters'
import SystemBase from './component.base'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class System extends SystemBase {
    render() {
        const { cpuUsage, memoryInfo, networkOutgoingRate, networkIncomingRate, sysVolume, cacheVolume } = this.props

        return (
            <div
                className={styles['system-wrapper']}
            >
                <div
                    className={styles['text-content']}
                >
                    <Form>
                        <Form.Row>
                            <Form.Label>
                                <div
                                    className={styles['name']}
                                >
                                    {__('CPU使用率：')}
                                </div>
                            </Form.Label>
                            <Form.Field>
                                <div
                                    className={styles['value']}
                                >
                                    {
                                        cpuUsage !== undefined
                                            ?
                                            cpuUsage === -1
                                                ?
                                                '--'
                                                :
                                                `${cpuUsage.toFixed(2)}%`
                                            : null
                                    }
                                </div>
                            </Form.Field>
                        </Form.Row>

                        <Form.Row>
                            <Form.Label>
                                <div
                                    className={styles['name']}
                                >
                                    {__('内存使用率：')}
                                </div>
                            </Form.Label>
                            <Form.Field>
                                <div
                                    className={styles['value']}
                                >
                                    {
                                        memoryInfo !== undefined
                                            ?
                                            memoryInfo.usage === -1
                                                ?
                                                '--'
                                                :
                                                `${((memoryInfo.usage / memoryInfo.total) * 100).toFixed(2)}% (${formatSize(memoryInfo.usage)}/${formatSize(memoryInfo.total)})`
                                            : null
                                    }
                                </div>
                            </Form.Field>
                        </Form.Row>

                        <Form.Row>
                            <Form.Label>
                                <div
                                    className={styles['name']}
                                >
                                    {__('网络发送：')}
                                </div>
                            </Form.Label>
                            <Form.Field>
                                <div
                                    className={styles['value']}
                                >
                                    {networkOutgoingRate !== undefined
                                        ?
                                        networkOutgoingRate === -1
                                            ?
                                            '--'
                                            :
                                            (
                                                formatRate(networkOutgoingRate)
                                            )
                                        : null
                                    }
                                </div>
                            </Form.Field>
                        </Form.Row>

                        <Form.Row>
                            <Form.Label>
                                <div
                                    className={styles['name']}
                                >
                                    {__('网络接收：')}
                                </div>
                            </Form.Label>
                            <Form.Field>
                                <div
                                    className={styles['value']}
                                >
                                    {networkIncomingRate !== undefined
                                        ?
                                        networkIncomingRate === -1
                                            ?
                                            '--'
                                            :
                                            formatRate(networkIncomingRate)
                                        : null
                                    }
                                </div>
                            </Form.Field>
                        </Form.Row>

                    </Form>
                </div>



                <div
                    className={styles['pie-wrapper']}
                >
                    <div
                        id="systemDisk"
                        className={styles['pie']}
                    >
                    </div>

                    <div
                        className={styles['tips']}
                    >
                        {
                            sysVolume
                                ?
                                (
                                    <div>
                                        <div>
                                            <span>
                                                {__('系统卷使用率：')}
                                            </span>
                                            <span
                                                className={styles['usage']}
                                            >
                                                {`${((sysVolume['used_size_gb'] / sysVolume['capacity_gb']) * 100).toFixed(2)}%`}
                                            </span>
                                        </div>
                                        <div>
                                            {`${formatSize(sysVolume['used_size_gb'] * Math.pow(1024, 3))}/${formatSize(sysVolume['capacity_gb'] * Math.pow(1024, 3))}`}
                                        </div>
                                    </div>
                                ) : null
                        }
                    </div>
                </div>

                <div
                    className={styles['pie-wrapper']}
                >
                    <div
                        id="cacheDisk"
                        className={styles['pie']}
                    >
                    </div>

                    <div
                        className={styles['tips']}
                    >
                        {
                            cacheVolume && cacheVolume['capacity_gb'] !== 0 && cacheVolume['used_size_gb'] !== -1
                                ?
                                (
                                    <div>
                                        <div>
                                            <span>
                                                {__('缓存卷使用率：')}
                                            </span>
                                            <span
                                                className={styles['usage']}
                                            >
                                                {`${((cacheVolume['used_size_gb'] / cacheVolume['capacity_gb']) * 100).toFixed(2)}%`}
                                            </span>
                                        </div>
                                        <div>
                                            {`${formatSize(cacheVolume['used_size_gb'] * Math.pow(1024, 3))}/${formatSize(cacheVolume['capacity_gb'] * Math.pow(1024, 3))}`}
                                        </div>
                                    </div>
                                ) : null
                        }
                    </div>
                </div>
                <div
                    id="cacheDisk"
                    className={styles['cache-disk-pie']}
                ></div>
            </div>
        )
    }
}