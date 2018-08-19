import * as React from 'react';
import Preview from '../../../components/Preview2/component.desktop';
import { lastDoc } from '../../../components/ShareReview/helper';
import { getPendingApprovals } from '../../../core/apis/eachttp/audit/audit';
import * as fs from '../../../core/filesystem/filesystem';
import { download } from '../../../core/download/download';
import { ErrorCode } from '../../../core/apis/openapi/errorcode';
import { getErrorMessage } from '../../../core/errcode/errcode';
import __ from './locale';
import * as styles from './styles.css';

const previewType = {
    /**
     * 共享审核
     */
    ShareApv: 'shareview',
    /**
     * 流程审核
     */
    FlowApv: 'flowreview'

}

export default class PreviewView extends React.Component<any, any> {
    state = {
        doc: null,
        exception: null
    }

    async componentWillMount() {
        const { query } = this.props.location

        if (query && query.type) {
            // 审核预览
            switch (query.type) {
                case previewType.ShareApv:
                    this.handleShareApvPreview()
                    break
            }
        }
    }

    async handleShareApvPreview() {
        const { query: { applyid, gns } } = this.props.location
        const pendingApprovals = (await getPendingApprovals()).applyinfos

        if (pendingApprovals.find(approval => approval.applyid === applyid)) {
            const approvalDoc = pendingApprovals.find(approval => approval.docid === `gns://${gns}`)

            if (approvalDoc) {// 预览待审核文件
                this.setState({
                    doc: {
                        ...approvalDoc,
                        name: lastDoc(approvalDoc.docname)
                    }
                })
            } else {  // 预览待审核目录里的文件
                try {
                    const docid = gns.slice(0, gns.length - 33) // 直接父级目录
                    const { files } = await fs.list({ docid: `gns://${docid}`, applyid })
                    const doc = [...files].find(item => item.docid === `gns://${gns}`)
                    if (doc) {
                        this.setState({ doc })
                    } else {
                        this.setState({
                            exception: {
                                errcode: ErrorCode.GNSInaccessible
                            }
                        })
                    }
                } catch (ex) {
                    this.setState({
                        exception: {
                            errcode: ex.errcode
                        }
                    })
                }
            }
        } else { // 审核记录已失效
            this.setState({
                exception: {
                    errcode: ErrorCode.ShareApplyComplete
                }
            })
        }

    }

    download = (doc) => {
        download({ ...doc, name: doc.name }, { checkPermission: false })
    }

    render() {
        const { exception, doc } = this.state;

        return (
            exception ?
                <div className={styles['container']}>
                    < div className={styles['exception-text']}>
                        {
                            exception.errcode === ErrorCode.GNSInaccessible ?
                                __('文件不存在, 可能其所在路径发生变更。')
                                :
                                getErrorMessage(exception.errcode)
                        }
                    </div>
                </div>
                :
                this.state.doc ?
                    <Preview
                        doc={doc}
                        enableCollect={false}
                        doDownload={this.download}
                    />
                    : null
        )
    }
}