import * as React from 'react'
import { PureComponent, getContextWindow } from '../../../ui/decorators'
import { bindEvent, unbindEvent } from '../../../util/browser/browser'

@PureComponent
@getContextWindow
export default class Frame extends React.Component<any, any>{

    state = {
        top: 0,
        left: 0,
        zoom: 1,
        width: 0,
        height: 0,
        loaded: false,
        rotate: 0,
        container: null,
        showTools: true,
        showZoomTip: false,
        previewError: null
    }

    /**
     * 默认大小
     */
    defaultSize = { width: 0, height: 0 }

    /**
     * 正在拖拽标识
     */
    dragging = false

    /**
     * 开始拖拽位置
     */
    dragStartPos = [0, 0]

    /**
     * 拖拽开始时图片位置
     */
    targetStartPos = [0, 0]

    /**
     * 拖拽元素
     */
    dragTarget: HTMLDivElement

    /**
     * 鼠标移入frame
     */
    mouseIsOver = false

    /**
     * 隐藏工具栏计时器
     */
    hideToolsTimeoutId

    /**
     * 鼠标移入工具栏
     */
    mouseIsOverTools = false

    /**
     * 隐藏缩放提示计时器
     */
    hideZoomTipTimeoutId

    constructor(props, context) {
        super(props, context)
        this.handleMouseWheel = this.handleMouseWheel.bind(this)
        this.handleWindowResize = this.handleWindowResize.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.startDrag = this.startDrag.bind(this)
        this.endDrag = this.endDrag.bind(this)
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.zoom = this.zoom.bind(this)
        this.rotate = this.rotate.bind(this)
        this.handleThumbnailLoad = this.handleThumbnailLoad.bind(this)
        this.handleToolsMouseEnter = this.handleToolsMouseEnter.bind(this)
        this.handleToolsMouseLeave = this.handleToolsMouseLeave.bind(this)
        this.handleThumbnailError = this.handleThumbnailError.bind(this)
    }

    getContextWindow: () => Window

    componentDidMount() {
        const { offsetWidth, offsetHeight } = this.refs['container'] as HTMLDivElement
        this.setState({
            top: offsetHeight / 2,
            left: offsetWidth / 2,
            container: this.refs['container']
        })
        const window = this.getContextWindow()
        bindEvent(window, 'mousewheel', this.handleMouseWheel)
        bindEvent(window, 'wheel', this.handleMouseWheel)
        bindEvent(window, 'resize', this.handleWindowResize)
        bindEvent(window, 'keydown', this.handleKeyDown)
        bindEvent(window, 'mouseup', this.endDrag)
        this.hideTools()
    }

    componentWillReceiveProps({ index }) {
        if (index !== this.props.index) {
            const { offsetWidth, offsetHeight } = this.refs['container'] as HTMLDivElement
            this.setState({
                top: 0,
                left: 0,
                width: offsetWidth,
                height: offsetHeight,
                rotate: 0,
                loaded: false,
                previewError: null
            })
        }
    }

    componentWillUnmount() {
        const window = this.getContextWindow()
        unbindEvent(window, 'mousewheel', this.handleMouseWheel)
        unbindEvent(window, 'wheel', this.handleMouseWheel)
        unbindEvent(window, 'resize', this.handleWindowResize)
        unbindEvent(window, 'keydown', this.handleKeyDown)
        unbindEvent(window, 'mouseup', this.endDrag)
    }

    /**
     * 图片加载成功
     * @param e 图片加载成功
     */
    handleThumbnailLoad(e) {

        const { offsetWidth, offsetHeight } = this.refs['container'] as HTMLDivElement

        /**
         * 使用 naturalWidth naturalHeight 计算图片大小
         */
        let width = e.target.naturalWidth || e.target.width,
            height = e.target.naturalHeight || e.target.height

        if (!(width || height)) {
            const image = new Image()
            image.src = e.target.src
            width = image.width
            height = image.height
        }

        this.defaultSize = { width, height }

        let zoom = Math.min(offsetHeight / height, offsetWidth / width)

        if (zoom > 1) {
            zoom = 1
        }

        width = width * zoom
        height = height * zoom

        this.setState({
            loaded: true,
            zoom,
            width,
            height,
            left: (offsetWidth - width) / 2,
            top: (offsetHeight - height) / 2
        })
    }

