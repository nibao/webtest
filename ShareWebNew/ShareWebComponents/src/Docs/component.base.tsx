import * as React from 'react'
import { includes, last, noop } from 'lodash'
import { formatTime } from '../../util/formatters/formatters'
import { docname } from '../../core/docs/docs'
import * as fs from '../../core/filesystem/filesystem'
import { metaData } from '../../core/apis/efshttp/file/file'
import { isDir } from '../../core/docs/docs'
import { getViews } from '../../core/apis/eachttp/entrydoc/entrydoc'
import { ViewDocType } from '../../core/entrydoc/entrydoc'
import { add as favoriteAdd, check as favoriteCheck, del as favoriteDelete } from '../../core/apis/efshttp/favorites/favorites'
import { PureComponent } from '../../ui/decorators'
import { runtime } from '../../core/upload/upload'
import { download, subName } from '../../core/download/download'
import { rename } from '../../core/rename/rename'
import __ from './locale'
import { Layout, SortRule } from './helper'

@PureComponent
export default class DocsBase extends React.Component<any, any>{

    static contextTypes = {
        toast: React.PropTypes.func
    }

    state = {
        crumbs: [],
        list: { dirs: [], files: [] },
        selections: [],
        drawer: [],
        viewsinfo: [],
        viewsOpen: [],
        sortRule: SortRule.NameUp,
        layout: Layout.List,
        contextMenuPosition: [0, 0],
        showContextMenu: false,
        actions: {},
        favoriteStatus: {},
        loading: false,
        selecting: false,
        dragUploadDest: false,
        runtime: '',
        savingTo: false,
        favoriteDoc: undefined,
        addToFavoriteErrorCode: undefined,
        copying: false,
        moving: false,
        errors: [],
        confirmError: noop
    }

