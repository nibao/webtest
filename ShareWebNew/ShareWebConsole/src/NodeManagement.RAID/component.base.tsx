import * as React from 'react'
import { ECMSManagerClient } from '../../core/thrift2/thrift2'

export default class RAIDBase extends React.Component<Components.NodeManagement.RAID.Props, Components.NodeManagement.RAID.State> {

    static defaultProps = {
        node: {},
    }

    state = {
        hasRAID: null,
        openRAIDInfo: true,
        openHotSpare: true,
        openIdleDevice: false,
        physicalDisk: {},
        logicDisk: {},
    }

    async componentWillMount() {
        const { node } = this.props
        const hasRAID = await ECMSManagerClient.is_available_of_raid_manager(node.node_ip)
        if (hasRAID) {
            const [
                physicalDisk,
                logicDisk
            ] = await Promise.all([
                ECMSManagerClient.get_all_data_raid_pds(node.node_ip),
                ECMSManagerClient.get_all_raid_lds(node.node_ip)
            ])

            this.setState({
                physicalDisk,
                logicDisk
            })
        }
        this.setState({
            hasRAID,
        })

    }

    /**
     * 初始化RAID/设为热备盘/删除热备盘成功之后执行
     */
    protected handleModifySuccess(physicalDisk: object, logicDisk?: object) {
        if (logicDisk !== undefined) {
            this.setState({
                logicDisk
            })
        }
        this.setState({
            physicalDisk,
        })
    }
}



