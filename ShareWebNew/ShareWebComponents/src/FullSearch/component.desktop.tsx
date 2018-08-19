import * as React from 'react';
import { isEmpty } from 'lodash';
import FullTextSearch from './FullTextSearch/component.desktop';
import FullSearchBase from './component.base';
import { ShareType, ErrorType } from './FullTextSearch/helper';
import LinkShare from '../LinkShare/component.desktop';
import Share from '../Share/component.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import { docname } from '../../core/docs/docs';
import { getErrorTemplate } from '../../core/errcode/errcode';
import { OpType } from '../../core/optype/optype';
import __ from './locale';

export default class FullSearch extends FullSearchBase {

    render() {
        let { shareType, shareDoc, errorCode, errorDoc } = this.state;
        return (
            <div>
                <FullTextSearch
                    searchKeys={this.props.searchKeys}
                    searchRange={this.props.searchRange}
                    searchTags={this.props.searchTags}
                    doFilePreview={this.handlePreviewFile.bind(this)}
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
            </div>
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
    }
}