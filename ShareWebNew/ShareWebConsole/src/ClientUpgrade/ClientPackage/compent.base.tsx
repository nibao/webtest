import * as React from 'react'
import '../../../gen-js/EACPLog_types';
import { manageLog } from '../../../core/log2/log2'
import { PackageStatus, ErrorCode, ConfirmStatus, clients } from '../../../core/siteupgrade/siteupgrade'
import { ECMSManagerClient, createShareMgntClient } from '../../../core/thrift2/thrift2'
import __ from './locale'

export default class ClientPackageBase extends React.Component<Console.ClientUpgrade.ClientPackage.Props, Console.ClientUpgrade.ClientPackage.State> {

    static defaultProps = {
        packageinfo: {}
    }

    state = {
        packageStatus: PackageStatus.Initial,

        progress: 0,

        packageinfo: this.props.packageinfo,

        confirmStatus: ConfirmStatus.None
    }

    isMounting: boolean = false

    componentDidMount() {
        this.setState({
            packageStatus: this.props.packageinfo.name ? PackageStatus.PackageDetail : PackageStatus.Upload
        })

        this.isMounting = true
    }

    componentWillUnmount() {
        this.isMounting = false
    }

    /**
     * 获取客户端升级包初始状态
     */
    async initPackagesStatus() {
        // 获取应用节点ip
        const nodeIp = await ECMSManagerClient.get_app_master_node_ip()
        // 获取客户端升级包
        const packageinfos = await createShareMgntClient({ ip: nodeIp }).GetClientUpdatePackage()
        const packageinfo = packageinfos.filter(({ ostype }) => ostype === this.props.osType)[0]

        this.setState({
            packageinfo,
            packageStatus: packageinfo.name ? PackageStatus.PackageDetail : PackageStatus.Upload
        })
    }

    /**
     * 更新进度
     * @param progressvalue 进度值
     */
    protected handleUploadProgress(progress: number) {
        if (this.isMounting) {
            this.setState({
                packageStatus: PackageStatus.Progress,
                progress
            })
        }
    }

    /**
     * 处理上传错误
     * @param 
     */
    protected handleUploadError(error) {
        if (this.isMounting) {
            this.setState({
                error
            })
        }
    }

    /**
     * 处理上传成功
     */
    protected handleUploadSuccess() {
        if (this.isMounting) {
            // 重新获取一次包信息
            this.initPackagesStatus()
        }
    }

    /**
     * 点击错误提示框的“确认”按钮
     */
    protected confirmError() {
        this.setState({
            packageStatus: this.state.packageStatus === PackageStatus.Progress ? PackageStatus.Upload : this.state.packageStatus,
            progress: 0,
            error: null
        })
    }

    /**
     * 删除包
     */
    protected async deleteClientPackage() {
        this.setState({
            confirmStatus: ConfirmStatus.None
        })

        try {
            // 获取应用节点ip
            const nodeIp = await ECMSManagerClient.get_app_master_node_ip()
            // 删除
            await createShareMgntClient({ ip: nodeIp }).DeleteClientUpdatePackage(this.props.osType)

            // 记录删除日志
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_DELETE'],
                msg: __('删除${ostypename}客户端升级包“${packagename}” 成功', { ostypename: clients[this.props.osType].text, packagename: this.state.packageinfo.name }),
                exMsg: ''
            })

            this.setState({
                packageStatus: PackageStatus.Upload,
                packageinfo: {}
            })
        } catch ({ expMsg }) {
            this.setState({
                error: {
                    type: ErrorCode.DeleteError,
                    message: expMsg
                }
            })
        }

    }
}