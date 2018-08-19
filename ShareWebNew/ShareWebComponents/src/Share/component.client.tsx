import * as React from 'react';
import * as classnames from 'classnames';
import NWWindow from '../../ui/NWWindow/ui.client'
import Overlay from '../../ui/Overlay/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop'
import { setClipboard } from '../../core/apis/client/tmp/tmp'
import VisitorAdder from '../VisitorAdder/component.client';
import { ClientComponentContext } from '../helper';
import Mounting from '../Mounting/component.client'
import ShareBase from './component.base';
import ApvCaseDialog from './ApvCaseDialog/component.client';
import ErrorMessages from './ErrorMessages/component.client';
import SecretModeMessages from './SecretModeMessages/component.client';
import Config from './Config/component.client'
import __ from './locale';

export default class Share extends ShareBase {
    /**
     * 复制内链地址
     */
    private async copyLink(url: string) {
        try {
            await setClipboard({ url })
            this.copyLinkSuccess()
        }
        catch (err) {
        }
    }

    render() {
        const { onOpenShareDialog, onCloseDialog, fields, id } = this.props
        const { permConfigs, showShare, errCode, apvCase, secretMode, copySuccess, disabledOptions, showAdderVisitor, displayErrCode } = this.state;

        return (
            <NWWindow
                id={id}
                title={__('内链共享')}
                onOpen={onOpenShareDialog}
                onClose={() => onCloseDialog()}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <div>
                        {
                            !showShare && !errCode && !apvCase ?
                                <Mounting />
                                : null
                        }
                        {
                            showShare ?
                                <Config
                                    filePath={this.filePath}
                                    permConfigs={permConfigs}
                                    disabledOptions={disabledOptions}
                                    doctype={this.doctype}
                                    template={this.template}
                                    swf={this.props.swf}
                                    doCopyLink={this.copyLink.bind(this)}
                                    onCopyLinkSuccess={this.copyLinkSuccess.bind(this)}
                                    onClickMoreVisitors={() => this.setState({ showAdderVisitor: true })}
                                    onAddPermConfigs={this.addPermConfig.bind(this)}
                                    displayErrCode={displayErrCode}
                                    onRemoveConfig={this.removeConfig.bind(this)}
                                    onEditConfig={this.editConfig.bind(this)}
                                    onCancel={this.props.onCloseDialog}
                                    onConfirm={() => this.confirm()}
                                />
                                : null
                        }
                        {
                            showAdderVisitor ?
                                <NWWindow
                                    title={__('添加访问者')}
                                    onOpen={nwWindow => this.showAdderVisitorWindow = nwWindow}
                                    onClose={() => this.toggleVisitorAdderVisible(false)}
                                    modal={true}
                                >
                                    <VisitorAdder
                                        onAddVisitor={(visitorsNewAdded) => { this.showAdderVisitorWindow.close(); this.addPermConfig(visitorsNewAdded) }}
                                        onCancel={() => this.showAdderVisitorWindow.close()}
                                    />
                                </NWWindow>
                                :
                                null
                        }
                        {
                            secretMode ?
                                <NWWindow
                                    title={__('提示')}
                                    onOpen={nwWindow => this.secretModeWindow = nwWindow}
                                    onClose={() => this.toggleSectedMode(false)}
                                    modal={true}
                                >
                                    <SecretModeMessages
                                        onCancel={() => this.secretModeWindow.close()}
                                        onConfirm={() => { this.setPermissions(); this.secretModeWindow.close() }}
                                        csflevelText={this.csflevelText}
                                        doc={this.doc}
                                    />
                                </NWWindow>
                                : null
                        }
                        {
                            apvCase ?
                                <ApvCaseDialog
                                    onConfirm={() => { this.setState({ apvCase: false }); this.props.onCloseDialog() }}
                                    doApvJump={() => this.props.doApvJump()}
                                />
                                : null
                        }
                        {
                            showShare && errCode ?
                                <NWWindow
                                    title={__('提示')}
                                    onOpen={nwWindow => this.errCodeWindow = nwWindow}
                                    onClose={() => showShare ? this.setState({ errCode: undefined }) : this.props.onCloseDialog()}
                                    modal={true}
                                >
                                    <ErrorMessages
                                        onConfirmError={() => this.errCodeWindow.close()}
                                        errCode={errCode}
                                        doc={this.doc}
                                        template={this.newLinkTemplate}
                                    />
                                </NWWindow>
                                : null
                        }
                        {
                            !showShare && errCode ?
                                <ErrorMessages
                                    onConfirmError={this.props.onCloseDialog}
                                    errCode={errCode}
                                    doc={this.doc}
                                    template={this.newLinkTemplate}
                                />
                                : null
                        }
                        {
                            copySuccess ?
                                <Overlay position="top center">
                                    {__('链接已复制。')}
                                </Overlay>
                                :
                                null
                        }
                    </div>
                </ClientComponentContext.Consumer>
            </NWWindow>
        )
    }
} 