import * as React from 'react'
import { unstable_renderSubtreeIntoContainer, unmountComponentAtNode } from 'react-dom'
import { merge, noop } from 'lodash'
import * as classnames from 'classnames'
import { bindEvent, unbindEvent } from '../../util/browser/browser'
import { getContextWindow } from '../decorators'
import * as styles from './styles.desktop.css'

const isChildNode = (el, target) => {
    if (target !== null) {
        return el === target || isChildNode(el, target.parentNode)
    }
    return false
}

@getContextWindow
export default class PopOverBase extends React.Component<UI.PopOver.Props, any>{

    static defaultProps = {
        anchorOrigin: [0, 0],
        targetOrigin: [0, 0],
        watch: false,
        autoFix: true,
        freezable: true,
        keepOpenWhenMouseOver: true,
        closeWhenMouseLeave: false,
        closeTimeout: 150
    }

    state = {
        open: false,
        anchor: null
    }

    getContextWindow: () => Window

    layer: HTMLDivElement | null = null
    popContainer: HTMLDivElement | null = null
    watchTimeoutId
    closeTimeoutId
    rendering = false

    constructor(props, context) {
        super(props, context)
        this.handleClickAway = this.handleClickAway.bind(this)
        this.watch = this.watch.bind(this)
        this.close = this.close.bind(this)
    }

    componentDidMount() {
        const document = this.getContextWindow().document

        const { open, anchor } = this.props

        this.setState({
            ...(open !== undefined ? { open } : {}),
            ...(anchor !== undefined ? { anchor } : {}),
        })
    }

    componentWillReceiveProps({ open, anchor }) {
        this.setState({
            ...(open !== undefined ? { open } : {}),
            ...(anchor !== undefined ? { anchor } : {}),
        })
    }

    componentDidUpdate() {
        if (!this.rendering) {
            this.renderToLayer()
        }
    }

    componentWillUnmount() {
        this.unrenderToLayer()
    }

    /**
     * 关闭弹出内容
     */
    close() {
        if (typeof this.props.onClose === 'function') {
            this.props.onClose()
        } else {
            this.setState({
                open: false
            })
        }
    }

    /**
     * 显示弹出内容
     */
    open() {
        if (typeof this.props.onOpen === 'function') {
            this.props.onOpen()
        } else {
            this.setState({
                open: true
            })
        }
    }

    /**
     * 点击
     * @param e 
     */
    async handleClick(e) {

        if (typeof this.props.onClick === 'function') {
            this.props.onClick(e)
        }

        if (typeof this.props.onRequestCloseWhenClick === 'function') {
            try {
                await new Promise(resolve => {
                    (this.props.onRequestCloseWhenClick as (close: () => void) => void)(resolve)
                })
                this.close()
            } catch (e) { }
        }
    }

    /**
     * 点击popcontainer之外触发onClickAway
     */
    async handleClickAway(e) {
        const clickElement = e.target || e.srcElement
        if (this.state.open && this.popContainer && !isChildNode(this.popContainer, clickElement)) {

            if (typeof this.props.onClickAway === 'function') {
                this.props.onClickAway(e)
            }

            if (typeof this.props.onRequestCloseWhenBlur === 'function') {
                try {
                    await new Promise(resolve => {
                        (this.props.onRequestCloseWhenBlur as (close: () => void) => void)(resolve)
                    })
                    this.close()
                } catch (e) { }
            }
        }
    }

    handleMouseEnter(e) {

        if (typeof this.props.onMouseEnter === 'function') {
            this.props.onMouseEnter(e)
        }
        if (this.props.triggerEvent === 'mouseover' && this.props.keepOpenWhenMouseOver) {
            clearTimeout(this.closeTimeoutId)
            this.open()
        }
    }

    handleMouseLeave(e) {

        if (typeof this.props.onMouseLeave === 'function') {
            this.props.onMouseLeave(e)
        }
        if (this.props.triggerEvent === 'mouseover' && this.props.closeWhenMouseLeave) {
            clearTimeout(this.closeTimeoutId)
            /**
             * 延时150ms，防止手抖导致弹出窗关闭
             */
            this.closeTimeoutId = setTimeout(this.close, this.props.closeTimeout)
        }
    }

    /** 点击trigger */
    handleTriggerClick(e, triggerProps) {
        this.setState({ anchor: e.currentTarget })
        this.open()
        if (typeof triggerProps.onClick === 'function') {
            triggerProps.onClick(e)
        }
    }

    /** 鼠标移入trigger */
    handleTriggerMouseEnter(e, triggerProps) {
        clearTimeout(this.closeTimeoutId)
        this.setState({ anchor: e.currentTarget })
        this.open()
        if (typeof triggerProps.onMouseEnter === 'function') {
            triggerProps.onMouseEnter(e)
        }
    }

    /**
     * 鼠标移出trigger
     */
    handleTriggerMouseLeave(e, triggerProps) {
        clearTimeout(this.closeTimeoutId)
        /**
        * 延时150ms，防止手抖导致弹出窗关闭
        */
        this.closeTimeoutId = setTimeout(this.close, this.props.closeTimeout)
        if (typeof triggerProps.onMouseLeave === 'function') {
            triggerProps.onMouseLeave(e)
        }
    }

