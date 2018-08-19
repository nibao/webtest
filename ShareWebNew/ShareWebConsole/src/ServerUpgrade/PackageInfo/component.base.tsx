import * as React from 'react'
import { noop } from 'lodash'
import '../../../gen-js/EACPLog_types';
import { manageLog } from '../../../core/log2/log2'
import { ServerPackageStatus, ConfirmStatus, ErrorCode } from '../../../core/siteupgrade/siteupgrade'
import { ECMSUpgradeClient, ECMSManagerClient } from '../../../core/thrift2/thrift2'
import __ from './locale'

export default class PackageInfoBase extends React.Component<Console.ServerUpgrade.PackageInfo.Props, Console.ServerUpgrade.PackageInfo.State> {
    static defaultProps = {
        serverPackageStatus: ServerPackageStatus.Initial,

        onDeleteServerPackageSuccess: noop,

        onStartUpgrade: noop
    }

    state = {
        upgradePackageInfo: {},

        confirmStatus: ConfirmStatus.None,

        errorCode: ErrorCode.None,

        serverPackageStatus: this.props.serverPackageStatus,

        error: null,

        deleting: false
    }

    offLineNodes: ReadonlyArray<any> = []   // 离线的节点数组

    async componentDidMount() {
        // 查询升级包信息
        this.setState({
            upgradePackageInfo: await ECMSUpgradeClient.query_package()
        })
    }

    async componentWillReceiveProps({ serverPackageStatus }) {
        if (serverPackageStatus !== this.props.serverPackageStatus) {
            this.setState({
                serverPackageStatus
            })
        }
    }

    /**
     * 删除服务器包
     */
    protected async deleteServerPackage() {
        this.setState({
            confirmStatus: ConfirmStatus.None,
            deleting: true
        })

        try {
            await ECMSUpgradeClient.remove_package()

            // 记录删除升级包日志
            manageLog({
                level: ncTLogLevel['NCT_LL_INFO'],
                opType: ncTManagementType['NCT_MNT_DELETE'],
                msg: __('删除 服务器升级包 成功'),
                exMsg: __('升级包名称：“${packagename}”', { packagename: this.state.upgradePackageInfo.package_name }),
            })

            this.props.onDeleteServerPackageSuccess()
        }
        catch ({ expMsg }) {
            this.setState({
                error: {
                    type: ErrorCode.DeleteError,
                    message: expMsg
                },
                deleting: false
            })
        }
    }

    /**
     * 开始升级
     */
    protected async updateServerPackage() {
        this.setState({
            confirmStatus: ConfirmStatus.None
        })

        // 检查节点离线
        const nodes: ReadonlyArray<ncTNodeInfo> = await ECMSManagerClient.get_all_node_info()
        this.offLineNodes = nodes.filter(({ is_online }) => !is_online).map(({ node_ip }) => node_ip)

        if (this.offLineNodes.length) {
            // 有节点离线
            this.setState({
                errorCode: ErrorCode.NodeNotOnLine
            })
        } else {
            // 检查节点异常
            const nodeStatus = await ECMSManagerClient.get_alert_trigger_status()

            let exception: boolean = false

            for (let item in nodeStatus) {
                if (!nodeStatus[item]) {
                    exception = true

                    break
                }
            }

            if (exception) {
                // 有节点异常
                this.setState({
                    errorCode: ErrorCode.NodeException
                })
            } else {
                try {
                    await ECMSUpgradeClient.start_upgrade()

                    // 记录升级日志
                    manageLog({
                        level: ncTLogLevel['NCT_LL_INFO'],
                        opType: ncTManagementType['NCT_MNT_SET'],
                        msg: __('开始执行服务器升级操作 成功'),
                        exMsg: __('升级后版本：“${version}”', { version: this.state.upgradePackageInfo.package_version }),
                    })

                    this.props.onStartUpgrade()
                }
                catch ({ expMsg }) {
                    this.setState({
                        error: {
                            type: ErrorCode.UpgradeError,
                            message: expMsg
                        }
                    })
                }
            }
        }
    }

    /**
     * 清除错误码
     */
    protected clearErrorCode() {
        this.setState({ errorCode: ErrorCode.None })
        // 离线节点数组置空
        this.offLineNodes = []
    }
} 