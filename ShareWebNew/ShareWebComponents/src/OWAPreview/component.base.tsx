import * as React from 'react'
import { noop, isFunction } from 'lodash'
import { watermarkFactory } from '../../core/watermark/watermark'
import { isBrowser } from '../../util/browser/browser'
import { getOWASURL, canOWASEdit, ErrorCode } from '../../core/owas/owas'

export default class OWAPreview extends React.Component<Components.OWAPreview.Props, any>{
    static defaultProps = {
        canEdit: true
    }

    state = {
        showTip: false,
        canEdit: false,
        editing: false,
        error: null,
        resolveError: noop,
        onError: noop
    }

    iframe: HTMLIFrameElement
    tipTimeoutId

    constructor(props, context) {
        super(props, context)
        this.ref = this.ref.bind(this)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.download = this.download.bind(this)
    }

    componentDidMount() {
        const { doc, edit, canEdit } = this.props
        this.load(doc, edit, canEdit)
    }

    componentWillReceiveProps({ doc, edit, canEdit }) {
        if (doc !== this.props.doc || edit !== this.props.edit) {
            this.load(doc, edit, canEdit)
        }
    }

    ref(iframe) {
        this.iframe = iframe
    }

    /**
     * 切换编辑状态
     */
    toggleEdit() {
        const { doc, onToggleEdit } = this.props
        if (typeof onToggleEdit === 'function') {
            onToggleEdit()
        } else {
            this.load(doc, !this.state.editing, this.props.canEdit)
        }
    }

    /**
     * 下载 
     */
    protected download() {
        this.props.doDownload && isFunction(this.props.doDownload) && this.props.doDownload(this.props.doc)
    }

    /**
     * 转存
     */
    protected saveTo() {
        this.props.doSaveTo && isFunction(this.props.doSaveTo) && this.props.doSaveTo(this.props.doc)
    }

    /**
     * 还原历史版本
     */
    protected restoreRevision() {
        this.props.doRevisionRestore && isFunction(this.props.doRevisionRestore) && this.props.doRevisionRestore(this.props.doc)
    }

    /**
     * 显示保存提示
     */
    tip() {
        clearTimeout(this.tipTimeoutId)
        this.setState({
            showTip: true
        })
        this.tipTimeoutId = setTimeout(() => {
            this.setState({
                showTip: false
            })
        }, 8000)
    }

    /**
     * 加载owa页面
     */
    async load(doc, edit = false, canEditProps: boolean = true) {

        try {

            const { canprint } = this.props

            const canEdit = canEditProps ? await canOWASEdit(doc) : false
            // 外链预览没有编辑按钮
            this.setState({
                canEdit: !doc.link && canEdit
            })

            const url = await getOWASURL(doc, { method: edit ? 'edit' : 'view', canedit: edit, canprint, latest: !this.props.doRevisionRestore })

            if (this.iframe) {
                await new Promise(resolve => {
                    this.iframe.onload = () => {
                        this.iframe.contentWindow.name = ''
                        this.iframe.onload = noop
                        resolve()
                    }
                    this.iframe.src = ''
                })
            }

            if (!edit) {
                const watermark = (await watermarkFactory(doc))({ zoom: 1, type: 'base64' })
                if (isBrowser({ mobile: true })) {
                    window.name = JSON.stringify(watermark)
                } else {
                    this.iframe.contentWindow.name = JSON.stringify(watermark)
                }
            }

            this.setState({
                editing: edit
            })

            if (edit) {
                this.tip()
            }

            this.iframe.contentWindow.location.replace(url)
        } catch (e) {
            this.handleError(e)
        }
    }

    /**
     * 错误处理
     */
    private async handleError(e) {
        switch (e.errcode) {
            case ErrorCode.Locked:
            case ErrorCode.NoPermission:
            case ErrorCode.NotSupport:
                await new Promise(resolve => {
                    this.setState({
                        error: e,
                        resolveError: resolve
                    })
                })
                this.setState({
                    error: null,
                    resolveError: noop
                })

                break

            default:
                if (e.errcode) {
                    this.props.onError(e.errcode)
                }
        }
    }
}