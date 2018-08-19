import * as React from 'react'
import { noop } from 'lodash'
import { timer } from '../../../util/timer/timer'
import { PackageStatus, ConfirmStatus, ServerPackageStatus } from '../../../core/siteupgrade/siteupgrade'
import { ECMSManagerClient, ECMSUpgradeClient } from '../../../core/thrift2/thrift2'

export default class NodeInfosBase extends React.Component<Console.ServerUpgrade.NodeInfos.Props, Console.ServerUpgrade.NodeInfos.State> {

    static defaultProps = {
        serverPackageStatus: ServerPackageStatus.Initial,

        packageStatus: PackageStatus.Initial,

        onUpdatePackageStatus: noop
    }

    state = {
        currentVersion: '',

        upgradeStatusArray: [],

        confirmStatus: ConfirmStatus.None,

        currentNode: null
    }

    stopTimer = noop

    serverPackageStatus: ServerPackageStatus = this.props.serverPackageStatus

    componentDidMount() {
        this.query()
    }

    componentWillReceiveProps({ packageStatus, serverPackageStatus }) {
        if (packageStatus !== PackageStatus.Progress && serverPackageStatus !== this.serverPackageStatus) {
            this.query()
        }
    }

    componentWillUnmount() {
        this.stopTimer()
    }

    /**
     * 每隔5秒查询节点升级状态
     */
    private async query() {
        await this.updateNodeInfos()

        // 如果在升级中, 则每隔5秒查询
        if (this.serverPackageStatus === ServerPackageStatus.Upgrading) {
            this.stopTimer = timer(() => {
                this.updateNodeInfos()
            }, 5000)
        }

    }

    /**
     * 更新节点信息
     */
    private async updateNodeInfos(): Promise<ServerPackageStatus> {
        // (1)获取当前版本(2)查询所有节点信息(3)获取所有的ha节点信息（4）查询节点升级状态 (5)获取升级包信息
        const [currentVersion, allNodeInfos, allHaNodes, upgradeStatusArray, packageInfo] = await Promise.all([
            ECMSManagerClient.get_cluster_version(),
            ECMSManagerClient.get_all_node_info(),
            ECMSManagerClient.get_ha_node_info(),
            ECMSUpgradeClient.query_status(),
            ECMSUpgradeClient.query_package()
        ])

        // 计算升级包状态
        if (upgradeStatusArray && upgradeStatusArray.length && upgradeStatusArray.some(item => item.status !== 'done')) {
            // 升级中(有status不为'done')
            this.serverPackageStatus = ServerPackageStatus.Upgrading
        } else if (packageInfo.package_version === currentVersion) {
            // 升级完成(升级包信息中的升级后版本 与 当前版本相等)
            this.serverPackageStatus = ServerPackageStatus.UpgradeComplete
        } else if (packageInfo.package_version) {
            // 上传成功
            this.serverPackageStatus = ServerPackageStatus.UploadSuccess
        } else {
            // 其他情况
            this.serverPackageStatus = ServerPackageStatus.Initial
        }

        const newUpgradeStatusArray = upgradeStatusArray.map((nodeUpgrade) => {
            let node = {}

            allNodeInfos.some(nodeInfo => {
                if (nodeInfo.node_uuid === nodeUpgrade.node_uuid) {
                    node = nodeInfo

                    return true
                }
            })

            let haNode = {}

            if (node.is_ha) {
                allHaNodes.some(nodeInfo => {
                    if (node.node_uuid === nodeInfo.node_uuid) {
                        haNode = nodeInfo

                        return true
                    }
                })
            }

            return { ...nodeUpgrade, ...node, ...haNode }
        })

        this.setState({
            currentVersion,
            upgradeStatusArray: newUpgradeStatusArray
        })

        this.props.onUpdatePackageStatus(this.serverPackageStatus)

        if (this.serverPackageStatus !== ServerPackageStatus.Upgrading) {
            this.stopTimer()
        }

        return this.serverPackageStatus
    }


    /**
     * 清空升级状态
     */
    protected async clearUpgradeStatus() {
        this.setState({
            confirmStatus: ConfirmStatus.None
        })

        await ECMSUpgradeClient.clear_status(false)

        this.updateNodeInfos()
    }

    /**
     * 查看错误详情
     */
    protected onViewUpgradeErrorDetail(node: any) {
        this.setState({
            currentNode: node
        })
    }
}