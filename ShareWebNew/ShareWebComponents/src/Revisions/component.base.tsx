import * as React from 'react';
import { noop, isFunction } from 'lodash'
import { openUrlByChrome } from '../../core/apis/client/tmp/tmp'
import { getOpenAPIConfig } from '../../core/openapi/openapi'
import { revisions, metaData } from '../../core/apis/efshttp/file/file'
import { buildWebClientURI } from '../../core/config/config'

export default class RevisionsBase extends React.Component<Components.Revisions.Props, Components.Revisions.State>{
    state = {
        revisions: [],

        previewEnabled: true,

        doRevisionView: noop,

        doRevisionsRestore: noop,

        doRevisionDownload: noop
    }

    componentWillMount() {
        if (this.props.doc) {
            this.initRevisions(this.props.doc);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.doc.docid !== this.props.doc.docid) {
            this.initRevisions(nextProps.doc)
        }
    }

    /**
    * 初始化
    */
    async initRevisions({ docid }) {
        try {
            this.setState({
                revisions: docid ? await revisions({ docid }) : []
            })
        }
        catch (err) {
            this.setState({
                revisions: []
            })
        }
    }

    protected async revisionView({ docid, rev }) {
        // post(`http://127.0.0.1:10080/preview?title=${doc.name}`, { doc }, { sendAs: 'json', readAs: 'json' })
        const { userid, tokenid, locale } = getOpenAPIConfig(['userid', 'tokenid', 'locale']);
        // 获取最新的doc
        const metadata = await metaData({ docid })
        // 最新版本，不带rev；非最新版本，带rev
        const url = metadata.rev === rev ?
            await buildWebClientURI({ path: '/login', query: { userid, tokenid, redirect: `/home/documents/all?gns=${encodeURIComponent(docid.replace(/^gns\:\/\//, ''))}`, lang: locale, platform: 'pc' } })
            :
            await buildWebClientURI({ path: '/login', query: { userid, tokenid, redirect: `/home/documents/all?gns=${encodeURIComponent(docid.replace(/^gns\:\/\//, ''))}&rev=${rev}`, lang: locale, platform: 'pc' } })

        openUrlByChrome({ url });
    }

    /**
     * 预览历史版本
     */
    protected async viewRevision(doc, revision) {
        // 获取最新的doc
        try {
            const metadata = await metaData({ docid: doc.docid })
            this.props.doRevisionView && isFunction(this.props.doRevisionRestore) && this.props.doRevisionView({ ...doc, ...metadata }, revision)
        }
        catch (err) {
            this.props.doRevisionView && isFunction(this.props.doRevisionRestore) && this.props.doRevisionView(doc, revision)
        }
    }
}