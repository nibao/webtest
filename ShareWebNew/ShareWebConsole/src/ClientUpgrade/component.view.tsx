import * as React from 'react'
import { AppNodeStatus, OsType } from '../../core/siteupgrade/siteupgrade'
import NoAppNode from './NoAppNode/component.view'
import ClientPackage from './ClientPackage/component.view'
import ClientUpgradeBase from './component.base'

export default class ClientUpgrade extends ClientUpgradeBase {

    renderDetail(appNodeStatus: AppNodeStatus, packageinfos: ReadonlyArray<any>) {
        switch (appNodeStatus) {
            case AppNodeStatus.NoSet:
                return <NoAppNode
                    doRedirectServers={this.props.doRedirectServers}
                />

            case AppNodeStatus.Setup:
                return (
                    <div>
                        <ClientPackage
                            osType={OsType.Win32Advanced}
                            packageinfo={packageinfos.filter(({ ostype }) => ostype === OsType.Win32Advanced)[0]}
                        />
                        <ClientPackage
                            osType={OsType.Win64Advanced}
                            packageinfo={packageinfos.filter(({ ostype }) => ostype === OsType.Win64Advanced)[0]}
                        />
                        <ClientPackage
                            osType={OsType.Win32}
                            packageinfo={packageinfos.filter(({ ostype }) => ostype === OsType.Win32)[0]}
                        />
                        <ClientPackage
                            osType={OsType.Win64}
                            packageinfo={packageinfos.filter(({ ostype }) => ostype === OsType.Win64)[0]}
                        />
                        <ClientPackage
                            osType={OsType.Android}
                            packageinfo={packageinfos.filter(({ ostype }) => ostype === OsType.Android)[0]}
                        />
                        <ClientPackage
                            osType={OsType.Mac}
                            packageinfo={packageinfos.filter(({ ostype }) => ostype === OsType.Mac)[0]}
                        />
                    </div>
                )

            default:
                return null
        }
    }

    render() {
        const { appNodeStatus, packageinfos } = this.state

        return (
            this.renderDetail(appNodeStatus, packageinfos)
        )
    }
}