    unsubscribe: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.handleFsChange = this.handleFsChange.bind(this)
    }

    revision: Core.APIs.EFSHTTP.RevisionsResult = {}  // 当前正在预览文件的版本

    componentWillMount() {
        fs.clearCache()
        this.getViewsInfo()
        this.load(this.props.doc)
        this.getUploadRuntime()
        this.unsubscribe = [
            fs.subscribe(fs.EventType.FS_INSERT, this.handleFsChange),
            fs.subscribe(fs.EventType.FS_UPDATE, this.handleFsChange),
            fs.subscribe(fs.EventType.FS_DELETE, this.handleFsChange)
        ]
    }

    componentWillReceiveProps({ doc }) {
        if (
            doc !== this.props.doc && (
                !doc && this.props.doc ||
                doc && !this.props.doc ||
                doc.docid !== this.props.doc.docid
            )
        ) {
            this.load(doc)
        }
    }

    componentDidUpdate(preProps, preState) {
        if (this.refs['docs'] && !preState.actions['createDir'] && this.state.actions['createDir']) {
            this.refs['docs'].scrollTop = 0
        }
    }

    componentWillUnmount() {
        this.unsubscribe.forEach(fn => fn())
    }

    /**
     * fileSystem change
     */
    handleFsChange(doc) {
        const currentDir = last(this.state.crumbs)
        if (fs.isChildOf(currentDir, doc)) {
            this.load(currentDir, { useCache: true, reload: false })
        }
    }

    /** 
     * 获取上传插件运行环境
     */
    async getUploadRuntime() {
        this.setState({
            runtime: await runtime
        })
    }

    /** 文件右击 */
    handleContextMenu(e) {
        if (!e.defaultPrevented) {
            e.preventDefault()
            this.setState({
                contextMenuPosition: [e.clientX, e.clientY],
                showContextMenu: true
            })
        }
    }

    /** 空白处右击 */
    handleMainContextMenu(e) {
        if (!e.defaultPrevented) {
            this.setState({
                selections: []
            })
        }
        this.handleContextMenu(e)
    }

    /** 关闭右击菜单 */
    closeContextMenu() {
        this.setState({
            showContextMenu: false
        })
    }

    /** 获取分类视图 */
    async getViewsInfo() {
        const { viewsinfo } = await getViews(void (0))
        const viewsMap = viewsinfo.reduce((pre, viewInfo) => ({ ...pre, [viewInfo.view_doctype]: viewInfo }), {})
        /**
         * 分类视图顺序为 个人文档、个人群组文档、共享群组文档、共享文档、文档库、归档库
         */
        const viewOrder = [10, 20, 21, 11, 30, 31, 40, 41]
        this.setState({
            viewsinfo: viewOrder.reduce((pre, view_doctype) => viewsMap[view_doctype] ? [...pre, viewsMap[view_doctype]] : pre, []),
            viewsOpen: viewsinfo.map(({ view_doctype }) => view_doctype)
        })
    }

    /** 列举文件对象 */
    async load(doc, { useCache = true, reload = true } = {}) {

        try {
            let crumbs = await fs.getDocsChain(doc), preview = null
            this.revision = {}
            const currentDoc = last(crumbs)

            if (!(currentDoc === null || isDir(currentDoc))) {
                if (doc.rev && doc.rev !== currentDoc.rev) {
                    // 预览的当前版本不是最新版本, 获取当前版本的信息
                    try {
                        this.revision = await metaData({ docid: doc.docid, rev: doc.rev })
                    }
                    catch (err) {
                        this.revision = currentDoc
                    }

                } else {
                    this.revision = currentDoc
                }

                preview = currentDoc
                crumbs = crumbs.slice(0, -1)
            }

            this.apply({ createDir: false, preview, rename: null })

            if (typeof this.props.onLoad === 'function') {
                this.props.onLoad((currentDoc === null || isDir(currentDoc)) ? currentDoc : this.revision)
            }

            /**
             * 预览文件不加载文件列表
             */
            if (preview) {
                return
            }

            this.setState({
                crumbs,
                selections: []
            }, async () => {
                const { crumbs, sortRule } = this.state
                const currentDir = last(crumbs)

                if (reload && !preview) {
                    await new Promise(resolve => {
                        this.setState({
                            list: { dirs: [], files: [] },
                            loading: true
                        }, resolve)
                    })
                }
                const list = await fs.list(currentDir, { ...sortRule, useCache })

                if (last(this.state.crumbs) === currentDir) {
                    this.setState({
                        list,
                        loading: false
                    })
                }
                this.checkFavorite([...list.dirs, ...list.files])

            })
        } catch (e) {
            /**
             * 列举目录出错
             */
            await new Promise(resolve => {
                this.setState({
                    errors: [...this.state.errors, e],
                    confirmError: resolve
                })
            })
            this.setState({
                errors: this.state.errors.slice(1)
            })
            if (e && e.upperDocsChain) {
                this.handlePathChange(last(e.upperDocsChain))
            }
        }
    }

    /**
     * 路径发生变化
     * @param newTab 是否打开新标签页
     * @param latest 是否是最新版本
     */
    handlePathChange(doc, { newTab = false, latest = true } = {}) {
        if (typeof this.props.onPathChange === 'function') {
            this.props.onPathChange(doc, { newTab, latest })
        } else {
            this.load(doc)
        }
    }

    handleGlobalSearch(key, range) {
        if (typeof this.props.onRequestGlobalSearch === 'function') {
            this.props.onRequestGlobalSearch(key, range)
        }
    }

    /**
     * 点击标签后的跳转
     */
    handleGlobalSearchForTag(tag) {
        if (typeof this.props.onRequestGlobalSearchForTag === 'function') {
            this.props.onRequestGlobalSearchForTag(tag)
        }
    }

    /** 查询收藏状态 */
    async checkFavorite(docs = []) {
        if (docs.length) {
            this.setState({
                favoriteStatus: (await favoriteCheck({ docids: docs.map(({ docid }) => docid) }))
                    .reduce((favoriteStatus, { docid, favorited }) => ({ ...favoriteStatus, [docid]: favorited }), {})
            })
        }
    }

    /**
     * 开始选择文件
     */
    startSelect() {
        this.setState({
            selecting: true
        })
    }

    /**
     * 结束选择文件
     */
    endSelect() {
        this.setState({
            selecting: false,
            selections: []
        })
    }

    /** 选中项改变 */
    handleSelectionChange(selections) {
        this.setState({
            selections
        })
    }

    /** 切换全选 */
    toggleSelectAll() {
        const { list: { dirs, files }, selections } = this.state
        const docs = [...dirs, ...files]
        this.setState({
            selections: docs.length === selections.length ? [] : docs
        })
    }

    /** 切换排序规则 */
    async toggleSortRule(sortRule) {
        this.setState({
            sortRule
        }, () => {
            this.load(last(this.state.crumbs))
        })
    }

    /** 切换分类视图展开状态 */
    toggleViewOpen(viewDocType) {
        const { viewsOpen } = this.state
        this.setState({
            viewsOpen: includes(viewsOpen, viewDocType) ? viewsOpen.filter(type => type !== viewDocType) : [...viewsOpen, viewDocType]
        })
    }

    /**
     * 设置拖拽上传目标目录
     */
    setDragUploadDest(doc) {
        if (this.state.runtime === 'html5') {
            this.setState({
                dragUploadDest: doc
            })
        }
    }

    /** 上传文件成功 */
    async handleUploadSuccess(file) {
        const { crumbs } = this.state
        const currentDir = last(crumbs)
        const { dest, csflevel, docid, size, modified, name } = file

        fs.insert({ ...dest, csflevel, docid, size, modified, name })

        if (currentDir && currentDir.docid === dest.docid) {
            this.load(currentDir, { useCache: true, reload: false })
        }
    }

    /** 执行文件操作  */
    async apply(action) {
        await new Promise(resolve => this.setState({
            actions: { ...this.state.actions, ...action }
        }, resolve))
    }

    /**
     * 切换抽屉
     */
    toggleActionDrawer(docs = []) {
        this.setState({
            drawer: docs
        })
    }

    /** 群组管理 */
    manageGroup() {
        this.apply({ manageGroup: true })
    }

    /** 关闭群组管理 */
    async handleManageGroupClose() {
        await this.apply({
            manageGroup: false
        })
        if (!includes(this.state.viewsOpen, ViewDocType.GroupDoc)) {
            this.setState({
                viewsOpen: [...this.state.viewsOpen, ViewDocType.GroupDoc]
            })
        }
        if (last(this.state.crumbs) === null) {
            this.load(null, { useCache: false, reload: true })
        }
    }

    /** 创建文件夹 */
    createDir() {
        if (!this.state.actions['createDir']) {
            this.apply({ createDir: true })
        }
    }

    /** 创建文件夹成功 */
    async handleCreateDirSuccess(dir) {
        this.apply({ createDir: false })
        if (dir) {
            const { crumbs } = this.state
            fs.insert(dir)
            this.load(last(crumbs), { useCache: true, reload: false })
        }
    }

    /** 取消创建文件夹 */
    handleCreateDirCancel() {
        this.apply({ createDir: false })
    }

    /** 内链共享 */
    internalShare([doc]) {
        if (doc) {
            this.apply({ internalShare: { ...doc } })
        } else {
            this.apply({ internalShare: null })
        }
    }

    /** 外链共享 */
    externalShare([doc]) {
        this.apply({ externalShare: doc })
    }

    /** 共享邀请 */
    shareInvitation([doc]) {
        this.apply({ shareInvitation: doc })
    }

    /** 下载文件 */
    download(docs) {
        download(docs)
    }

    /** 重命名 */
    async rename([doc]) {
        await rename(doc, () => {
            return new Promise((resolve, reject) => {
                this.apply({
                    rename: {
                        doc,
                        confirm(name) {
                            resolve(name)
                        },
                        cancel() {
                            reject()
                        }
                    }
                })
            })
        })
        this.apply({ rename: null })
    }

    /** 复制到 */
    copyTo(docs) {
        this.apply({ copyTo: docs })
    }

    handleCopyToCancel() {
        this.apply({ copyTo: null })
        this.setState({
            selections: [],
            selecting: false
        })
    }

    handleCopyToComplete() {
        this.apply({ copyTo: null })
        this.setState({
            selections: [],
            selecting: false
        })
    }

    /** 移动到 */
    moveTo(docs) {
        this.apply({ moveTo: docs })
    }

    handleMoveToCancel() {
        this.apply({ moveTo: null })
        this.setState({
            selections: [],
            selecting: false
        })
    }

    handleMoveToComplete() {
        this.apply({ moveTo: null })
        this.setState({
            selections: [],
            selecting: false
        })
    }

    /** 删除 */
    delete(docs) {
        this.apply({ delete: docs })
    }

    /**删除单个文件成功 */
    handleSingleDeleteSuccess() {
        this.apply({
            delete: null
        })
        this.setState({
            selecting: false
        })
    }

    /**
     * 删除成功
     */
    handleDeleteSuccess() {
        this.apply({
            delete: null
        })
        this.setState({
            selecting: false
        })
    }

    /** 收藏/取消收藏 */
    async toggleFavorite([doc]) {
        const { favoriteStatus } = this.state
        const { toast } = this.context
        if (favoriteStatus[doc.docid]) {
            try {
                await favoriteDelete({ docid: doc.docid })
                this.setState({
                    favoriteStatus: { ...favoriteStatus, [doc.docid]: false }
                })
                if (typeof toast === 'function') {
                    toast(__('取消收藏'))
                }
            }
            catch (error) {
                throw error
            }

        } else {
            try {
                await favoriteAdd({ docid: doc.docid })
                this.setState({
                    favoriteStatus: { ...favoriteStatus, [doc.docid]: true }
                })
                if (typeof toast === 'function') {
                    toast(__('收藏成功'))
                }
            }
            catch (error) {
                this.setState({
                    favoriteDoc: doc,
                    addToFavoriteErrorCode: error.errcode,
                })
            }

        }
    }

    /** 文件评论 */
    comment([doc]) {
        this.apply({ comment: doc })
    }

    /** 编辑标签 */
    editTags(docs) {
        this.apply({ editTags: docs })
    }

    /** 编辑标签完成 */
    handleEditTagComplete() {
        this.apply({ editTags: null })
        if (this.state.selections.length === 1) {
            this.setState({
                selections: [...this.state.selections]
            })
        }
    }

    /** 文件流程审核 */
    fileFlow([doc]) {
        this.apply({ fileFlow: doc })
    }

    /** 查看大小 */
    readSize(docs) {
        this.apply({ readSize: docs })
    }

    /** 刷新 */
    refresh() {
        this.load(last(this.state.crumbs), { useCache: false, reload: true })
    }

    /**
     * 打开转存窗口
     */
    handleSaveTo() {
        this.setState({
            savingTo: true
        })
    }

    /**
     * 转存完成
     */
    saveToComplete() {
        this.setState({
            savingTo: false
        })
    }

    /**
    * 收藏失败，用户确认后执行
    */
    protected handleFavoriteError() {
        this.setState({
            favoriteDoc: undefined,
            addToFavoriteErrorCode: undefined,
        })
        this.load(last(this.state.crumbs), { useCache: false, reload: false })
    }

    /**
     * 下载某个版本，下载文件名需要命名为 “文件名_修改时间”，同时需要截取文件名，防止名字过长，下载失败
     */
    protected revisionDownload(doc: Core.Docs.Doc, revision: Core.APIs.EFSHTTP.RevisionsResult) {
        const name = docname(revision)
        const index = name.lastIndexOf('.')
        // time的格式为_20180524121212
        const time = '_' + (revision.modified ? formatTime(revision.modified / 1000, 'yyyy/MM/dd/HH/mm/ss').split('/').join('') : '---')
        // baseName为不加后缀的文件名
        const baseName = index !== -1 ? name.substring(0, index) : name
        // 通过subName方法，截取前面的字符
        const splitName = subName({ ...doc, name: baseName }, '', 750 - (time + '...').length)
        // 如果splitName和baseName不相等，需要加上'...'，最后的文件名格式类似xxx..._20180524121212.docx
        const saveName = splitName + (splitName !== baseName ? '...' : '') + time + (index !== -1 ? name.substring(index, name.length) : '')
        download({ ...doc, ...revision }, { IOSDisabled: true, WeChatDisabled: true, checkPermission: true }, saveName)
    }

    /**
     * 还原历史版本
     */
    protected restoreRevision(doc: Core.Docs.Doc, revision: Core.APIs.EFSHTTP.RevisionsResult) {
        this.apply({
            restoreRevision: {
                doc,
                revision
            }
        })
    }

    /**
     * 还原历史版本成功
     */
    protected restoreSuccess() {
        this.restoreCancel()
    }

    /**
     * 取消还原历史版本
     */
    protected restoreCancel() {
        this.apply({
            restoreRevision: null
        })
    }
}