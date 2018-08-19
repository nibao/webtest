import * as React from 'react'
import { noop } from 'lodash'
import { getContextWindow } from '../../ui/decorators'
import { canCADPreview, docname, canOWASPreview } from '../../core/docs/docs'
import { add, check, del } from '../../core/apis/efshttp/favorites/favorites'
import { checkPermItem, SharePermission } from '../../core/permission/permission'
import { ErrorCode as ErrCode } from '../../core/apis/openapi/errorcode'
import { getOpenAPIConfig } from '../../core/openapi/openapi'
import { findType } from '../../core/extension/extension'
import * as fs from '../../core/filesystem/filesystem'
import { userAgent, OSType, Browser, isBrowser, bindEvent, unbindEvent, isIE8, requestFullScreen, exitFullScreen } from '../../util/browser/browser'
import session from '../../util/session/session'
import __ from './locale'
import { PreviewMethod, ErrorCode } from './helper'

@getContextWindow
export default class PreviewBase extends React.Component<Components.Preview2.Props, any>{
    constructor(props, context) {
        super(props, context)
        this.handleError = this.handleError.bind(this)
        this.getPreviewMethod = this.getPreviewMethod.bind(this)
        this.handleFullScreenChange = this.handleFullScreenChange.bind(this)
    }

    static contextTypes = {
        toast: React.PropTypes.func
    }
    static defaultProps = {
        enableCollect: true,

        canEdit: true,

        /**
         * 检查登录
         */
        onCheckLogin: noop,

        /**
         * 登录成功
         */
        onLoginSuccess: noop,

        /**
         * 查看跳转
         */
        onRedirect: noop,

        onPasswordChange: noop,

        /**
         * 是否非法内容隔离区文件
         */
        illegalContentQuarantine: false,

        onLinkError: noop
    }
    state: Components.Preview2.State = {
        doc: null,
        error: null,
        errDialog: null,
        previewMethod: null,
        favorited: false,
        fullScreen: false,
        loadedSize: 0,
        totalSize: 0,
        downloadEnable: false,
        saveToEnable: true,
        savingTo: false,
        innerShare: false,
        linkShare: false,
        logedIn: false,
        avoidCopy: false,
        avoidPrint: typeof session.get('leakproofvalue') === 'number' && (session.get('leakproofvalue') & 1) !== 1
    }

    componentWillMount() {
        const window = this.getContextWindow()
        bindEvent(window, 'fullscreenchange', this.handleFullScreenChange)
        bindEvent(window, 'mozfullscreenchange', this.handleFullScreenChange)
        bindEvent(window, 'webkitfullscreenchange', this.handleFullScreenChange)
        bindEvent(window, 'MSFullscreenChange', this.handleFullScreenChange)
    }

    componentDidMount() {
        const window = this.getContextWindow()
        this.loadAvoidPrintStyle()
        this.load(this.props.doc)
        bindEvent(window, 'keydown', this.handleKeyDown)
        bindEvent(window, 'keyup', this.handleKeyUp)
        bindEvent(window, 'blur', this.handleBlur)
        bindEvent(window, 'focus', this.handleFocus)
    }

    componentWillReceiveProps({ doc }) {
        if (doc && (!this.props.doc || doc.docid !== this.props.doc.docid)) {
            this.load(doc)
        }
    }

    componentWillUnmount() {
        const window = this.getContextWindow()
        unbindEvent(window, 'keydown', this.handleKeyDown)
        unbindEvent(window, 'keyup', this.handleKeyUp)
        unbindEvent(window, 'blur', this.handleBlur)
        unbindEvent(window, 'focus', this.handleFocus)
        unbindEvent(window, 'fullscreenchange', this.handleFullScreenChange)
        unbindEvent(window, 'mozfullscreenchange', this.handleFullScreenChange)
        unbindEvent(window, 'webkitfullscreenchange', this.handleFullScreenChange)
        unbindEvent(window, 'MSFullscreenChange', this.handleFullScreenChange)
    }

    handlePathChange(doc, options) {
        if (typeof this.props.onPathChange === 'function') {
            this.props.onPathChange(doc, options)
        } else {
            this.load(doc)
        }
    }

    async load(doc) {
        this.setState({ doc })
        this.getPreviewMethod(doc)
        const userid = getOpenAPIConfig('userid')
        /**
         * 检测文档所属类型（个人文档没有转存按钮）
         * 检测文档收藏状态
         * 检测文档下载权限
         */
        this.setState({
            saveToEnable: (await fs.getViewDocType(doc)) !== 10,
            downloadEnable: userAgent().os !== OSType.IOS && userAgent().app !== Browser.WeChat && (doc.link ?
                (doc.perm & 2) === 2 :
                await checkPermItem(doc.docid, SharePermission.COPY, userid)
            ),
            favorited: doc.link ? false : (await check({ docids: [doc.docid] }))[0].favorited
        })
    }

