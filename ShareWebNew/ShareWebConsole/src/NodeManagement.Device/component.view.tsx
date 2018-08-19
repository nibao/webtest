import * as React from 'react'
import { ProgressCircle, Fold } from '../../ui/ui.desktop'
import System from './System/component.view'
import Disk from './Disk/component.view'
import DeviceBase from './component.base'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class Device extends DeviceBase {
    render() {
        const { processingInit, openSystem, openDisk, cpuUsage, memoryInfo, networkOutgoingRate, networkIncomingRate, sysVolume, cacheVolume, diskDevices } = this.state

        return (
            <div>
                {
                    processingInit
                        ?
                        (
                            <ProgressCircle
                                detail={__('正在加载，请稍候......')}
                            />
                        )
                        :
                        (
                            <div className={styles['wrapper']}>
                                <Fold
                                    label={__('系统设备')}
                                    open={openSystem}
                                    labelProps={{ className: styles['label-style'] }}
                                    onToggle={() => { this.setState({ openSystem: !openSystem }) }}
                                >
                                    <System
                                        cpuUsage={cpuUsage}
                                        memoryInfo={memoryInfo}
                                        networkOutgoingRate={networkOutgoingRate}
                                        networkIncomingRate={networkIncomingRate}
                                        sysVolume={sysVolume}
                                        cacheVolume={cacheVolume}
                                    />
                                </Fold>

                                <Fold
                                    label={__('磁盘设备')}
                                    open={openDisk}
                                    labelProps={{ className: styles['label-style'] }}
                                    onToggle={() => { this.handleDiskDevicesToggle() }}
                                >
                                    <Disk
                                        diskDevices={diskDevices}
                                    />
                                </Fold>
                            </div >
                        )
                }
            </div>
        )
    }
}