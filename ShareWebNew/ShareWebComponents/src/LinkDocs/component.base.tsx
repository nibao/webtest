import * as React from 'react'
import { noop, last, includes, isFunction } from 'lodash'
import session from '../../util/session/session'
import { checkLinkPerm, LinkSharePermission } from '../../core/permission/permission'
import { runtime } from '../../core/upload/upload'
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { LinkReqStatus } from '../../core/permission/permission'
import { setup as setupOpenApi } from '../../core/openapi/openapi'
import * as fs from '../../core/filesystem/filesystem'
import { get } from '../../core/apis/efshttp/link/link'
import { isDir } from '../../core/docs/docs'
import { download, subscribe, EventType } from '../../core/download/download'

export enum ErrCode {
    NoPermission = 1
}

export default class LinkDocsBase extends React.Component<Components.LinkDocs.Props, Components.LinkDocs.State> {
    static defaultProps = {
        linkDoc: {
            link: '',
            docid: ''
        },

        onLoginSuccess: noop,

        onRedirectDest: noop,

        onPathChange: noop,

        onRequestChangePassword: noop
    }

    state = {
        list: null,

        selections: [],

        crumbs: [],

        errCode: 0,

        reqStatus: LinkReqStatus.Initial,

        loginStatus: !!session.get('login'),

        saveTo: false,

        contextMenuPosition: [0, 0],

        showContextMenu: false,

        dragUploadDest: null,

        loading: false,

        exception: null
    }

    linkRoot = null  // 外链访问的根文档对象

    previewFile = null  // 预览的外链文件

    unsubscribe: Array<() => void> = []

    saveToDocs: ReadonlyArray<any> = [] // 转存的外链文档对象数组

    runtime: string = ''   // 上传插件运行环境

    constructor(props, context) {
        super(props, context)
        this.handleFsChange = this.handleFsChange.bind(this)
    }

    async componentWillMount() {
        // 清空缓存
        fs.clearCache()
        // 获取上传插件运行环境
        this.getUploadRuntime()

        // 获取登录状态
        const login = session.get('login')

        if (!!login) {
            setupOpenApi({
                userid: login.userid,
                tokenid: login.tokenid
            })
        }

        this.unsubscribe = [
            fs.subscribe(fs.EventType.FS_INSERT, this.handleFsChange),
            fs.subscribe(fs.EventType.FS_UPDATE, this.handleFsChange),
            subscribe(EventType.DOWNLOAD_ERROR, ({ errcode }) => this.handleLinkError(errcode))
        ]

        const { linkDoc } = this.props
        const { link, docid } = linkDoc

        try {
            this.setState({
                loading: true
            })
            this.linkRoot = await fs.getLinkRoot(link, '')

            this.setState({
                loading: false
            })

            if (docid) {
                // 显示外链列表或外链预览界面
                this.listOrPreview(linkDoc)
            } else {
                // 显示信息界面（文件名，大小，...）
                this.setState({
                    reqStatus: LinkReqStatus.Info
                })
            }
        }
        catch ({ errcode }) {
            this.setState({
                errCode: errcode,
                loading: false
            })
        }
    }

    async componentWillReceiveProps({ linkDoc }) {
        // // 清空缓存
        // fs.clearCache()

        try {
            this.setState({
                loading: true,
                reqStatus: LinkReqStatus.Initial,
                errCode: 0
            })
            this.linkRoot = await fs.getLinkRoot(linkDoc.link, '')

            this.setState({
                loading: false
            })

            if (linkDoc.docid) {
                this.listOrPreview(linkDoc)
            } else {
                // 显示信息界面（文件名，大小，...）
                this.setState({
                    reqStatus: LinkReqStatus.Info
                })

                // 解决 在预览页面通过直接删除路由后面的docid跳转至详情页面，title没有变化
                if (this.props.onLoad && isFunction(this.props.onLoad)) {
                    this.props.onLoad(null)
                }
            }

            this.setState({
                errCode: 0
            })
        }
        catch ({ errcode }) {
            this.setState({
                saveTo: false,
                errCode: errcode,
                loading: false
            })
        }
    }

