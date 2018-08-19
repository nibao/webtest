import * as React from 'react'
import { includes } from 'lodash'
import * as classnames from 'classnames'
import { formatTime } from '../../../util/formatters/formatters'
import { ServerPackageStatus, serverPackageinfo, ConfirmStatus, ErrorCode, getErrorMessage, getErrorTitleMessage } from '../../../core/siteupgrade/siteupgrade'
import { UIIcon, Text, Form, FlexBox, Icon, Button, ConfirmDialog, ErrorDialog, MessageDialog, ProgressCircle, LinkChip } from '../../../ui/ui.desktop'
import PackageInfoBase from './component.base'
import __ from './locale'
import * as styles from './styles.view'
import * as loading from './assets/loading.gif'



export default class PackageInfo extends PackageInfoBase {
    renderIconArea(serverPackageStatus: ServerPackageStatus) {
        switch (serverPackageStatus) {
            case ServerPackageStatus.Upgrading:
                return (
                    <Icon url={loading} size={64} />
                )

            case ServerPackageStatus.UploadSuccess:
                return (
                    <UIIcon
                        code={serverPackageinfo[ServerPackageStatus.UploadSuccess].icon}
                        size={64}
                        color={'#7E868D'}
                    />
                )

            case ServerPackageStatus.UpgradeComplete:
                return (
                    <UIIcon
                        code={serverPackageinfo[ServerPackageStatus.UpgradeComplete].icon}
                        color={'#7E868D'}
                        size={64}
                    />
                )

            default:
                return null
        }
    }

    render() {
        const { confirmStatus, upgradePackageInfo, error, errorCode, serverPackageStatus, deleting } = this.state
        const { package_name, import_time, support_version, package_version } = upgradePackageInfo

        return (
            <div>
                {
                    serverPackageStatus !== ServerPackageStatus.Initial ?
                        <div className={styles['icon-area']}>
                            <FlexBox>
                                <FlexBox.Item align="middle center">
                                    {
                                        this.renderIconArea(serverPackageStatus)
                                    }
                                    <div className={styles['message']}>
                                        {
                                            serverPackageinfo[serverPackageStatus].text
                                        }
                                    </div>
                                </FlexBox.Item>
                            </FlexBox>
                        </div>
                        : null
                }
                <div className={styles['package-area']}>
                    <Form>
                        <Form.Row>
                            <Form.Label>
                                <div className={styles['text-height']}>
                                    {__('升级包名称：')}
                                </div>
                            </Form.Label>
                            <Form.Field>
                                <Text className={classnames(styles['text'], styles['inline-block-style'])}>
                                    {package_name}
                                </Text>
                                <Button
                                    className={styles['delete-btn']}
                                    disabled={serverPackageStatus === ServerPackageStatus.Upgrading}
                                    onClick={() => this.setState({
                                        confirmStatus: ConfirmStatus.Delete
                                    })}
                                >
                                    {__('删除')}
                                </Button>
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>
                                <div className={styles['text-height']}>
                                    {__('上传时间：')}
                                </div>
                            </Form.Label>
                            <Form.Field>
                                <Text className={styles['text']}>
                                    {
                                        package_name ? formatTime(import_time) : ''
                                    }
                                </Text>
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>
                                <div className={styles['text-height']}>
                                    {__('支持升级版本：')}
                                </div>
                            </Form.Label>
                            <Form.Field>
                                <Text className={styles['text']}>
                                    {support_version}
                                </Text>
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>
                                <div className={styles['text-height']}>
                                    {__('升级后版本：')}
                                </div>
                            </Form.Label>
                            <Form.Field>
                                <Text className={styles['text']}>
                                    {package_version}
                                </Text>
                            </Form.Field>
                        </Form.Row>
                    </Form>
                    <Button
                        className={styles['upgrade-btn']}
                        disabled={includes([ServerPackageStatus.UpgradeComplete, ServerPackageStatus.Upgrading], serverPackageStatus)}
                        onClick={() => this.setState({
                            confirmStatus: ConfirmStatus.Upgrade
                        })}
                    >
                        {__('开始升级')}
                    </Button>
                </div>
                {
                    confirmStatus === ConfirmStatus.Delete ?
                        <ConfirmDialog
                            onConfirm={this.deleteServerPackage.bind(this)}
                            onCancel={() => this.setState({
                                confirmStatus: ConfirmStatus.None
                            })}
                        >
                            {__('确定要删除此升级包吗？')}
                        </ConfirmDialog>
                        : null
                }
                {
                    confirmStatus === ConfirmStatus.Upgrade ?
                        <ConfirmDialog
                            onConfirm={this.updateServerPackage.bind(this)}
                            onCancel={() => this.setState({
                                confirmStatus: ConfirmStatus.None
                            })}
                        >
                            {__('升级过程中可能会造成节点的某些服务中断，且升级过程不可逆，您确定要执行升级操作吗？')}
                        </ConfirmDialog>
                        : null
                }
                {
                    error && error.message ?
                        <ErrorDialog onConfirm={() => this.setState({ error: null })}>
                            <ErrorDialog.Title>
                                {getErrorTitleMessage(error.type)}
                            </ErrorDialog.Title>
                            <ErrorDialog.Detail>
                                {error.message}
                            </ErrorDialog.Detail>
                        </ErrorDialog>
                        : null
                }
                {
                    errorCode ?
                        <MessageDialog onConfirm={this.clearErrorCode.bind(this)}>
                            {getErrorMessage(errorCode, this.offLineNodes)}
                            {
                                errorCode === ErrorCode.NodeException && (
                                    <LinkChip
                                        onClick={this.props.doSystemDetailRedirect}
                                        className={styles['link-btn']}
                                    >
                                        {
                                            __('查看监控详情')
                                        }
                                    </LinkChip>
                                )
                            }
                        </MessageDialog>
                        : null
                }
                {
                    deleting ?
                        <div className={styles['progress-circle']}>
                            <ProgressCircle detail={__('正在删除，请稍候......')} />
                        </div>
                        : null
                }
            </div>
        )
    }
}
