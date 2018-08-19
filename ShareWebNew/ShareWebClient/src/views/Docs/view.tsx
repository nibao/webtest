import * as React from 'react';
import Docs from '../../../components/Docs/component.desktop'
import ExceptionMessage from '../../../components/ExceptionMessage/component.desktop'
import { setTitle } from '../../../util/browser/browser'
import { PureComponent } from '../../../ui/decorators';
import { canAccess } from '../../../core/permission/permission'
import { docname, isDir } from '../../../core/docs/docs'
import { setOEMtitle } from '../../../core/oem/oem'
import { openDoc, Exception, handleApprovalCheck } from '../../helper'
import __ from './locale'

interface Exp {
    type?: Exception;

    detail: any;

}

interface DocsViewState {
    exception?: Exp | null;
}

@PureComponent
export default class DocsView extends React.Component<any, DocsViewState> {
    state = {}

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
                        detail: __('文件夹“${name}”不存在, 可能其所在路径发生变更。', { name: docname(doc) })
                    } :
                    {
                        title: __('无法打开当前文件'),
                        detail: __('文件“${name}”不存在, 可能其所在路径发生变更。', { name: docname(doc) })
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
        const { history, location } = this.props
        const { query: { gns, rev } } = location
        const doc = gns ? { docid: `gns://${gns}`, rev } : null

        return (
            <div style={{ height: '100%' }}>
                <Docs
                    swf={'/libs/zeroclipboard/dist/ZeroClipboard.swf'}
                    doc={doc}
                    onLoad={doc => {
                        if (doc === null || isDir(doc)) {
                            setOEMtitle()
                        } else {
                            setTitle(docname(doc))
                        }
                    }}
                    onPathChange={async (doc, { newTab, latest }) => {
                        // 回到文档首页
                        if (!doc) {
                            openDoc(doc, { newTab, latest })
                        } else {
                            try {
                                if (await canAccess(doc)) {
                                    openDoc(doc, { newTab, latest })
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

                                    default:
                                        this.setState({
                                            exception: {
                                                detail: doc
                                            }
                                        })
                                }
                            }
                        }
                    }}
                    onRequestGlobalSearch={(key, range) => {
                        range ?
                            history.push(`/home/search?keys=${encodeURIComponent(key)}&range=${range}`)
                            : history.push(`/home/search?keys=${encodeURIComponent(key)}`)
                    }}
                    onRequestGlobalSearchForTag={(tag) => {
                        history.push(`/home/search?tags=${encodeURIComponent(tag)}`)
                    }}
                    doApprovalCheck={() => { handleApprovalCheck() }}
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