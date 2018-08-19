import * as React from 'react'
import { ProgressCircle, Fold } from '../../ui/ui.desktop'
import RAIDInfo from './RAIDInfo/component.view'
import HotSpare from './HotSpare/component.view'
import IdleDevice from './IdleDevice/component.view'
import RAIDBase from './component.base'
import * as noRaid from './assets/noRaid.png'
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class RAID extends RAIDBase {
    render() {
        const { node } = this.props
        const { hasRAID, openRAIDInfo, openHotSpare, openIdleDevice, physicalDisk, logicDisk } = this.state

        return (
            <div>
                {
                    hasRAID !== null
                        ?
                        (
                            hasRAID === true
                                ?
                                (
                                    <div className={styles['wrapper']} >
                                        <Fold
                                            label={__('RAID信息')}
                                            open={openRAIDInfo}
                                            labelProps={{ className: styles['label-style'] }}
                                            onToggle={() => { this.setState({ openRAIDInfo: !openRAIDInfo }) }}
                                        >
                                            <RAIDInfo
                                                node={node}
                                                physicalDisk={physicalDisk}
                                                logicDisk={logicDisk}
                                            />
                                        </Fold>

                                        <Fold
                                            label={__('热备盘')}
                                            open={openHotSpare}
                                            labelProps={{ className: styles['label-style'] }}
                                            onToggle={() => { this.setState({ openHotSpare: !openHotSpare }) }}
                                        >
                                            <HotSpare
                                                node={node}
                                                physicalDisk={physicalDisk}
                                                doDelHotSpareSuccess={(physicalDisk) => { this.handleModifySuccess(physicalDisk) }}
                                            />
                                        </Fold>

                                        <Fold
                                            label={__('空闲物理设备')}
                                            open={openIdleDevice}
                                            labelProps={{ className: styles['label-style'] }}
                                            onToggle={() => { this.setState({ openIdleDevice: !openIdleDevice }) }}
                                        >
                                            {
                                                openIdleDevice ?
                                                    <IdleDevice
                                                        node={node}
                                                        physicalDisk={physicalDisk}
                                                        onInitRAIDSuccess={(physicalDisk, logicDisk) => { this.handleModifySuccess(physicalDisk, logicDisk) }}
                                                        onSetAsHotSpareSuccess={(physicalDisk) => { this.handleModifySuccess(physicalDisk) }}
                                                    />
                                                    :
                                                    null
                                            }
                                        </Fold>
                                    </div>
                                )
                                :
                                (
                                    <div
                                        className={styles['no-raid']}
                                    >
                                        <img src={noRaid} />
                                        <p
                                            className={styles['p']}
                                        >
                                            {__('该节点内未识别到RAID设备。')}
                                        </p>
                                    </div>

                                )
                        )
                        :
                        (
                            <ProgressCircle
                                detail={__('正在加载，请稍候......')}
                            />
                        )
                }
            </div>
        )
    }
}