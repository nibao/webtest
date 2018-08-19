import * as React from 'react'
import { ECMSManagerClient } from '../../../core/thrift2/thrift2'

export default class RAIDInfoBase extends React.Component<Console.NodeManagementRAID.RAIDInfo.Props, Console.NodeManagementRAID.RAIDInfo.State> {

    static defaultProps = {
        node: {},
        physicalDisk: {},
        logicDisk: {},
    }

    state = {
        details: null,
        diskID: '',
    }


    /**
    * 点击查看详情时触发
    * @param diskID 查看详情的磁盘id
    * @param types 查看详情的磁盘类型（物理|逻辑）
    */
    protected async showDetails(diskID, types: 'physical' | 'logic') {
        const { node } = this.props
        let details = {}

        if (types === 'physical') {
            details = await ECMSManagerClient.get_raid_pd_details(node.node_ip, diskID)
        } else {
            details = await ECMSManagerClient.get_raid_ld_details(node.node_ip, diskID)
        }

        this.setState({
            details,
            diskID,
        })
    }

    /**
    * 点击磁盘详情关闭按钮时关闭弹出的对话框
    */
    protected colseDetailsDialog() {
        this.setState({
            details: null,
            diskID: '',
        })
    }
}



