import * as React from 'react';
import QRCodeDownload from '../QRCodeDownload/component.desktop';
import QRCodeLarge from '../QRCodeLarge/component.desktop';
import SendSuccessMessage from './SendSuccessMessage/component.desktop';
import Configuration from './Configuration/component.desktop';
import ApprovalMessage from './ApprovalMessage/component.desktop';
import ConfigError from './ConfigError/component.desktop';
import InitError from './InitError/component.desktop';
import { ReqStatus, ErrorStatus } from './helper';
import LinkShareBase from './component.base';

export default class LinkShare extends LinkShareBase {
    render() {
        return (
            <div>
                {
                    this.state.reqStatus === ReqStatus.OK && !this.state.apvCase ? (
                        <Configuration
                            swf={this.props.swf}
                            doc={this.doc}
                            status={this.state.status}
                            address={this.state.address}
                            enableLinkAccessCode={this.enableLinkAccessCode}
                            link={this.state.link}
                            perm={this.state.perm}
                            password={this.state.password}
                            endtime={this.state.endtime}
                            limitation={this.state.limitTimes}
                            limited={this.state.limitTimeStatus}
                            template={this.template}
                            mailto={this.state.mailto}
                            showButtons={this.state.change}
                            accesscode={this.state.accesscode}
                            onEndtimeChange={this.setLinkDate.bind(this)}
                            onPasswordChange={this.setRelatedPassword.bind(this)}
                            onLimitedChange={this.setRelatedLimit.bind(this)}
                            onLimitationChange={this.setLimitTimes.bind(this)}
                            onMailsChange={this.updateMails.bind(this)}
                            doSave={this.saveLinkInfo.bind(this)}
                            doCancel={this.resetLinkDetail.bind(this)}
                            onResize={this.centerConfiguration.bind(this)}
                            onSwitchStatus={this.switchStatus.bind(this)}
                            onMailSendSuccess={this.onMailSendSuccess.bind(this)}
                            onMailSendError={this.onMailSendError.bind(this)}
                            onPermChange={this.updateDefaultPerm.bind(this)}
                            doConfigurationClose={this.props.doConfigurationClose}
                            onShowDownloadDialog={this.showDownloadDialog.bind(this)}
                            onViewFullImage={this.viewFullImage.bind(this)}
                        />
                    ) : null
                }
                {
                    this.state.sendMailSuccess ? (
                        <SendSuccessMessage />
                    ) : null
                }
                {
                    this.state.downloadQRCode ? (
                        <QRCodeDownload
                            text={this.state.address}
                            doDownload={this.downloadQRCode.bind(this)}
                            doClose={this.closeDownloadDialog.bind(this)}
                            doCancel={this.closeDownloadDialog.bind(this)}
                        />
                    ) : null
                }
                {
                    this.state.viewFullImage ? (
                        <QRCodeLarge
                            text={this.state.address}
                            doClose={this.closeViewFullImage.bind(this)}
                        />
                    ) : null
                }
                {
                    this.state.reqStatus !== ReqStatus.PENDDING &&
                        this.state.reqStatus !== ReqStatus.OK ? (
                            <InitError
                                doc={this.doc}
                                errcode={this.state.reqStatus}
                                onConfirm={this.close.bind(this)}
                            />
                        ) : null
                }
                {
                    this.state.error !== ErrorStatus.OK ? (
                        <ConfigError
                            error={this.state.error}
                            template={this.template}
                            detail={{ allowPerms: this.buildTempAllowPerms(), expireDays: this.template.maxExpireDays, limitTimes: this.template.maxLimitTimes }}
                            onConfirm={() => this.setState({ error: ErrorStatus.OK })}
                        />
                    ) : null
                }
                {
                    this.state.apvCase ? (
                        <ApprovalMessage
                            onConfirm={this.props.doConfigurationClose}
                            doApprovalCheck={this.props.doApprovalCheck}
                        />
                    ) : null
                }
            </div>
        )
    }
}