    /**
     * 处理外链错误
     * 只处理外链密码变更、外链关闭
     * @param errCode 
     */
    protected handleLinkError(errCode: number) {
        if (includes([ErrorCode.LinkInaccessable, ErrorCode.LinkAuthFailed], errCode)) {
            this.setState({
                errCode,
                reqStatus: LinkReqStatus.Initial,
                saveTo: false
            })
        }
    }

    /** 
     * 获取上传插件运行环境
     */
    async getUploadRuntime() {
        this.runtime = await runtime
    }

    /**
     * 列举外链列表或者预览外链文件 
     */
    protected async listOrPreview({ docid, link }) {
        // 从linkRoot中获取password
        let { password } = this.linkRoot
        password = password ? password : ''
        const doc = this.linkRoot

        if (isDir(doc)) {
            this.setState({
                reqStatus: LinkReqStatus.List
            })

            this.load({ ...doc, link, password, docid })
        } else {
            this.previewFile = { ...doc, link, password, docid }
            this.setState({
                reqStatus: LinkReqStatus.PreviewFile
            })

            if (this.props.onLoad && isFunction(this.props.onLoad)) {
                this.props.onLoad(this.previewFile)
            }
        }
    }

    /**
     * 获取linkRoot外链对象
     */
    private async getLinkRootInfo(link: string, docid: string = '', password: string = '') {
        // 如果session中存在linkDoc，从session获取；反之，掉get接口获取
        const linkObj = session.get('link')

        if (linkObj && linkObj[link]) {

            return linkObj[link]
        } else {
            const linkDoc = await get({ link, docid, password })
            const linkRoot = { ...linkDoc, link, password }

            session.update('link', {
                [link]: linkRoot
            })

            return { ...linkDoc, link, password }
        }
    }

    /**
     * 列举link文档对象
     */
    async load(doc, { useCache = false, reload = true } = {}) {
        try {
            let crumbs = await fs.getDocsChain(doc, this.linkRoot)
            const currentDoc = last(crumbs)

            this.previewFile = null

            if (!(currentDoc === null || isDir(currentDoc))) {
                this.previewFile = currentDoc
                crumbs = crumbs.slice(0, -1)

                this.setState({
                    reqStatus: LinkReqStatus.PreviewFile
                })
            }

            if (this.props.onLoad && isFunction(this.props.onLoad)) {
                this.props.onLoad(currentDoc)
            }

            if (this.previewFile) {
                return
            }

            if (this.state.saveTo) {
                return
            }

            this.setState({
                crumbs,
                selections: []
            }, async () => {
                const { crumbs } = this.state
                const currentDir = last(crumbs)

                try {
                    const list = await fs.list(currentDir, { useCache })

                    this.setState({
                        list
                    })
                }
                catch ({ errcode }) {
                    switch (errcode) {
                        // 链接无效，链接超过次数
                        case ErrorCode.LinkAuthFailed:
                        case ErrorCode.LinkInaccessable:
                            this.setState({
                                reqStatus: LinkReqStatus.Initial,
                                errCode: errcode,
                                saveTo: false
                            })
                    }
                }
            })
        }
        catch ({ errcode }) {
            switch (errcode) {
                // 链接无效，链接超过次数
                case ErrorCode.LinkAuthFailed:
                case ErrorCode.LinkInaccessable:
                    this.setState({
                        reqStatus: LinkReqStatus.Initial,
                        errCode: errcode,
                        saveTo: false
                    })
            }
        }
    }

    /**
     * 路径发生变化
     * @param doc 
     * @param newTab 是否在新页面打开
     */
    protected async handlePathChange(doc, { newTab = false } = {}) {

        if (isDir(doc)) {
            if (typeof this.props.onPathChange === 'function') {
                this.props.onPathChange(doc, { newTab })
            } else {
                this.load(doc)
            }
        } else {
            // 预览文件前，需要检测外链的预览权限
            try {
                const result = await checkLinkPerm({ ...doc, perm: LinkSharePermission.PREVIEW })

                if (result) {
                    if (typeof this.props.onPathChange === 'function') {
                        this.props.onPathChange(doc, { newTab })
                    } else {
                        this.load(doc)
                    }
                } else {
                    this.setState({
                        exception: {
                            doc,
                            errCode: ErrCode.NoPermission
                        }
                    })
                }
            }
            catch ({ errcode }) {
                switch (errcode) {
                    // 链接无效，链接超过次数
                    case ErrorCode.LinkAuthFailed:
                    case ErrorCode.LinkInaccessable:
                        this.setState({
                            reqStatus: LinkReqStatus.Initial,
                            errCode: errcode,
                            saveTo: false
                        })
                }
            }

        }
    }

