import * as React from 'react';
import MyFavorites from '../../../components/MyFavorites/component.desktop';
import Share from '../../../components/Share/component.desktop';
import LinkShare from '../../../components/LinkShare/component.desktop';
import { download } from '../../../core/download/download';
import { clearRouteCache, handleApprovalCheck } from '../../helper';
import { hashHistory } from 'react-router';
import __ from './locale'

export default class MyFavoritesView extends React.Component<any, any> {

    state = {
        shareDoc: undefined,
        linkShareDoc: undefined,
    }

    /**
     * 路径跳转，预览文件&&打开文件所在位置
     */
    handlePathChange(docid: string, { newTab }: { newTab: boolean }) {
        const nextPath = hashHistory.createPath({ pathname: '/home/documents/all', query: { gns: docid } })
        if (newTab) {
            window.open(`/#${nextPath}`)
        } else {
            clearRouteCache('/home/documents', '/home/documents/all')
            hashHistory.push(nextPath)
        }
    }

    /**
     * 内链共享
     */
    handleShare(shareDoc) {
        this.setState({
            shareDoc,
        })
    }

    /**
     * 外链共享
     */
    handleLinkShare(linkShareDoc) {
        this.setState({
            linkShareDoc,
        })
    }

    render() {
        const { shareDoc, linkShareDoc } = this.state
        return (
            <div>

                <MyFavorites
                    doFilePreview={(doc) => { this.handlePathChange(doc.docid.slice(6), { newTab: true }) }}
                    doDirOpen={(doc) => { this.handlePathChange(doc.docid.slice(6, -33), { newTab: true }) }}
                    doShare={(shareDoc) => this.handleShare(shareDoc)}
                    doLinkShare={(linkShareDoc) => this.handleLinkShare(linkShareDoc)}
                    doDownload={(doc) => download(doc)}
                />

                {
                    shareDoc
                        ?
                        (
                            <Share
                                doc={shareDoc}
                                title={__('内链共享')}
                                swf={'/libs/zeroclipboard/dist/ZeroClipboard.swf'}
                                doApvJump={() => { handleApprovalCheck() }}
                                onCloseDialog={() => { this.setState({ shareDoc: undefined }) }}
                            />
                        ) : null

                }

                {
                    linkShareDoc
                        ?
                        (
                            <LinkShare
                                doc={linkShareDoc}
                                swf={'/libs/zeroclipboard/dist/ZeroClipboard.swf'}
                                doApprovalCheck={() => { handleApprovalCheck() }}
                                onErrorConfirm={() => { this.setState({ linkShareDoc: undefined }) }}
                                doConfigurationClose={() => { this.setState({ linkShareDoc: undefined }) }}
                            />
                        ) : null
                }

            </div>
        )
    }
}