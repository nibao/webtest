import * as React from 'react'
import { noop } from 'lodash'
import { PackageStatus, ServerPackageStatus } from '../../../core/siteupgrade/siteupgrade'
import { ECMSUpgradeClient } from '../../../core/thrift2/thrift2'

export default class ServerPackageBase extends React.Component<Console.ServerUpgrade.ServerPackage.Props, Console.ServerUpgrade.ServerPackage.State> {
    static defaultProps = {
        doSystemDetailRedirect: noop
    }

    state = {
        packageStatus: PackageStatus.Initial,

        progress: 0,

        upgradePackageInfo: {},

        upgradeStatusArray: [],

        serverPackageStatus: ServerPackageStatus.Initial
    }

    isMounting: boolean = false

    async componentDidMount() {
        this.isMounting = true

        const upgradePackageInfo = await ECMSUpgradeClient.query_package()

        const { package_name } = upgradePackageInfo

        this.setState({
            packageStatus: package_name ? PackageStatus.PackageDetail : PackageStatus.Upload,
        })
    }

    componentWillUnmount() {
        this.isMounting = false
    }

    /**
     * 更新上传进度
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
     * 点击错误提示框的“确认”按钮
     */
    protected async confirmError() {

        // 重新获取升级包的信息
        const upgradePackageInfo = await ECMSUpgradeClient.query_package()
        const { package_name } = upgradePackageInfo

        this.setState({
            packageStatus: package_name ? PackageStatus.PackageDetail : PackageStatus.Upload,
            progress: 0,
            error: null
        })
    }

    /**
     * 处理上传成功
     */
    protected handleUploadSuccess() {
        if (this.isMounting) {
            this.setState({
                packageStatus: PackageStatus.PackageDetail,
                progress: 0,
                serverPackageStatus: ServerPackageStatus.UploadSuccess
            })
        }
    }
}