    /**
     * 缩放
     * @param zoom 缩放比例
     * @param param1 缩放中心， 默认为container中心
     */
    zoom(
        zoom, [
            centerX = (this.refs['container'] as HTMLDivElement).offsetWidth / 2,
            centerY = (this.refs['container'] as HTMLDivElement).offsetHeight / 2
        ] = []
    ) {

        if (zoom < 0.1) {
            zoom = 0.1
        }

        if (zoom > 5) {
            zoom = 5
        }

        clearTimeout(this.hideZoomTipTimeoutId)
        this.setState({
            showZoomTip: true
        })
        this.hideZoomTipTimeoutId = setTimeout(() => {
            this.setState({
                showZoomTip: false
            })
        }, 500)

        const
            { offsetWidth, offsetHeight } = this.refs['container'] as HTMLDivElement,

            width = this.defaultSize.width * zoom,
            height = this.defaultSize.height * zoom

        let { left, top } = this.state

        if (width > offsetWidth) {
            const nextLeft = centerX - ((centerX - left) / this.state.zoom * zoom || width / 2)
            const nextRight = nextLeft + width
            if (nextLeft < 0 && nextRight > offsetWidth) {
                left = nextLeft
            } else if (nextLeft < 0 && nextRight < offsetWidth) {
                if (offsetWidth - nextRight + nextLeft > 0) {
                    /** 图像偏右 */
                    left = 0
                } else {
                    /** 图像偏左 */
                    left = offsetWidth - width
                }
            } else if (nextLeft > 0 && nextRight > offsetWidth) {
                if (nextRight - offsetWidth - nextLeft > 0) {
                    left = 0
                } else {
                    left = offsetWidth - width
                }
            } else if (nextLeft > 0 && nextRight < offsetWidth) {
                left = (offsetWidth - width) / 2
            }
        } else {
            left = (offsetWidth - width) / 2
        }

        if (height > offsetHeight) {
            const nextTop = centerY - ((centerY - top) / this.state.zoom * zoom || height / 2)
            const nextBottom = nextTop + height
            if (nextTop < 0 && nextTop + height > offsetHeight) {
                top = nextTop
            } else if (nextTop < 0 && nextBottom < offsetHeight) {
                if (offsetHeight - nextBottom + nextTop > 0) {
                    /** 图像偏上 */
                    top = 0
                } else {
                    /** 图像偏下 */
                    top = offsetHeight - height
                }
            } else if (nextTop > 0 && nextBottom > offsetHeight) {
                if (nextBottom - offsetHeight - nextTop > 0) {
                    top = 0
                } else {
                    top = offsetHeight - height
                }
            } else if (nextTop > 0 && nextBottom < offsetHeight) {
                top = (offsetHeight - height) / 2
            }
        } else {
            top = (offsetHeight - height) / 2
        }

        this.setState({
            zoom,
            width,
            height,
            left,
            top
        })
    }

    /**
     * 鼠标移入
     */
    handleMouseEnter() {
        this.mouseIsOver = true
    }

    /**
     * 鼠标移出
     */
    handleMouseLeave() {
        this.mouseIsOver = false
    }

    /**
     * 鼠标缩放
     * @param e 
     */
    handleMouseWheel(e) {
        if (e.ctrlKey) {
            e.preventDefault()
            let zoom = this.state.zoom

            if (e.detail > 0 || e.wheelDelta > 0 || e.deltaY < 0) {
                zoom = zoom + 0.2
            } else if (e.detail < 0 || e.wheelDelta < 0 || e.deltaY > 0) {
                zoom = zoom - 0.2
            }

            const { offsetTop, offsetLeft } = this.refs['container'] as HTMLDivElement

            this.zoom(zoom, [e.clientX - offsetLeft, e.clientY - offsetTop])
        } else {

            if (this.mouseIsOver && (e.detail > 0 || e.wheelDelta > 0 || e.deltaY < 0) && typeof this.props.onRequestPrev === 'function') {
                this.props.onRequestPrev()
            } else if (this.mouseIsOver && (e.detail < 0 || e.wheelDelta < 0 || e.deltaY > 0) && typeof this.props.onRequestNext === 'function') {
                this.props.onRequestNext()
            }
        }
    }

    /**
     * 窗口大小改变时重新计算位置
     */
    handleWindowResize() {
        const
            { offsetWidth, offsetHeight } = this.refs['container'] as HTMLDivElement,
            { width, height } = this.state

        let { left, top } = this.state

        if (width < offsetWidth) {
            left = (offsetWidth - width) / 2
        }

        if (height < offsetHeight) {
            top = (offsetHeight - height) / 2
        }

        this.setState({
            left,
            top
        })
    }

