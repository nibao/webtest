import * as React from 'react'
import { includes } from 'lodash'
import { PackageStatus, ServerPackageStatus, getErrorTitleMessage } from '../../../core/siteupgrade/siteupgrade'
import { ErrorDialog } from '../../../ui/ui.desktop'
import Upload from '../Upload/component.view'
import PackageInfo from '../PackageInfo/component.view'
import NodeInfos from '../NodeInfos/component.view'
import Progress from '../Progress/component.view'
import ServerPackageBase from './compent.base'
import __ from './locale'
import * as styles from './styles.view'

export default class ServerPackage extends ServerPackageBase {

    render() {
        const { packageStatus, progress, serverPackageStatus, error } = this.state
        const { doSystemDetailRedirect } = this.props

        return (
            <div>
                <div className={styles['detail-area']}>
                    {
                        includes([PackageStatus.Upload, PackageStatus.Progress], packageStatus) && (
                            <Upload
                                hide={packageStatus === PackageStatus.Progress}
                                onUploadProgress={this.handleUploadProgress.bind(this)}
                                onUploadError={this.handleUploadError.bind(this)}
                                onUploadSuccess={this.handleUploadSuccess.bind(this)}
                            />
                        )
                    }
                    {
                        packageStatus === PackageStatus.PackageDetail && (
                            <PackageInfo
                                serverPackageStatus={serverPackageStatus}
                                onDeleteServerPackageSuccess={() => {
                                    this.setState({
                                        packageStatus: PackageStatus.Upload,
                                        serverPackageStatus: ServerPackageStatus.Initial
                                    })
                                }}
                                onStartUpgrade={() => this.setState({ serverPackageStatus: ServerPackageStatus.Upgrading })}
                                doSystemDetailRedirect={doSystemDetailRedirect}
                            />
                        )
                    }
                    {
                        packageStatus === PackageStatus.Progress && (
                            <Progress
                                progress={progress}
                            />
                        )
                    }
                </div>
                <NodeInfos
                    packageStatus={packageStatus}
                    serverPackageStatus={serverPackageStatus}
                    onUpdatePackageStatus={(serverPackageStatus) => this.setState({ serverPackageStatus })}
                />
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
            </div>
        )
    }
}