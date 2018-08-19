import * as React from 'react'
import { filter, values } from 'lodash'
import { ECMSManagerClient } from '../../../core/thrift2/thrift2'
import { manageLog } from '../../../core/log2/log2'
import __ from './locale'

export default class HotSpareBase extends React.Component<Console.NodeManagementRAID.HotSpare.Props, Console.NodeManagementRAID.HotSpare.State> {

    static defaultProps = {
        node: {},
        physicalDisk: {},

    }

    state = {
        hotSpareDisk: [],
        deleteInfo: null,
        processingDel: false,
    }

    componentWillMount() {
        this.initData(this.props.physicalDisk)
    }

    componentWillReceiveProps({ physicalDisk }) {
        if (this.props.physicalDisk !== physicalDisk) {
            this.initData(physicalDisk)
        }
    }

    /**
     * 初始化数据，过滤得到热备盘数组
     */
    initData(physicalDisk) {
        const hotSpareDisk = filter(values(physicalDisk), (item) => {
            return item['is_hotspare']
        })
        this.setState({
            hotSpareDisk,
        })
    }

    /**
    * 点击删除热备盘按钮时触发
    */
    protected delDialog(value) {
        this.setState({
            deleteInfo: value
        })
    }

    /**
    * 删除热备盘
    */
    protected deleteHotSpare() {
        const { node } = this.props
        //删除热备盘成功之后更新热备盘和空闲物理设备列表显示,并记录管理日志
        const { deleteInfo } = this.state
        const pdDevid = deleteInfo['pd_devid']
        this.setState({
            deleteInfo: null,
            processingDel: true
        }, async () => {
            await ECMSManagerClient.remove_raid_hotspare(node.node_ip, pdDevid)
            const physicalDisk = await ECMSManagerClient.get_all_data_raid_pds(node.node_ip)
            //记录移除管理日志
            manageLog({
                level: ncTLogLevel['NCT_LL_WARN'],
                opType: ncTManagementType['NCT_MNT_DELETE'],
                msg: __('移除“${nodeIp}”内“${ldDevid}”的热备盘：“${pdDevid}”成功', { nodeIp: node.node_ip, ldDevid: deleteInfo['ld_devid'], pdDevid: deleteInfo['pd_devid'] }),
                exMsg: ''
            })

            this.setState({
                processingDel: false
            }, () => {
                this.props.doDelHotSpareSuccess(physicalDisk)
            })
        })
    }
}