    /**
     * 键盘事件
     * @param e 
     */
    handleKeyDown(e) {
        if (!e.defaultPrevented) {
            if (e.ctrlKey) {
                switch (e.keyCode) {
                    case 187:
                        e.preventDefault()
                        this.zoom(this.state.zoom + 0.1)
                        break
                    case 189:
                        e.preventDefault()
                        this.zoom(this.state.zoom - 0.1)
                        break
                    default:
                        break
                }
            }
        }
    }

    /**
     * 鼠标移入工具栏
     */
    handleToolsMouseEnter() {
        this.mouseIsOverTools = true
    }

    /**
     * 鼠标移出工具栏
     */
    handleToolsMouseLeave() {
        this.mouseIsOverTools = false
    }

    /**
     * 隐藏工具栏
     */
    hideTools() {
        this.hideToolsTimeoutId = setTimeout(() => {
            this.setState({ showTools: false })
        }, 3000)
    }

    /**
     * 鼠标移动
     * @param e 
     */
    handleMouseMove(e: React.MouseEvent<any>) {
        clearTimeout(this.hideToolsTimeoutId)
        this.setState({ showTools: true })
        if (!this.mouseIsOverTools) {
            this.hideTools()
        }
        if (this.dragging) {
            const [dragStartX, dragStartY] = this.dragStartPos
            const [targetStartX, targetStartY] = this.targetStartPos
            const { offsetWidth: containerWidth, offsetHeight: containerHeight } = this.refs['container'] as HTMLDivElement
            const { offsetWidth: targetWidth, offsetHeight: targetHeight } = this.dragTarget
            let { left, top } = this.state

            if (targetWidth > containerWidth) {
                const nextLeft = e.clientX - dragStartX + targetStartX
                if (nextLeft < 0 && nextLeft + targetWidth > containerWidth) {
                    left = nextLeft
                }
            }

            if (targetHeight > containerHeight) {
                const nextTop = e.clientY - dragStartY + targetStartY
                if (nextTop < 0 && nextTop + targetHeight > containerHeight) {
                    top = nextTop
                }
            }

            this.setState({
                left,
                top
            })
        }
    }

    /**
     * 旋转
     * @param delta 变化角度
     */
    rotate(delta) {
        const { offsetWidth, offsetHeight } = this.refs['container'] as HTMLDivElement
        const nextRotate = this.state.rotate + delta
        const theta = Math.PI / 180 * nextRotate
        /**
         * nextWidth = x，nextHeight = height / width * x
         * 
         * x1 * sin(theta) + height / width * x1 * cos(theta)  = offsetWidth => 
         * x1 = offsetWidth / (sin(theta) + height / width * cos(theta))
         * 
         * x2 * cos(theta) + height / width * x2 * sin(theta)  = offsetHeight => 
         * x2 = offsetHeight / (cos(theta) + height / width * sin(theta))
         * 
         * x = min(x1, x2)
         */

        const { width, height } = this.defaultSize

        let nextWidth = Math.min(
            offsetWidth / (Math.abs(Math.cos(theta)) + height / width * Math.abs(Math.sin(theta))),
            offsetHeight / (Math.abs(Math.sin(theta)) + height / width * Math.abs(Math.cos(theta)))
        )

        let zoom = nextWidth / this.defaultSize.width

        if (zoom > 1) {
            zoom = 1
        }

        nextWidth = width * zoom

        let nextHeight = height * zoom

        this.setState({
            width: nextWidth,
            height: nextHeight,
            left: (offsetWidth - nextWidth) / 2,
            top: (offsetHeight - nextHeight) / 2,
            rotate: this.state.rotate + delta,
            zoom
        })
    }

    /**
     * 开始拖拽
     * @param e 
     */
    startDrag(e: React.MouseEvent<HTMLDivElement>) {
        if (this.state.loaded) {
            const { offsetLeft, offsetTop } = e.currentTarget
            this.dragStartPos = [e.clientX, e.clientY]
            this.targetStartPos = [offsetLeft, offsetTop]
            this.dragTarget = e.currentTarget
            this.dragging = true
        }
    }

    /**
     * 结束拖拽
     */
    endDrag() {
        this.dragging = false
    }

    /**
     * 处理预览图片错误
     */
    protected handleThumbnailError(e) {
        this.setState({
            previewError: e
        })
    }
}