    /**
     * 密码验证成功
     * @param linkDoc 验证成功之后的外链文档对象
     */
    protected handleValidateSuccess(linkDoc: any) {
        this.linkRoot = linkDoc

        this.handlePathChange(this.props.linkDoc)
    }

    /**
     * 在SimpleInfo页面点击“打开”文件夹
     */
    protected openLinkDir(doc: any) {
        this.setState({
            reqStatus: LinkReqStatus.List
        })

        this.handlePathChange(doc, { newTab: false })
    }

    /**
     * 在SimpleInfo页面点击“预览”文件
     * @param newTab 是否在新页面打开
     */
    protected previewLinkFile(doc: any, newTab: boolean) {
        this.handlePathChange(doc, { newTab })
    }

    /** 
     * 切换全选 
     */
    protected toggleSelectAll() {
        const { list: { dirs, files }, selections } = this.state
        const docs = [...dirs, ...files]

        this.setState({
            selections: docs.length === selections.length ? [] : docs
        })
    }

    /**
     * 外链下载
     * @param docs 
     */
    protected download(docs: ReadonlyArray<any>) {
        download(docs)
    }

    /**
     * fileSystem change
     */
    private handleFsChange(doc) {
        const currentDir = last(this.state.crumbs)

        if (currentDir && doc.docid.startsWith(currentDir.docid)) {
            this.load(currentDir, { useCache: false, reload: true })
        }
    }

    /**
     * 开始转存
     */
    protected saveTo(docs: ReadonlyArray<any>) {
        const login = session.get('login')

        if (!!login) {
            setupOpenApi({
                userid: login.userid,
                tokenid: login.tokenid
            })
        }

        this.saveToDocs = docs
        this.setState({
            saveTo: true,
            loginStatus: !!login
        })
    }

    /**
     * 转存，登录成功
     */
    protected loginSuccess(userInfo: any) {

        this.saveLoginInfo(userInfo)

        this.setState({
            loginStatus: true
        })

        this.props.onLoginSuccess();
    }

    /**
     * 保存login信息
     */
    protected saveLoginInfo(userInfo: any) {
        session.set('login', userInfo)

        setupOpenApi({
            userid: userInfo.userid,
            tokenid: userInfo.tokenid
        })
    }

    /**
     * 转存完成
     */
    protected saveToComplete() {
        this.setState({
            saveTo: false
        })
    }

    /**
     * 触发转存修改密码
     */
    protected onRequestChangePassword(account) {
        this.setState({
            saveTo: false
        })
        this.props.onRequestChangePassword(account, this.changePasswordSuccess.bind(this))
    }

    /**
     * 修改密码成功
     */
    private changePasswordSuccess(userInfo) {
        this.setState({
            saveTo: true
        })
        this.loginSuccess(userInfo)
    }

    /** 
     * 文件右击 
     */
    protected handleContextMenu(e) {
        e.preventDefault()
        this.setState({
            contextMenuPosition: [e.clientX, e.clientY],
            showContextMenu: true
        })
    }

    /** 
     * 空白处右击
     */
    protected handleMainContextMenu(e) {
        if (!e.defaultPrevented) {
            this.setState({
                selections: []
            })
        }
        this.handleContextMenu(e)
    }

    /** 
     * 关闭右击菜单
     */
    protected closeContextMenu() {
        this.setState({
            showContextMenu: false
        })
    }

    /** 
     * 刷新 
     */
    protected refresh() {
        this.load(last(this.state.crumbs), { useCache: false, reload: true })
    }

    /**
     * 设置拖拽上传目标目录
     */
    protected setDragUploadDest(doc) {
        if (this.runtime === 'html5') {
            this.setState({
                dragUploadDest: doc
            })
        }
    }

    /**
     * 切换图片
     */
    protected changePreviewImage(nextImage: any) {
        this.load(nextImage)
    }
} 