    handleFullScreenChange() {
        const document = this.getContextWindow().document;
        this.setState({
            fullScreen: !!(document.fullscreenElement || document.webkitCurrentFullScreenElement || document.mozFullScreenElement || document.msFullscreenElement)
        })
    }

    /**
     * 检查文件格式是否支持,根据文件格式调用对应的组件(判断预览方式)
     * 
     */
    async getPreviewMethod(doc) {
        switch (findType(docname(doc))) {
            case 'WORD':
            case 'EXCEL':
            case 'PPT':
                if (!isIE8() && await canOWASPreview(doc)) {
                    this.setState({
                        previewMethod: PreviewMethod.OWA
                    })
                    return
                }

            case 'PDF':
            case 'TXT':
                /**
                 * 检查浏览器是否支持预览
                 */
                if (isIE8()) {
                    this.setState({
                        error: ErrorCode.BrowserIncompatiable
                    })
                } else {
                    this.setState({
                        previewMethod: PreviewMethod.PDF
                    })
                }
                return

            case 'CAD':
                if (await canCADPreview()) {
                    this.setState({
                        previewMethod: PreviewMethod.CAD
                    })
                } else {
                    this.setState({
                        error: ErrorCode.InvalidFormat
                    })
                }
                return

            case 'IMG':
                this.setState({
                    previewMethod: PreviewMethod.Image
                })
                return

            case 'VIDEO':
                this.setState({
                    previewMethod: PreviewMethod.Video
                })
                return

            case 'AUDIO':
                this.setState({
                    previewMethod: PreviewMethod.Audio
                })
                return

            default:
                this.setState({
                    error: ErrorCode.InvalidFormat
                })
                return
        }
    }

    handleError(errcode) {
        switch (errcode) {
            case 403026:
                this.setState({
                    error: ErrorCode.InvalidFormat
                })
                break

            // 外链地址不存在
            case ErrCode.LinkInaccessable:
            // 外链密码不对
            case ErrorCode.LinkPwdError:
                this.props.onLinkError(errcode)
                break

            default:
                this.setState({
                    error: errcode
                })
                break
        }
    }

    /**
     * 全屏设置
     * @param key 全屏状态
     */
    handleRequestFullScreen() {

        // 判断是否全屏（单独根据state.funnScreen不能检测按esc退出全屏的状态）
        const { fullScreen } = this.state
        const document = this.getContextWindow().document;
        if (fullScreen) {
            exitFullScreen(document)
        } else {
            requestFullScreen(document.querySelector('body'))
        }
    }

    /**
     * 进度条设置
     * @param data 加载数据参数对象
     */
    handleProgress(data) {
        this.setState({
            loadedSize: data.loaded,
            totalSize: data.total
        })
    }

    /**
     * 文档收藏/取消收藏
     */
    async handleCollect() {
        const { toast } = this.context
        try {
            if (!this.state.favorited) {
                await add({
                    docid: this.state.doc.docid
                })
                this.setState({
                    favorited: true
                })
                if (typeof toast === 'function') {
                    toast(__('收藏成功'))
                }
            } else {
                await del({
                    docid: this.state.doc.docid
                })
                this.setState({
                    favorited: false
                })
                if (typeof toast === 'function') {
                    toast(__('取消收藏'))
                }
            }
        } catch ({ errcode }) {
            this.setState({
                errDialog: errcode
            })
        }
    }

    /**
     * 防打印
     */
    loadAvoidPrintStyle() {
        let style = document.createElement('style'),
            cssText = `
            .no-print *{
                display:none
            }
            .no-print:after{
                display:block
                content:"${__('无法执行打印操作，您的权限不足，请联系管理员。')}"
                font-size:24pxtext-align:center
            }`
        style.setAttribute('type', 'text/css')
        style.setAttribute('media', 'print')
        if (isBrowser({ app: Browser.MSIE, version: 8 })) {
            style.styleSheet.cssText = cssText
        } else {
            style.innerHTML = cssText
        }
        document.querySelector('head').appendChild(style)
    }

    setAvoidCopy() {
        if (typeof session.get('leakproofvalue') === 'number' && (session.get('leakproofvalue') & 2) !== 2) {
            this.setState({
                avoidCopy: true
            })
        }
    }

    cancelAvoidCopy() {
        this.setState({
            avoidCopy: false
        })
    }

    handleKeyDown = e => {
        if (e.altKey || e.ctrlKey || e.shiftKey) {
            this.setAvoidCopy()
        }
    }

    handleKeyUp = e => {
        if (!(e.altKey || e.ctrlKey || e.shiftKey)) {
            this.cancelAvoidCopy()
        }
    }

    handleBlur = () => {
        this.setAvoidCopy()
    }

    handleFocus = () => {
        this.cancelAvoidCopy()
    }

    /**
     * 预览非法内容隔离区文件禁止鼠标右键
     */
    forbidContextMenu(event) {
        if (this.props.illegalContentQuarantine) {
            event.preventDefault()
        }
    }
}