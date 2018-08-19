import * as React from 'react'
import * as classnames from 'classnames'
import { Tabs } from '../../ui/ui.desktop'
import Device from '../NodeManagement.Device/component.view'
import RAID from '../NodeManagement.RAID/component.view'
import * as styles from './styles.desktop.css'
import __ from './locale'

const NodeManagement: React.StatelessComponent<Console.NodeManagement.Props> = ({
    node,
}) => (
        <div className={styles['container']}>
            <Tabs>
                <Tabs.Navigator
                    className={styles['navigator']}
                >
                    <Tabs.Tab
                        active={true}
                        className={classnames(styles['tab'], styles['device'])}
                    >
                        {__('设备管理')}
                    </Tabs.Tab>
                    <Tabs.Tab
                        className={styles['tab']}
                    >
                        {__('RAID管理')}
                    </Tabs.Tab>
                </Tabs.Navigator>

                <Tabs.Main
                    className={styles['tab-main']}
                >
                    <Tabs.Content
                        className={styles['tab-content']}
                    >
                        <Device
                            node={node}
                        />
                    </Tabs.Content>
                    <Tabs.Content
                        className={styles['tab-content']}
                    >
                        <RAID
                            node={node}
                        />
                    </Tabs.Content>
                </Tabs.Main>
            </Tabs>
        </div>
    )

export default NodeManagement
