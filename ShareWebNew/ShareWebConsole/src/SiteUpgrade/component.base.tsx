import * as React from 'react'
import { noop } from 'lodash'
import { createShareSiteClient, ECMSManagerClient } from '../../core/thrift2/thrift2';
import { appStatusReady } from '../../core/cluster/cluster'
import '../../gen-js/ShareSite_types'

export default class SiteUpgradeBase extends React.Component<Console.SiteUpgrade.Props, Console.SiteUpgrade.State> {
    static defaultProps = {
        doRedirectServers: noop,

        doSystemDetailRedirect: noop
    }

    state = {
        showClientUpgrade: undefined
    }

    async componentWillMount() {
        const appIp = await appStatusReady()

        // 当appIp非空时，接着往下
        if (appIp) {
            const { type } = await createShareSiteClient({ ip: appIp }).GetLocalSiteInfo()

            // 分站点，隐藏客户端升级；其他情况不隐藏
            this.setState({
                showClientUpgrade: type !== ncTSiteType.NCT_SITE_TYPE_SLAVE
            })
        }
    }
}