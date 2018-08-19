import * as React from 'react';
import { hashHistory } from 'react-router';
import { last } from 'lodash';
import ShareReview from '../../../components/ShareReview/component.desktop';
import { lastDoc } from '../../../components/ShareReview/helper';
import { MessageDialog } from '../../../ui/ui.desktop';
import { ErrorCode } from '../../../core/apis/openapi/errorcode';
import { getPendingApprovals } from '../../../core/apis/eachttp/audit/audit';
import { getErrorMessage } from '../../../core/errcode/errcode';
import { isDir } from '../../../core/docs/docs';
import * as fs from '../../../core/filesystem/filesystem';
import __ from './locale';

export default class ShareAuditView extends React.Component<any, any> {
    state = {
        exception: null,
        crumbs: []
    }

    handlePathChange = async ({ applyId = this.props.location.query.applyid, doc = null } = {}) => {
        if (!doc) {
            hashHistory.push('/home/approvals/share-review')
        } else {
            try {
                const pendingApproval = ((await getPendingApprovals()).applyinfos).find(approval => approval.applyid === applyId)
                if (pendingApproval) { // 审核记录未失效
                    this.setState({
                        crumbs: await fs.getDocsChain({ ...doc, applyid: applyId })
                    })
                    if (isDir(doc)) {
                        const path = hashHistory.createPath({
                            pathname: '/home/approvals/share-review',
                            query: { type: 'shareview', applyid: applyId, gns: doc.docid.slice(6) }
                        })
                        hashHistory.push(path)
                    } else {
                        const path = hashHistory.createPath({
                            pathname: '/preview',
                            query: { type: 'shareview', applyid: applyId, gns: doc.docid.slice(6) }
                        })
                        window.open(`/#${path}`)
                    }
                } else {
                    this.setState({
                        exception: {
                            errcode: ErrorCode.ShareApplyComplete,
                            doc
                        }
                    })
                }
            } catch (ex) {
                this.setState({
                    exception: {
                        ...ex,
                        doc
                    }
                })
            }
        }
    }

    clearException = () => {
        const { exception } = this.state;
        if (exception && exception.upperDocsChain) {
            this.handlePathChange({ doc: last(exception.upperDocsChain) })
        } else if (exception && exception.errcode === ErrorCode.ShareApplyComplete) {
                hashHistory.push('/home/approvals/share-review')
            }
        this.setState({ exception: null })
    }

    render() {
        const { exception, crumbs } = this.state;
        const doc = this.props.location.query && this.props.location.query.gns ?
            {
                docid: `gns://${this.props.location.query.gns}`,
                applyid: this.props.location.query.applyid
            }
            : null

        return (
            <div>
                <ShareReview
                    location={this.props.location}
                    doc={!exception && doc}
                    crumbs={!exception && crumbs}
                    onPathChange={this.handlePathChange}
                />
                {
                    exception ?
                        <MessageDialog
                            onConfirm={this.clearException}
                        >
                            {
                                // 文件/文件夹不存在
                                !exception.errcode && exception.upperDocsChain ?
                                    isDir(exception.doc) ?
                                        __('文件夹“${filename}”不存在, 可能其所在路径发生变更。', { filename: exception.doc.name || lastDoc(exception.doc.docname) })
                                        : __('文件“${filename}”不存在, 可能其所在路径发生变更。', { filename: exception.doc.name || lastDoc(exception.doc.docname) })
                                    :
                                    getErrorMessage(exception.errcode)
                            }
                        </MessageDialog>
                        : null
                }
            </div>
        )
    }
}