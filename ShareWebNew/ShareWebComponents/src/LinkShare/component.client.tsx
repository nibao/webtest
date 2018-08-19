import * as React from 'react';
import NWWindow from '../../ui/NWWindow/ui.client';
import Mounting from '../Mounting/component.client';
import QRCodeDownload from '../QRCodeDownload/component.client';
import QRCodeLarge from '../QRCodeLarge/component.client';
import { ClientComponentContext } from '../helper';
import SendSuccessMessage from './SendSuccessMessage/component.desktop';
import Configuration from './Configuration/component.client';
import ApprovalMessage from './ApprovalMessage/component.client';
import InitError from './InitError/component.client';
import ConfigError from './ConfigError/component.client';
import LinkShareBase from './component.base';
import { ReqStatus, ErrorStatus } from './helper';
import __ from './locale';

export default class LinkShare extends LinkShareBase {
    render() {
        const { onOpenLinkShareDialog, onCloseLinkShareDialog, fields, id } = this.props
        return (
            <NWWindow
                id={id}
                title={__('外链共享')}
                onOpen={onOpenLinkShareDialog}
                onClose={onCloseLinkShareDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <div>
                        {
                            this.state.reqStatus === ReqStatus.PENDDING ? (
                                <Mounting />
                            ) : null
                        }
                        {
                            this.state.reqStatus === ReqStatus.OK && !this.state.apvCase ? (
                                <Configuration
                                    swf={this.props.swf}
                                    doc={this.doc}
                                    status={this.state.status}
                                    address={this.state.address}
                                    enableLinkAccessCode={this.enableLinkAccessCode}
                                    link={this.state.link}
                                    opening={this.state.opening}
                                    closing={this.state.closing}
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
                                    doCopy={this.copyLink.bind(this)}
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
                                <NWWindow
                                    modal={true}
                                    onClose={this.closeDownloadDialog.bind(this)}
                                    title={__('下载二维码')}
                                >
                                    <QRCodeDownload
                                        text={this.state.address}
                                        doDownload={this.downloadQRCode.bind(this)}
                                        doClose={this.closeDownloadDialog.bind(this)}
                                        doCancel={this.closeDownloadDialog.bind(this)}
                                    />
                                </NWWindow>
                            ) : null
                        }
                        {
                            this.state.viewFullImage ? (
                                <NWWindow
                                    modal={true}
                                    onClose={this.closeViewFullImage.bind(this)}
                                    title={__('二维码原图')}
                                >
                                    <QRCodeLarge
                                        text={this.state.address}
                                        doClose={this.closeViewFullImage.bind(this)}
                                    />
                                </NWWindow>
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
                                <NWWindow
                                    onClose={() => this.setState({ error: ErrorStatus.OK })}
                                    modal={true}
                                    title={__('提示')}
                                >
                                    <ConfigError
                                        error={this.state.error}
                                        template={this.template}
                                        detail={{ allowPerms: this.buildTempAllowPerms(), expireDays: this.template.maxExpireDays, limitTimes: this.template.maxLimitTimes }}
                                        onConfirm={() => this.setState({ error: ErrorStatus.OK })}
                                    />
                                </NWWindow>
                            ) : null
                        }
                        {
                            this.state.apvCase && this.state.reqStatus === ReqStatus.OK ? (
                                <ApprovalMessage
                                    onConfirm={this.props.doConfigurationClose}
                                    doApprovalCheck={this.props.doApprovalCheck}
                                />

                            ) : null
                        }
                    </div>
                </ClientComponentContext.Consumer>
            </NWWindow>
        )
    }

    copyLink(text) {
        const [href, ...info] = text.split(/\s/)
        const infoText = info ? info.join('\n') : ''
        const clipboard = nw.Clipboard.get()

        clipboard.set([
            { type: 'html', data: `<a href="${href}" style="color: rgb(0,0,238);">${href}</a>\n${infoText}` },
            { type: 'text', data: text }
        ])

        return true
    }
}