import * as React from 'react'
import { assign, noop } from 'lodash'
import { ECMSManagerClient } from '../../core/thrift2/thrift2'
import { AppNodeStatus } from '../../core/siteupgrade/siteupgrade'

export default class ServerUpgradeBase extends React.Component<any, Console.ServerUpgrade.State> {

    static defaultProps = {
        doRedirectServers: noop,

        doSystemDetailRedirect: noop
    }

    state = {
        appNodeStatus: AppNodeStatus.Initial
    }

    async componentDidMount() {

        // 获取应用节点信息
        const nodes = await ECMSManagerClient.get_app_node_info()

        this.setState({
            appNodeStatus: nodes.length ? AppNodeStatus.Setup : AppNodeStatus.NoSet
        })


    }
}