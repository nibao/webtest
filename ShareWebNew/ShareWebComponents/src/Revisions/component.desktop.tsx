import * as React from 'react';
import { checkPermItem, SharePermission } from '../../core/permission/permission'
import { revisions } from '../../core/apis/efshttp/file/file';
import Revision from './Revision/component.desktop'
import RevisionsBase from './component.base';
import __ from './locale'
import * as styles from './styles.desktop.css'

export default class Revisions extends RevisionsBase {

    doc: Core.Docs.Doc = this.props.doc  // 用this.doc代替this.props.doc

    static contextTypes = {
        toast: React.PropTypes.any
    }

    componentWillReceiveProps({ doc }) {
        this.initRevisions(doc)
    }

    /**
    * 初始化
    */
    protected async initRevisions(doc) {
        try {
            const result = await checkPermItem(doc.docid, SharePermission.PREVIEW)

            this.doc = doc

            if (result) {
                // 有预览权限
                this.setState({
                    revisions: doc.docid ? await revisions({ docid: doc.docid }) : [],
                    previewEnabled: true
                })
            } else {
                // 没有预览权限
                this.setState({
                    revisions: [],
                    previewEnabled: false
                })
            }
        }
        catch (err) {
            this.setState({
                revisions: []
            })
        }

    }

    render() {
        const { doRevisionView, doRevisionRestore, doRevisionDownload } = this.props
        const { revisions, previewEnabled } = this.state

        return (
            previewEnabled ?
                <div>
                    {
                        revisions.map(revision => (
                            <Revision
                                key={revision.rev}
                                doc={this.doc}
                                revision={revision}
                                revisions={revisions}
                                doRevisionView={this.viewRevision.bind(this)}
                                doRevisionRestore={doRevisionRestore}
                                doRevisionsDownload={doRevisionDownload}
                            />
                        ))
                    }
                </div>
                :
                <div className={styles['empty-area']}>{__('版本列表为空')}</div>
        )
    }
}