import * as React from 'react'
import { noop, values, filter } from 'lodash'
import { ECMSManagerClient } from '../../../core/thrift2/thrift2'

export default class IdleDeviceBase extends React.Component<Console.NodeManagementRAID.IdleDevice.Props, Console.NodeManagementRAID.IdleDevice.State> {

    static defaultProps = {
        node: {},
        physicalDisk: {},
        onInitRAIDSuccess: noop,
        onSetAsHotSpareSuccess: noop,
    }

    state = {
        idleDeviceArr: [],
        details: null,
        diskID: '',
        selection: null,
        showInitRAIDDialog: false,
        showSetAsHotSpareDialog: false,
    }

    componentWillMount() {
        this.initData(this.props.physicalDisk)
    }

    componentWillReceiveProps({ physicalDisk }) {
        if (physicalDisk !== this.props.physicalDisk) {
            this.initData(physicalDisk)
        }
    }

    /**
     * 初始化数据
     */
    initData(physicalDisk) {
        const idleDeviceArr = filter(values(physicalDisk), (item) => {
            return item['is_hotspare'] === false && item['ld_devid'] === ''
        })

        this.setState({
            idleDeviceArr,
        })
    }

    /**
    * 选中的空闲物理设备发生改变时触发
    * @param selection 选中的项 
    */
    protected handleSelectionChange(selection) {
        this.setState({
            selection,
        })
    }

    /**
    * 点击查看详情时触发
    * @param diskInfo 查看详情的磁盘信息
    */
    protected async showDetails(diskInfo) {
        const { node } = this.props
        const diskID = diskInfo['pd_devid']
        const details = await ECMSManagerClient.get_raid_pd_details(node.node_ip, diskID)

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

    /**
     * 点击初始化RAID按钮时触发
     */
    protected handleInitRAIDClick() {
        this.setState({
            showInitRAIDDialog: true,
        })
    }

    /**
     * 确认初始化RAID成功后触发
     */
    protected confirmInitRAIDSuccess(physicalDisk, logicDisk) {
        //通知父元素（NodeManagement.RAID）初始化RAID成功，更新RAID物理磁盘显示列表
        this.setState({
            showInitRAIDDialog: false,
        }, () => {
            this.props.onInitRAIDSuccess(physicalDisk, logicDisk)
        })
    }

    /**
     * 点击设为设备盘按钮时触发
     */
    protected handleSetHotSpareClick() {
        this.setState({
            showSetAsHotSpareDialog: true,
        })
    }

    /**
     * 确认设为热备盘成功后触发
     */
    protected confirmSetAsHotSpareSuccess(physicalDisk) {
        //通知父元素（NodeManagement.RAID）设置为热备盘成功，更新热备盘显示列表
        this.setState({
            showSetAsHotSpareDialog: false,
        }, () => {
            this.props.onSetAsHotSpareSuccess(physicalDisk)
        })
    }
}