    /**
     * 创建挂载节点，并渲染弹出内容
     */
    renderToLayer() {
        const { freezable, watch, className, children, ...otherProps } = this.props
        const document = this.getContextWindow().document
        if (this.state.open) {
            if (!this.layer) {
                this.layer = document.createElement('div');
                (document.querySelector('body') as HTMLBodyElement).appendChild(this.layer as HTMLDivElement)
                if (freezable) {
                    (this.layer as HTMLDivElement).setAttribute('class', classnames(styles['layer'], className))
                }
            }

            this.rendering = true

            unstable_renderSubtreeIntoContainer(
                this,
                <div
                    className={styles['pop-container']}
                    {...otherProps}
                    ref={ref => { if (ref) { this.popContainer = ref } }}
                    onClick={this.handleClick.bind(this)}
                    onMouseEnter={this.handleMouseEnter.bind(this)}
                    onMouseLeave={this.handleMouseLeave.bind(this)}
                >
                    {children}
                </div>,
                this.layer,
                () => {
                    bindEvent(document, 'mousedown', this.handleClickAway)
                    bindEvent(document, 'touchstart', this.handleClickAway)
                    this.rendering = false
                    this.setPosition()
                    if (watch) {
                        this.watch()
                    }
                }
            )
        } else {
            this.unrenderToLayer()
        }
    }

    /**
     * 卸载弹出内容并删除挂载节点
     */
    unrenderToLayer() {
        clearTimeout(this.watchTimeoutId)
        if (this.layer) {
            const document = this.getContextWindow().document

            unmountComponentAtNode(this.layer as HTMLDivElement)

            if (document) {
                (document.querySelector('body') as HTMLBodyElement).removeChild(this.layer as HTMLDivElement)
                unbindEvent(document, 'mousedown', this.handleClickAway)
                unbindEvent(document, 'touchstart', this.handleClickAway)
            }

            this.layer = null
        }
    }

    watch() {
        clearTimeout(this.watchTimeoutId)
        this.setPosition()
        this.watchTimeoutId = setTimeout(this.watch, 16)
    }

    /**
     * 根据定位信息计算弹出层位置
     */
    setPosition() {
        const { anchorOrigin, targetOrigin, autoFix } = this.props
        const { anchor } = this.state
        const contextWindow = this.getContextWindow()
        const windowInnerWidth = contextWindow.innerWidth || contextWindow.document.documentElement.clientWidth
        const windowInnerHeight = contextWindow.innerHeight || contextWindow.document.documentElement.clientHeight
        if (this.popContainer) {
            let anchorOriginX, anchorOriginY,
                targetOriginX, targetOriginY,
                anchorRect,
                { offsetHeight, offsetWidth } = this.popContainer,
                left = 0,
                top = 0
            if (anchor) {
                anchorRect = anchor.getBoundingClientRect()
                switch (anchorOrigin[1]) {
                    case 'top':
                        anchorOriginY = 0;
                        break
                    case 'bottom':
                        anchorOriginY = anchorRect.bottom - anchorRect.top
                        break
                    case 'middle':
                        anchorOriginY = (anchorRect.bottom - anchorRect.top) / 2
                        break
                    default:
                        anchorOriginY = anchorOrigin[1]
                        break
                }
                switch (anchorOrigin[0]) {
                    case 'left':
                        anchorOriginX = 0;
                        break
                    case 'right':
                        anchorOriginX = anchorRect.right - anchorRect.left
                        break
                    case 'center':
                        anchorOriginX = (anchorRect.right - anchorRect.left) / 2
                        break
                    default:
                        anchorOriginX = anchorOrigin[0]
                        break
                }
            } else {
                anchorRect = { top: 0, left: 0, right: 0, bottom: 0 }
                anchorOriginX = anchorOriginY = 0
                switch (anchorOrigin[0]) {
                    case 'left':
                        break
                    case 'right':
                        anchorRect.left = anchorRect.right = windowInnerWidth
                        break
                    case 'center':
                        anchorRect.left = anchorRect.right = windowInnerWidth / 2
                        break
                    default:
                        anchorRect.left = anchorRect.right = anchorOrigin[0]
                        break
                }
                switch (anchorOrigin[1]) {
                    case 'top':
                        break
                    case 'bottom':
                        anchorRect.top = anchorRect.bottom = windowInnerHeight
                        break
                    case 'middle':
                        anchorRect.top = anchorRect.bottom = windowInnerHeight / 2
                        break
                    default:
                        anchorRect.top = anchorRect.bottom = anchorOrigin[1]
                        break
                }
            }
            switch (targetOrigin[1]) {
                case 'top':
                    targetOriginY = 0;
                    break
                case 'bottom':
                    targetOriginY = offsetHeight
                    break
                case 'middle':
                    targetOriginY = offsetHeight / 2
                    break
                default:
                    targetOriginY = targetOrigin[1]
                    break
            }
            switch (targetOrigin[0]) {
                case 'left':
                    targetOriginX = 0;
                    break
                case 'right':
                    targetOriginX = offsetWidth
                    break
                case 'center':
                    targetOriginX = offsetWidth / 2
                    break
                default:
                    targetOriginX = targetOrigin[0]
                    break
            }
            left = anchorRect.left + anchorOriginX - targetOriginX
            top = anchorRect.top + anchorOriginY - targetOriginY
            if (autoFix) {
                if (
                    (left + offsetWidth > windowInnerWidth) && (targetOriginX < offsetWidth / 2) ||
                    (left < 0) && (targetOriginX > offsetWidth / 2)
                ) {
                    left = anchorRect.right - anchorOriginX - offsetWidth + targetOriginX
                    if (left < 0) {
                        left = 0
                    }
                }
                if (
                    (top + offsetHeight > windowInnerHeight) && (targetOriginY < offsetHeight / 2) ||
                    (top < 0) && (targetOriginY > offsetHeight / 2)
                ) {
                    top = anchorRect.bottom - anchorOriginY - offsetHeight + targetOriginY
                    if (top < 0) {
                        top = 0
                    }
                }
            }
            this.popContainer.style.left = `${left}px`
            this.popContainer.style.top = `${top}px`
        }
    }
}