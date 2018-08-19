import * as React from 'react'
import { noop } from 'lodash'
import { ECMSManagerClient } from '../../../../core/thrift2/thrift2'
import { manageLog } from '../../../../core/log2/log2'
import { getApproximateNumber } from '../../../../util/data/data'
import __ from './locale'

export default class InitAsRAIDBase extends React.Component<Console.NodeManagementRAID.IdleDevice.InitAsRAID.Props, Console.NodeManagementRAID.IdleDevice.InitAsRAID.State> {

    static defaultProps = {
        node: {},
        disks: [],
        onInitRAIDCancel: noop,
        onInitRAIDFail: noop,
        onInitRAIDSuccess: noop,
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        selectedRAIDType: 'RAID0',
        selectedDiskNum: 1,
        initDialog: true,
        confirmDialog: false,
        processingInit: false,
        initErrMsg: '',
        physicalDisk: {},
        logicDisk: {}
    }

    componentWillMount() {
        const { disks } = this.props

        // 当选中项的长度大于3时，RAID级别默认显示为RAID5,每组磁盘默认为选中项的最小质数
        if (disks.length >= 3) {
            this.setState({
                selectedRAIDType: 'RAID5',
                selectedDiskNum: getApproximateNumber(disks.length, 3)[0],
            })
        } else {
            this.setState({
                selectedRAIDType: 'RAID0',
                selectedDiskNum: 1,
            })
        }
    }

    /**
     * 选中的RAID类型改变的时触发
     */
    selectedRAIDTypeChange(selectedRAIDType) {
        const { disks } = this.props

        if (selectedRAIDType === 'RAID0') {
            this.setState({
                selectedRAIDType,
                selectedDiskNum: 1
            })
        } else {
            this.setState({
                selectedRAIDType,
                selectedDiskNum: getApproximateNumber(disks.length, 3)[0],
            })
        }
    }

    /**
     * 关闭或者取消初始化RAID对话框时触发
     */
    closeInitRAIDDialog() {
        this.setState({
            selectedRAIDType: 'RAID0',
            selectedDiskNum: 1,
        }, () => {
            this.props.onInitRAIDCancel()
        })
    }

    /**
     * 确认初始化RAID对话框时触发
     */
    confirmInitRAIDDialog() {
        this.setState({
            initDialog: false,
            confirmDialog: true,
        })
    }

    /**
     * 执行初始化RAID操作
     */
    protected async InitRAID() {
        const { node, disks } = this.props
        const { selectedDiskNum, selectedRAIDType } = this.state
        const pdDevids = disks.map(item => {
            return item['pd_devid']
        })
        this.setState({
            confirmDialog: false,
            processingInit: true
        }, async () => {
            try {
                await ECMSManagerClient.init_free_data_raid_pds(node.node_ip, pdDevids, selectedDiskNum)
                const [
                    physicalDisk,
                    logicDisk
                ] = await Promise.all([
                    ECMSManagerClient.get_all_data_raid_pds(node.node_ip),
                    ECMSManagerClient.get_all_raid_lds(node.node_ip)
                ])

                this.context.toast(__('磁盘RAID初始化成功'))
                //记录初始化RAID管理日志
                manageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_CREATE'],
                    msg: __('执行 RAID初始化磁盘设备“${nodeIp}”：${pdDevid} 成功', {
                        nodeIp: node.node_ip, pdDevid: disks.map((item, index) => {
                            return index !== disks.length - 1 ? `“${item['pd_devid']}”,` : `“${item['pd_devid']}”`
                        })
                    }),
                    exMsg: __('RAID策略： “${Raid}”', { Raid: selectedRAIDType }
                    ),
                })

                this.setState({
                    physicalDisk,
                    logicDisk,
                    processingInit: false,
                    selectedRAIDType: 'RAID0',
                    selectedDiskNum: 1,
                }, () => {
                    this.props.onInitRAIDSuccess(physicalDisk, logicDisk)
                })
            } catch (error) {
                this.setState({
                    processingInit: false,
                    initErrMsg: error.error.errMsg
                })
            }

        })
    }

    /**
     * 初始化RAID失败时触发
     */
    protected initRAIDFaile() {
        this.setState({
            selectedRAIDType: 'RAID0',
            selectedDiskNum: 1,
        }, () => {
            this.props.onInitRAIDFail()
        })
    }
}