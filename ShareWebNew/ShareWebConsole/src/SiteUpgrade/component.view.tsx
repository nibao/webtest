import * as React from 'react'
import { Tabs } from '../../ui/ui.desktop'
import ServerUpgrade from '../ServerUpgrade/component.view'
import ClientUpgrade from '../ClientUpgrade/component.view'
import SiteUpgradeBase from './component.base'
import __ from './locale'
import * as styles from './styles.view'

export default class SiteUpgrade extends SiteUpgradeBase {
    render() {
        const { doRedirectServers, doSystemDetailRedirect } = this.props
        const { showClientUpgrade } = this.state
        const [ServerUpgradeTab, ServerUpgradeContent] = this.requestServerUpgrade(doRedirectServers, doSystemDetailRedirect)
        const [ClientUpgradeTab, ClientUpgradeContent] = this.requestClientUpgrade(doRedirectServers)

        return (
            showClientUpgrade !== undefined ?
                <div className={styles['container']}>
                    <Tabs>
                        <Tabs.Navigator className={styles['navigator']}>
                            {
                                showClientUpgrade ?
                                    [
                                        ServerUpgradeTab(),
                                        ClientUpgradeTab()
                                    ]
                                    :
                                    [
                                        ServerUpgradeTab()
                                    ]
                            }
                        </Tabs.Navigator>
                        <Tabs.Main className={styles['tabs-main']}>
                            {
                                showClientUpgrade ?
                                    [
                                        ServerUpgradeContent(),
                                        ClientUpgradeContent()
                                    ]
                                    :
                                    [
                                        ServerUpgradeContent()
                                    ]
                            }
                        </Tabs.Main>
                    </Tabs>
                </div>
                :
                null
        )
    }

    private requestServerUpgrade(doRedirectServers, doSystemDetailRedirect) {
        return [
            () => (
                <Tabs.Tab active={true} className={styles['tab-style']}>
                    <div className={styles['tab-font']}>
                        {__('服务器升级')}
                    </div>
                </Tabs.Tab>
            ),
            () => (
                <Tabs.Content className={styles['tabs-content']}>
                    <ServerUpgrade
                        doRedirectServers={doRedirectServers}
                        doSystemDetailRedirect={doSystemDetailRedirect}
                    />
                </Tabs.Content>
            )
        ]
    }

    private requestClientUpgrade(doRedirectServers) {
        return [
            () => (
                <Tabs.Tab className={styles['tab-style']}>
                    <div className={styles['tab-font']}>
                        {__('客户端升级')}
                    </div>
                </Tabs.Tab>
            ),
            () => (
                <Tabs.Content className={styles['tabs-content']}>
                    <ClientUpgrade doRedirectServers={doRedirectServers} />
                </Tabs.Content>
            )
        ]
    }
}