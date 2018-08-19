import * as React from 'react';
import { assign, pick, initial, noop } from 'lodash';
import { userAgent, OSType, Browser, bindEvent, unbindEvent, isBrowser } from '../../util/browser/browser';
import { useHTTPS } from '../../util/browser/browser';
import { docname } from '../../core/docs/docs';
import { download } from '../../core/download/download';
import { checkPermItem, SharePermission, LinkSharePermission, checkLinkPerm } from '../../core/permission/permission';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { getDocType } from '../../core/apis/eachttp/entrydoc/entrydoc';
import session from '../../util/session/session';
import __ from './locale'

export default class ViewerBase extends React.Component<any, any> {
    static defaultProps = {
        // 是否使用较暗的UI
        lightoff: false,

        // 检查登录
        onCheckLogin: noop,

        // 登录成功
        onLoginSuccess: noop,

        // 查看跳转
        onRedirect: noop,

        onPasswordChange: noop,

        // 是否非法内容隔离区文件
        illegalContentQuarantine: false,

        // 回退目录
        onRequestBack: noop
    }

    constructor(props) {
        super(props);
        this.download = this.download.bind(this);
        this.rewriteTitle = this.rewriteTitle.bind(this);
        this.preventEvent = this.preventEvent.bind(this)
    }

    state = {
        downloading: false,

        avoidPrint: typeof session.get('leakproofvalue') === 'number' && (session.get('leakproofvalue') & 1) !== 1,

        avoidCopy: false,

        downloadEnabled: false,

        saveToEnabled: false,

        savingTo: false,

        logedIn: false
    }

    /**
     * 开始下载
     */
    download() {
        this.setState({
            downloading: true
        })
    }

    /**
     * 下载完成后重置状态，返回false避免<Download />组件自我销毁。
     */
    downloadComplete() {
        this.setState({
            downloading: false
        });

        return false;
    }

    /**
     * mobile 下载
     */
    protected downloadMobile() {
        download({ ...this.props.link, ...this.props.doc })
    }

    /**
     * 开始转存
     */
    saveTo() {
        if (this.props.onCheckLogin()) {
            this.setState({
                logedIn: true
            })
        } else {
            this.setState({
                logedIn: false
            })
        }
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
     * 登录成功
     */
    loginSuccess(userInfo) {
        this.props.onLoginSuccess(userInfo);
        this.setState({
            savingTo: true,
            logedIn: true
        })
    }

    checkEnableDownload({ doc, link }) {
        let userid = getOpenAPIConfig('userid')
        if (this.props.skipPermissionCheck) {
            this.setState({
                downloadEnabled: true
            })
        } else {
            (link && link.link ? checkLinkPerm(assign(link, { perm: LinkSharePermission.DOWNLOAD })) : checkPermItem(doc.docid, SharePermission.COPY, userid)).then(downloadEnabled => {
                if (!downloadEnabled) {
                    bindEvent(window, 'contextmenu', this.preventEvent)
                }
                this.setState({
                    downloadEnabled
                })
            })
        }
    }
    checkEnabledSaveTo({ doc, link }) {
        let userid = getOpenAPIConfig('userid');
        if (this.props.skipPermissionCheck) {
            this.setState({
                saveToEnabled: true
            })
        } else {
            if (link && link.link) {
                checkLinkPerm(assign(link, { perm: LinkSharePermission.DOWNLOAD })).then(saveToEnabled => {
                    this.setState({
                        saveToEnabled
                    })
                })
            } else {
                Promise.all([
                    checkPermItem(doc.docid, SharePermission.COPY, userid),
                    getDocType({ docid: doc.docid })
                ]).then(([saveToEnabled, { doctype }]) => {
                    if (doctype === 'userdoc') {
                        this.setState({
                            saveToEnabled: false
                        })
                    } else {
                        this.setState({
                            saveToEnabled
                        })
                    }

                })
            }

        }

    }

    back() {
        this.props.onRequestBack()
    }

    loadAvoidPrintStyle() {
        let style = document.createElement('style'),
            cssText = `.no-print *{display:none;}.no-print:after{display:block;content:"${__('无法执行打印操作，您的权限不足，请联系管理员。')}";font-size:24px;text-align:center;}`;
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

    /**
     * 阻止默认事件
     * @param e 
     */
    preventEvent(e) {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault()
        }
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

    componentDidMount() {
        const { illegalContentQuarantine, doc } = this.props;
        this.loadAvoidPrintStyle()
        // 非法内容隔离区文件没有下载/转存权限
        !illegalContentQuarantine && this.checkEnableDownload(this.props)
        !illegalContentQuarantine && this.checkEnabledSaveTo(this.props)
        bindEvent(window, 'keydown', this.handleKeyDown)
        bindEvent(window, 'keyup', this.handleKeyUp)
        bindEvent(window, 'blur', this.handleBlur)
        bindEvent(window, 'focus', this.handleFocus)
        this.rewriteTitle(docname(doc))
    }

    rewriteTitle(title) {
        // 当页面中嵌入了flash，并且页面的地址中含有“片段标识”（即网址#之后的文字）IE标签页标题被自动修改为网址片段标识
        if (userAgent().app === Browser.MSIE || userAgent().app === Browser.Edge) {
            setTimeout(function () {
                document.title = title
            }, 2000)
        } else {
            document.title = title;
        }
    }

    componentWillReceiveProps(nextProps) {
        !nextProps.illegalContentQuarantine && this.checkEnableDownload(nextProps)
    }

    componentWillUnmount() {
        unbindEvent(window, 'keydown', this.handleKeyDown)
        unbindEvent(window, 'keyup', this.handleKeyUp)
        unbindEvent(window, 'blur', this.handleBlur)
        unbindEvent(window, 'focus', this.handleFocus)
        unbindEvent(window, 'contextmenu', this.preventEvent)
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