import * as React from 'react'
import * as classnames from 'classnames'
import { includes } from 'lodash'
import { PackageStatus, OsType, getErrorTitleMessage, ConfirmStatus } from '../../../core/siteupgrade/siteupgrade'
import { ErrorDialog, ConfirmDialog } from '../../../ui/ui.desktop'
import Upload from '../Upload/component.view'
import PackageDetail from '../PackageDetail/component.view'
import Progress from '../Progress/component.view'
import ClientPackageBase from './compent.base'
import * as styles from './styles.view'
import __ from './locale'

export default class ClientPackage extends ClientPackageBase {
    render() {
        const { packageStatus, progress, packageinfo, error, confirmStatus } = this.state
        const { osType } = this.props

        return (
            <div className={classnames(osType !== OsType.Mac ? styles['bottom-style'] : null, styles['client-area'])}>
                {
                    includes([PackageStatus.Upload, PackageStatus.Progress], packageStatus) && (
                        <Upload
                            osType={osType}
                            hide={packageStatus === PackageStatus.Progress}
                            onUploadProgress={this.handleUploadProgress.bind(this)}
                            onUploadError={this.handleUploadError.bind(this)}
                            onUploadSuccess={this.handleUploadSuccess.bind(this)}
                        />
                    )
                }
                {
                    packageStatus === PackageStatus.PackageDetail && (
                        <PackageDetail
                            osType={osType}
                            packageinfo={packageinfo}
                            onDeletePackage={() => this.setState({ confirmStatus: ConfirmStatus.Delete })}
                        />
                    )
                }
                {
                    packageStatus === PackageStatus.Progress && (
                        <Progress
                            osType={osType}
                            progress={progress}
                        />
                    )
                }
                {
                    error && error.message ?
                        <ErrorDialog onConfirm={this.confirmError.bind(this)}>
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
                    confirmStatus === ConfirmStatus.Delete ?
                        <ConfirmDialog
                            onConfirm={this.deleteClientPackage.bind(this)}
                            onCancel={() => this.setState({
                                confirmStatus: ConfirmStatus.None
                            })}
                        >
                            {__('确定要删除此升级包吗？')}
                        </ConfirmDialog>
                        : null
                }
            </div>
        )
    }
}