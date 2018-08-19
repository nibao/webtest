import * as React from 'react'
import { AppNodeStatus } from '../../core/siteupgrade/siteupgrade'
import NoAppNode from './NoAppNode/component.view'
import ServerPackage from './ServerPackage/component.view'
import ServerUpgradeBase from './component.base'
import * as styles from './styles.view.css'

export default class ServerUpgrade extends ServerUpgradeBase {
    renderDetail(appNodeStatus: AppNodeStatus) {
        switch (appNodeStatus) {
            case AppNodeStatus.NoSet:
                return <NoAppNode
                    doRedirectServers={this.props.doRedirectServers}
                />

            case AppNodeStatus.Setup:
                return (
                    <div className={styles['server-package']}>
                        <ServerPackage
                            doSystemDetailRedirect={this.props.doSystemDetailRedirect}
                        />
                    </div>
                )

            default:
                return null
        }
    }

    render() {
        const { appNodeStatus } = this.state

        return (
            this.renderDetail(appNodeStatus)
        )
    }
}