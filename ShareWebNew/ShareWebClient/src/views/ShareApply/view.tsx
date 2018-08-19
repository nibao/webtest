import * as React from 'react';
import ShareApply from '../../../components/ShareApply/component.desktop';
import ExceptionMessage from '../../../components/ExceptionMessage/component.desktop';
import { docname, isDir } from '../../../core/docs/docs';
import { canAccess } from '../../../core/permission/permission';
import { checkCsfLevel } from '../../../core/csf/csf';
import { download } from '../../../core/download/download';
import { clearRouteCache, Exception } from '../../helper';
import { hashHistory } from 'react-router';
import __ from './locale';

interface Exp {
    type?: Exception;

    detail: any;

}
export default class ShareApplyView extends React.Component<any, any> {

    state = {}
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
     * 获取异常信息
     */
    getException = (exception: Exp): { title: string; detail?: string } => {
        const { type, detail: doc } = exception

        switch (type) {
            case Exception.FILE_MISSING:
                return isDir(doc) ?
                    {
                        title: __('无法打开当前文件夹'),
                        detail: __('找不到文件夹“${name}”，可能文件夹的名称或路径发生变更。', { name: docname(doc) })
                    } :
                    {
                        title: __('无法打开当前文件'),
                        detail: __('找不到文件“${name}”，可能文件的名称或路径发生变更。', { name: docname(doc) })
                    }


            case Exception.PERMISSION_REJECT:
                return isDir(doc) ?
                    {
                        title: __('无法打开当前文件夹'),
                        detail: __('您对文件夹“${name}”没有显示权限。', { name: docname(doc) })
                    } :
                    {
                        title: __('无法打开当前文件'),
                        detail: __('您对文件“${name}”没有预览权限。', { name: docname(doc) })
                    }

            case Exception.LACK_OF_CSF:
                return {
                    title: __('无法打开当前文件'),
                    detail: __('您的密级不足。')
                }

            default:
                return isDir(doc) ?
                    {
                        title: __('无法打开当前文件夹'),
                        detail: ''
                    } :
                    {
                        title: __('无法打开当前文件'),
                        detail: ''
                    }
        }
    }

    clearException = () => {
        this.setState({ exception: null })
    }

    render() {
        return (
            <div>
                <ShareApply
                    doFilePreview={async (doc) => {
                        try {
                            const isFileMissing = await canAccess(doc)
                            const lackOfCSF = isDir(doc) ? true : await checkCsfLevel(doc.docid)
                            if (isFileMissing && lackOfCSF) {
                                this.handlePathChange(doc.docid.slice(6), { newTab: true })
                            } else {
                                this.setState({
                                    exception: {
                                        type: Exception.PERMISSION_REJECT,
                                        detail: doc
                                    }
                                })
                            }
                        } catch (ex) {
                            switch (ex.errcode) {
                                case 404006:
                                    this.setState({
                                        exception: {
                                            type: Exception.FILE_MISSING,
                                            detail: doc
                                        }
                                    })
                                    break

                                case 403065:
                                    this.setState({
                                        exception: {
                                            type: Exception.LACK_OF_CSF,
                                            detail: doc
                                        }
                                    })
                                    break

                                default:
                                    this.setState({
                                        exception: {
                                            detail: doc
                                        }
                                    })
                            }
                        }
                    }}
                    doDirOpen={(doc) => { this.handlePathChange(doc.docid.slice(6, -33), { newTab: true }) }}
                    doDownload={(doc) => download(doc)}
                />

                {
                    this.state.exception ? (
                        <ExceptionMessage
                            {...this.getException(this.state.exception)}
                            onMessageConfirm={this.clearException}
                        />
                    ) : null
                }

            </div>
        )
    }
}