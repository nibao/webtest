import * as React from 'react'
import { last, includes, noop } from 'lodash'
import { isDir } from '../../core/docs/docs'
import * as fs from '../../core/filesystem/filesystem'
import { getViews } from '../../core/apis/eachttp/entrydoc/entrydoc'

export default class DocSelector2Base extends React.Component<Components.DocSelector2.Props, Components.DocSelector2.State> {

    static defaultProps = {
        description: '',
        onCacnel: noop,
        onConfirm: noop
    }

    state = {
        crumbs: [],
        selections: [],
        loading: false,
        list: {
            dirs: [],
            files: []
        },
        viewsOpen: [],
        viewsinfo: []
    }

    componentWillMount() {
        this.getViewsInfo()
        this.load(null)
    }

    /** 
     * 获取分类视图 
     */
    private async getViewsInfo() {
        const { viewsinfo } = await getViews(void (0))
        const viewsMap = viewsinfo.reduce((pre, viewInfo) => ({ ...pre, [viewInfo.view_doctype]: viewInfo }), {})
        /**
         * 分类视图顺序为 个人文档、个人群组文档、共享群组文档、共享文档、文档库、归档库
         */
        const viewOrder = [10, 20, 21, 11, 30, 31, 40, 41]
        // 默认只展开个人文档和文档库
        const viewsOpen = viewsinfo.map(({ view_doctype }) => view_doctype).filter(item => item === 10 || item === 30)

        this.setState({
            viewsinfo: viewOrder.reduce((pre, view_doctype) => viewsMap[view_doctype] ? [...pre, viewsMap[view_doctype]] : pre, []),
            viewsOpen
        })
    }

    /** 
     * 列举文件对象 
     * @param doc 列举doc目录下的子文件和子文件夹。如果doc为null，那么显示顶级目录
     */
    protected async load(doc, { useCache = true, reload = true } = {}) {

        let crumbs = await fs.getDocsChain(doc), preview = null
        const currentDoc = last(crumbs)

        if (!(currentDoc === null || isDir(currentDoc))) {
            preview = currentDoc
            crumbs = crumbs.slice(0, -1)
        }

        if (preview) {
            return
        }
        this.setState({
            crumbs,
            selections: []
        }, async () => {
            const { crumbs } = this.state
            const currentDir = last(crumbs)

            if (reload && !preview) {
                await new Promise(resolve => {
                    this.setState({
                        list: { dirs: [], files: [] },
                        loading: true
                    }, resolve)
                })
            }

            const list = await fs.list(currentDir, { useCache })

            if (last(this.state.crumbs) === currentDir) {
                this.setState({
                    list,
                    loading: false
                })
            }
        })
    }

    /** 
     * 切换分类视图展开状态 
     */
    protected toggleViewOpen(viewDocType) {
        const { viewsOpen } = this.state
        this.setState({
            viewsOpen: includes(viewsOpen, viewDocType) ? viewsOpen.filter(type => type !== viewDocType) : [...viewsOpen, viewDocType]
        })
    }
}