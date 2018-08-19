import * as React from 'react'
import { noop, keys } from 'lodash'
import { ECMSManagerClient } from '../../../../core/thrift2/thrift2'
import { manageLog } from '../../../../core/log2/log2'
import __ from './locale'

export default class SetAsHotSpareBase extends React.Component<Console.NodeManagementRAID.IdleDevice.SetAsHotSpare.Props, Console.NodeManagementRAID.IdleDevice.SetAsHotSpare.State> {
    static GLOBAL_HOT_SPARE = 'GLOBAL_HOT_SPARE'

    static defaultProps = {
        node: {},
        disks: [],
        onSetHotSpareCancel: noop,
        onSetHotSpareFail: noop,
        onSetHotSpareSuccess: noop,
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        lgDiskList: [],
        physicalDisk: {},
        selectedLgDisk: SetAsHotSpareBase.GLOBAL_HOT_SPARE,
        setDialog: true,
        confirmDialog: false,
        processingSet: false,
        setErrMsg: '',
    }

    async componentWillMount() {
        const { node } = this.props
        const { selectedLgDisk } = this.state
        // 将"服务器全局"与请求的可关联逻辑设备列表（不包含服务器全局）拼接为lgDiskList，用于渲染可关联逻辑设备下拉选项框
        const lgDiskList = [selectedLgDisk, ...keys(await ECMSManagerClient.get_raid_lds_for_hotspare(node.node_ip))]
        this.setState({
            lgDiskList,
        })

    }

    /**
     * 关闭或者取消设为热备盘对话框时触发
     */
    closeSetAsHotSpareDialog() {
        this.setState({
            selectedLgDisk: SetAsHotSpareBase.GLOBAL_HOT_SPARE,
        }, () => {
            this.props.onSetHotSpareCancel()
        })
    }

    /**
     * 确认设为热备盘对话框时触发
     */
    confirmSetAsHotSpareDialog() {
        this.setState({
            setDialog: false,
            confirmDialog: true,
        })
    }

    /**
     * 执行设为热备盘操作
     */
    protected setAsHotSpare() {
        const { node, disks } = this.props
        const { selectedLgDisk } = this.state

        this.setState({
            confirmDialog: false,
            processingSet: true,
        }, async () => {
            try {
                if (selectedLgDisk === SetAsHotSpareBase.GLOBAL_HOT_SPARE) {
                    await ECMSManagerClient.add_raid_hotspare(node.node_ip, disks[0]['pd_devid'], '')
                } else {
                    await ECMSManagerClient.add_raid_hotspare(node.node_ip, disks[0]['pd_devid'], selectedLgDisk)
                }
                const physicalDisk = await ECMSManagerClient.get_all_data_raid_pds(node.node_ip)

                this.context.toast(__('设置热备盘成功'))

                //记录设置热备盘管理日志
                manageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_SET'],
                    msg: __('设置“${nodeIp}”内 ${ldDevid}的热备盘：“${pdDevid}”成功', { nodeIp: node.node_ip, ldDevid: selectedLgDisk, pdDevid: disks[0]['pd_devid'] }),
                    exMsg: ''
                })

                this.setState({
                    physicalDisk,
                    processingSet: false,
                    selectedLgDisk: SetAsHotSpareBase.GLOBAL_HOT_SPARE,
                }, () => {
                    this.props.onSetHotSpareSuccess(physicalDisk)
                })
            } catch (error) {
                this.setState({
                    processingSet: false,
                    setErrMsg: error.error.errMsg,
                })
            }

        })
    }

    /**
     * 设为热备盘失败后触发
     */
    protected setAsHotSpareFail() {
        this.setState({
            selectedLgDisk: SetAsHotSpareBase.GLOBAL_HOT_SPARE,
        }, () => {
            this.props.onSetHotSpareFail()
        })
    }
}