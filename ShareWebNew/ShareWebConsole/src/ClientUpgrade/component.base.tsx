import * as React from 'react'
import { noop } from 'lodash'
import { AppNodeStatus } from '../../core/siteupgrade/siteupgrade'
import { ECMSManagerClient, createShareMgntClient } from '../../core/thrift2/thrift2'

export default class ClientUpgradeBase extends React.Component<Console.ClientUpgrade.Props, Console.ClientUpgrade.State> {

    static defaultProps = {
        doRedirectServers: noop
    }

    state = {
        appNodeStatus: AppNodeStatus.Initial,

        packageinfos: []
    }

    async componentDidMount() {
        // 获取应用节点信息
        const nodes = await ECMSManagerClient.get_app_node_info()

        if (nodes.length) {
            // 获取应用节点ip
            const nodeIp = await ECMSManagerClient.get_app_master_node_ip()
            // 获取客户端升级包
            const packageinfos = await createShareMgntClient({ ip: nodeIp }).GetClientUpdatePackage()

            this.setState({
                packageinfos,
                appNodeStatus: AppNodeStatus.Setup
            })
        } else {
            this.setState({
                appNodeStatus: AppNodeStatus.NoSet
            })
        }
    }
}