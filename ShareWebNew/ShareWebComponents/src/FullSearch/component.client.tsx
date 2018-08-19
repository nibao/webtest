import * as React from 'react';
import { isEmpty } from 'lodash';
import FullTextSearch from './FullTextSearch/component.client';
import FullSearchBase from './component.base';
import Dialog from '../../ui/Dialog2/ui.client';
import Panel from '../../ui/Panel/ui.desktop';
import __ from './locale';
import { ClientComponentContext } from '../helper'
import { ShareType, ErrorType } from './FullTextSearch/helper';
import LinkShare from '../LinkShare/component.client';
import Share from '../Share/component.client';
import NWWindow from '../../ui/NWWindow/ui.client';
import MessageDialog from '../../ui/MessageDialog/ui.client';
import { docname } from '../../core/docs/docs';
import { getErrorTemplate, getErrorMessage } from '../../core/errcode/errcode';
import { OpType } from '../../core/optype/optype';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import Preview from '../Preview2/component.client';

export default class FullSearch extends FullSearchBase {

    render() {
        const { onOpenFullSearchDialog, onCloseDialog, fields, id } = this.props
        let { shareType, shareDoc, errorCode, errorDoc, previewDoc } = this.state;

        return (
            <NWWindow
                id={id}
                width={1200}
                height={650}
                title={__('全文检索')}
                onOpen={onOpenFullSearchDialog}
                onClose={onCloseDialog}
                {...fields}
            >
                <ClientComponentContext.Consumer>
                    <Panel>
                        <FullTextSearch
                            searchKeys={this.props.searchKeys}
                            searchTags={this.props.searchTags}
                            searchRange={this.props.searchRange}
                            doFilePreview={this.props.doFilePreview}
                            doDirOpen={this.handleOpenDir.bind(this)}
                            onError={this.handleError.bind(this)}
                            onShareDocChange={this.handleShareDocChange.bind(this)}
                        />
                        {
                            this.renderShareDialog(shareType, shareDoc)
                        }
                        {
                            this.renderErrorDialog(errorCode, errorDoc)
                        }
                        {
                            // this.renderPreivewDialog(previewDoc)
                        }
                    </Panel>
                </ClientComponentContext.Consumer>
            </NWWindow>
        )
    }

    renderShareDialog(shareType, doc) {
        switch (shareType) {
            case ShareType.LINKSHARE:
                if (!isEmpty(doc)) {
                    return (
                        <LinkShare
                            doc={doc}
                            doConfigurationClose={this.handleCloseShareDialog.bind(this)}
                            onErrorConfirm={this.handleCloseShareDialog.bind(this)}
                            onCloseLinkShareDialog={this.handleCloseShareDialog.bind(this)}
                            doApprovalCheck={this.props.doApprovalCheck}
                        >
                        </LinkShare>
                    )
                }
                break;
            case ShareType.SHARE:
                if (!isEmpty(doc)) {
                    return (
                        <Share
                            doc={doc}
                            onCloseDialog={this.handleCloseShareDialog.bind(this)}
                            doApvJump={this.props.doApprovalCheck}
                        >
                        </Share>
                    )
                }
                break;
            case ShareType.NOOP:
                return;
            default:
                break;
        }
    }

    renderErrorDialog(errorCode, errorDoc) {
        return errorCode === ErrorType.NULL ?
            null
            :
            <NWWindow
                modal={true}
                title={__('提示')}
                onClose={this.handleCloseErrorDialog.bind(this)}
            >
                <MessageDialog
                    onConfirm={this.handleCloseErrorDialog.bind(this)}
                >
                    {
                        errorCode === 404006 ?
                            __('文件“${filename}”不存在, 可能其所在路径发生变更。', { filename: docname(errorDoc) })
                            :
                            getErrorTemplate(errorCode, OpType.COLLECT)({ filename: docname(errorDoc) })
                    }

                </MessageDialog>
            </NWWindow>
    }

    renderPreivewDialog(previewDoc) {
        return previewDoc ?
            <Preview
                doc={previewDoc}
                onClosePreviewDialog={this.handleClosePreivewDialog.bind(this)}

            />
            :
            null
    }
}