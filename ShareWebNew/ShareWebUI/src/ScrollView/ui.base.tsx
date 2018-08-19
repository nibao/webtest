import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import { bindEvent, unbindEvent, userAgent, Browser } from '../../util/browser/browser';
import { getContextWindow } from '../decorators';
import * as styles from './styles.desktop.css';

@getContextWindow
export default class ScrollViewBase extends React.Component<UI.ScrollView.Props, UI.ScrollView.State>{
    constructor(props, context) {
        super(props, context);
        this.handleScroll = this.handleScroll.bind(this);
        this.handleDragY = this.handleDragY.bind(this);
        this.handleDragX = this.handleDragX.bind(this);
        this.mouseUp = this.mouseUp.bind(this);
        this.computeSize = this.computeSize.bind(this);
        this.handleBindKeyEvent = this.handleBindKeyEvent.bind(this);
        this.handleUnbindKeyEvent = this.handleUnbindKeyEvent.bind(this);
    }

    static defaultProps = {
        scrollViewTop: 0,
        scrollViewLeft: 0,
        doChangeScrollViewSize: noop
    }

    state: UI.ScrollView.State = {
        barHeight: 0,
        barWidth: 0,
        scrollY: false,
        scrollX: false,
        scrollBarTop: 0,
        scrollBarLeft: 0,
        scrollViewTop: this.props.scrollViewTop,
        scrollViewLeft: this.props.scrollViewLeft
    }

    /**
     * 鼠标按住内容区域时记录初始信息
     */
    dragContentInfo = {
        pointerstart: {
            x: 0,
            y: 0
        },
        top: 0,
        left: 0
    }


    /**
     * 拖拽内容区域每次鼠标移动产生的位置信息
     */
    lastMove = {
        x: 0,
        y: 0
    }

    /**
     * 鼠标按住横向滚动条的滑块时记录初始信息
     */
    dragXInfo = {
        FixedWidth: 0
    }

    /**
     * 鼠标按住纵向滚动条的滑块时记录初始信息
     */
    dragYInfo = {
        FixedHeight: 0
    }

    /**
     * 横向、纵向、内容区域是否正在进行拖拽
     */
    isDragX = false
    isDragY = false
    isDragContent = false

    componentDidMount() {
        this.content = this.refs.content;
        this.container = this.refs.container;
        this.computeSize();
        const document = this.getContextWindow().document;
        bindEvent(window, 'resize', this.resizeView);
        bindEvent(document, 'mouseup', this.mouseUp);
        bindEvent(document, 'mousemove', this.moveContent);
        bindEvent(document, 'mousemove', this.moveSlideX);
        bindEvent(document, 'mousemove', this.moveSlideY);
        bindEvent(this.container, 'mouseenter', this.handleBindKeyEvent);
        bindEvent(this.container, 'mouseleave', this.handleUnbindKeyEvent);


        // 触发滚动(渲染pdf)
        if (typeof this.props.onScroll === 'function') {
            this.props.onScroll(0, 0, this.refs.container.clientHeight);
        }
    }

    componentWillReceiveProps(nextProps) {
        let { scrollViewTop, scrollViewLeft } = nextProps;
        if (scrollViewTop !== this.props.scrollViewTop || scrollViewLeft !== this.props.scrollViewLeft) {
            this.computeSize(scrollViewTop, scrollViewLeft);
            this.dragContentInfo.top = scrollViewTop;
            this.dragContentInfo.left = scrollViewLeft;
            this.dragContentInfo.pointerstart = {
                x: this.lastMove.x,
                y: this.lastMove.y
            }
        }
    }

    componentWillUnmount() {
        const document = this.getContextWindow().document;
        unbindEvent(window, 'resize', this.resizeView);
        unbindEvent(document, 'mouseup', this.mouseUp);
        unbindEvent(document, 'mousemove', this.moveContent);
        unbindEvent(document, 'mousemove', this.moveSlideX);
        unbindEvent(document, 'mousemove', this.moveSlideY);
        unbindEvent(this.container, 'mouseenter', this.handleBindKeyEvent);
        unbindEvent(this.container, 'mouseleave', this.handleUnbindKeyEvent);
        unbindEvent(document, 'keydown', this.handleKeyDown);
    }

    handleBindKeyEvent() {
        const document = this.getContextWindow().document;
        bindEvent(document, 'keydown', this.handleKeyDown);
    }

    handleUnbindKeyEvent() {
        const document = this.getContextWindow().document;
        unbindEvent(document, 'keydown', this.handleKeyDown);
    }

    /**
     * 改变窗口大小时触发
     */
    resizeView = () => {
        this.computeSize();
    }

    /**
     * 计算横竖向滚动条是否存在（内容宽或高是否大于容器宽或高）
     * 并根据内容区域的scrollleft&scrolltop计算横/竖向滚动条中滑块的位置
     * @param scrollViewTop 
     * @param scrollViewLeft
     */
    computeSize(scrollViewTop = undefined, scrollViewLeft = undefined) {
        const container = this.refs.container;
        const content = this.refs.content;
        const containerH = container.clientHeight;
        const contentH = content.clientHeight;
        const containerW = container.clientWidth;
        const contentW = content.clientWidth;

        // 滚动条设置
        if (contentH > containerH) {
            if (contentW > containerW) {
                this.setState({
                    scrollY: true,
                    scrollX: true,
                    scrollViewTop,
                    scrollViewLeft,
                    barHeight: (Math.pow(containerH, 2) / contentH) > 15 ? (Math.pow(containerH, 2) / contentH) : 15,
                    barWidth: (Math.pow(containerW, 2) / contentW) > 15 ? (Math.pow(containerW, 2) / contentW) : 15
                }, () => {
                    this.computeScrollBar(scrollViewTop, scrollViewLeft);
                })
            } else {
                this.setState({
                    scrollY: true,
                    scrollX: false,
                    scrollViewTop,
                    barHeight: (Math.pow(containerH, 2) / contentH) > 15 ? (Math.pow(containerH, 2) / contentH) : 15,
                    barWidth: 0
                }, () => {
                    this.computeScrollBar(scrollViewTop, undefined);
                })
            }
            // 绑定鼠标滚轮事件
            if (userAgent().app === Browser.Firefox) {
                // 火狐浏览器
                bindEvent(container, 'DOMMouseScroll', this.handleScroll)
            } else {
                // 非火狐浏览器
                bindEvent(container, 'mousewheel', this.handleScroll)
            }
        } else if (contentW > containerW) {
            this.setState({
                scrollX: true,
                scrollY: false,
                scrollViewLeft,
                scrollViewTop: 0,
                barWidth: (Math.pow(containerW, 2) / contentW) > 15 ? (Math.pow(containerW, 2) / contentW) : 15,
                barHeight: 0
            }, () => {
                this.computeScrollBar(undefined, scrollViewLeft);
            })

        } else {
            this.setState({
                scrollY: false,
                scrollX: false,
                barHeight: 0,
                scrollViewLeft: 0,
                scrollViewTop: 0,
                barWidth: 0,
            })
            // 卸载鼠标滚轮事件
            if (userAgent().app === Browser.Firefox) {
                // 火狐浏览器
                unbindEvent(container, 'DOMMouseScroll', this.handleScroll)
            } else {
                // 非火狐浏览器
                unbindEvent(container, 'mousewheel', this.handleScroll)
            }
        }
        this.props.doChangeScrollViewSize(container.clientWidth, container.clientHeight);
    }

    handleKeyDown = (e: KeyboardEvent) => {
        if (this.content.clientHeight > this.container.clientHeight) {
            if (e.keyCode === 38) {
                this.handleUpdate(this.props.scrollViewTop - 120, this.state.scrollViewLeft, this.refs.container.clientHeight)
                e.preventDefault();
            } else if (e.keyCode === 40) {
                this.handleUpdate(this.props.scrollViewTop + 120, this.state.scrollViewLeft, this.refs.container.clientHeight)
                e.preventDefault();
            }
        }
        if (this.content.clientWidth > this.container.clientWidth) {
            if (e.keyCode === 37) {
                this.handleUpdate(this.state.scrollViewTop, this.props.scrollViewLeft - 60, this.refs.container.clientHeight)
                e.preventDefault();
            } else if (e.keyCode === 39) {
                this.handleUpdate(this.state.scrollViewTop, this.props.scrollViewLeft + 60, this.refs.container.clientHeight)
                e.preventDefault();
            }
        }
    }

    /**
     * 滑动鼠标滚轮事件
     */
    handleScroll(e) {
        const container = this.refs.container;
        const content = this.refs.content;
        if (this.refs.scrollY) {
            const scrollY = this.refs.scrollY.refs.scroll;
            const scrollbarY = this.refs.scrollY.refs.scrollbar;
            let t = 0;

            if (e.wheelDelta > 0 || e.detail < 0) {
                t = content.offsetTop + 120;
            } else if (e.wheelDelta < 0 || e.detail > 0) {
                t = content.offsetTop - 120;
            }
            if (t >= 0) {
                t = 0;
            };
            if (t <= -(content.clientHeight - container.clientHeight)) {
                t = -(content.clientHeight - container.clientHeight);
            };
            let top = 0;
            if (scrollbarY.clientHeight > 15) {
                top = (t + container.clientHeight) * scrollY.clientHeight / content.clientHeight - scrollbarY.clientHeight;
            } else {
                top = (t * (scrollY.clientHeight - scrollbarY.clientHeight) / (content.clientHeight - container.clientHeight))
            }
            this.handleUpdate(-t, undefined, container.clientHeight);
        }

        e.preventDefault();
    }

    /**
     * 根据content的scrollTop和scrollLeft计算竖向/横向滚动条定位
     * @param scrollViewTop:容器向上滚动的scrollTop(正数)
     * @param scrollViewLeft:容器向上滚动的scrollLeft(正数)
     */
    computeScrollBar = (scrollViewTop, scrollViewLeft) => {
        let scrollY;
        let scrollbarY;
        let scrollbarX;
        let scrollX;
        if (this.refs.scrollY) {
            scrollY = this.refs.scrollY.refs.scroll;
            scrollbarY = this.refs.scrollY.refs.scrollbar;
        }
        if (this.refs.scrollX) {
            scrollbarX = this.refs.scrollX.refs.scrollbar;
            scrollX = this.refs.scrollX.refs.scroll;
        }
        const container = this.refs.container;
        const content = this.refs.content;
        let top = 0;
        let left = 0;

        // 计算当前this.props.scrollViewLeft和this.props.scrollViewTop的大小是否超过最大边界（例如缩放或者resize时，已经移动到最右的横向滚动条的scrollLeft可能大于resize后的content.clientWidth - container.clientWidth）
        if (this.props.scrollViewLeft > content.clientWidth - container.clientWidth && this.props.scrollViewTop > content.clientHeight - container.clientHeight) {
            this.handleUpdate(content.clientHeight - container.clientHeight, content.clientWidth - container.clientWidth, container.clientHeight);
        } else if (this.props.scrollViewLeft > content.clientWidth - container.clientWidth) {
            this.handleUpdate(undefined, content.clientWidth - container.clientWidth, container.clientHeight);
        } else if (this.props.scrollViewTop > content.clientHeight - container.clientHeight) {
            this.handleUpdate(content.clientHeight - container.clientHeight, undefined, container.clientHeight);
        } else if (this.props.scrollViewLeft < 0 && this.props.scrollViewTop < 0) {
            this.handleUpdate(0, 0, container.clientHeight);
        } else if (this.props.scrollViewLeft < 0) {
            this.handleUpdate(undefined, 0, container.clientHeight);
        } else if (this.props.scrollViewTop < 0) {
            this.handleUpdate(0, undefined, container.clientHeight);
        } else {
            if (scrollViewTop !== undefined && scrollViewLeft !== undefined) {
                if (scrollbarY.clientHeight > 15) {
                    top = (scrollViewTop + container.clientHeight) * scrollY.clientHeight / content.clientHeight - scrollbarY.clientHeight;
                } else {
                    top = (scrollViewTop * (scrollY.clientHeight - scrollbarY.clientHeight) / (content.clientHeight - container.clientHeight))
                }
                if (scrollbarX.clientWidth > 15) {
                    left = (scrollViewLeft + container.clientWidth) * scrollX.clientWidth / content.clientWidth - scrollbarX.clientWidth;
                } else {
                    left = (scrollViewLeft * (scrollX.clientWidth - scrollbarX.clientWidth) / (content.clientWidth - container.clientWidth))
                }
                this.setState({
                    scrollBarTop: top,
                    scrollBarLeft: left
                })
            } else if (scrollViewTop !== undefined) {
                if (scrollbarY.clientHeight > 15) {
                    top = (scrollViewTop + container.clientHeight) * scrollY.clientHeight / content.clientHeight - scrollbarY.clientHeight;
                } else {
                    top = (scrollViewTop * (scrollY.clientHeight - scrollbarY.clientHeight) / (content.clientHeight - container.clientHeight))
                }
                this.setState({
                    scrollBarTop: top
                })
            } else if (scrollViewLeft !== undefined) {
                if (scrollbarX.clientWidth > 15) {
                    left = (scrollViewLeft + container.clientWidth) * scrollX.clientWidth / content.clientWidth - scrollbarX.clientWidth;
                } else {
                    left = (scrollViewLeft * (scrollX.clientWidth - scrollbarX.clientWidth) / (content.clientWidth - container.clientWidth))
                }
                this.setState({
                    scrollBarLeft: left
                })
            }
        }

    }

    /**
     * 内容区域按下事件
     */
    handleDragContent = (e: MouseEvent) => {
        if (this.container.clientHeight < this.content.clientHeight || this.container.clientWidth < this.content.clientWidth) {
            this.dragContentInfo.pointerstart = {
                x: e.clientX,
                y: e.clientY
            };
            this.dragContentInfo.top = this.props.scrollViewTop;
            this.dragContentInfo.left = this.props.scrollViewLeft;
            this.content.className = classnames(styles['content'], styles['grabbing']);
            this.isDragContent = true;
        } else {
            this.content.className = styles['content'];
            this.isDragContent = false;
        }
    }

    /**
     * 当鼠标按住content区域，并在document上移动时触发
     */
    moveContent = (e: MouseEvent) => {
        if (this.isDragContent) {
            this.lastMove = {
                x: e.clientX,
                y: e.clientY
            }
            if (this.container.clientHeight < this.content.clientHeight && this.container.clientWidth < this.content.clientWidth) {
                let topNew = this.dragContentInfo.top + this.dragContentInfo.pointerstart.y - e.clientY;
                let leftNew = this.dragContentInfo.left + this.dragContentInfo.pointerstart.x - e.clientX;
                if (topNew > this.content.clientHeight - this.container.clientHeight) {
                    topNew = this.content.clientHeight - this.container.clientHeight
                } else if (topNew < 0) {
                    topNew = 0;
                }
                if (leftNew > this.content.clientWidth - this.container.clientWidth) {
                    leftNew = this.content.clientWidth - this.container.clientWidth;
                } else if (leftNew < 0) {
                    leftNew = 0;
                }
                this.handleUpdate(topNew, leftNew, this.container.clientHeight);
            } else if (this.container.clientWidth < this.content.clientWidth) {
                let leftNew = this.dragContentInfo.left + this.dragContentInfo.pointerstart.x - e.clientX;
                if (leftNew > this.content.clientWidth - this.container.clientWidth) {
                    leftNew = this.content.clientWidth - this.container.clientWidth;
                } else if (leftNew < 0) {
                    leftNew = 0;
                }
                this.handleUpdate(undefined, leftNew, this.container.clientHeight);
            } else if (this.container.clientHeight < this.content.clientHeight) {
                let topNew = this.dragContentInfo.top + this.dragContentInfo.pointerstart.y - e.clientY;
                if (topNew > this.content.clientHeight - this.container.clientHeight) {
                    topNew = this.content.clientHeight - this.container.clientHeight
                } else if (topNew < 0) {
                    topNew = 0;
                }
                this.handleUpdate(topNew, undefined, this.container.clientHeight);
            }
        } else {
            return false;
        }
        e.preventDefault();
    }

    /**
     * 竖向滚动条按下事件
     */
    handleDragY(e) {
        this.isDragY = true;
        this.dragYInfo.FixedHeight = e.clientY - this.refs.scrollY.refs.scrollbar.offsetTop;
        e.preventDefault();
    }

    /**
     * 当鼠标按住竖向滚动条的滑块区域，并在document上移动时触发
     */
    moveSlideY = (e: MouseEvent) => {
        if (this.isDragY) {
            const scrollY = this.refs.scrollY.refs.scroll;
            const scrollbarY = this.refs.scrollY.refs.scrollbar;
            const { content, container } = this;
            let scrollTopNew = e.clientY - this.dragYInfo.FixedHeight;
            if (scrollTopNew <= 0) {
                scrollTopNew = 0;
            };
            if (scrollTopNew >= scrollY.clientHeight - scrollbarY.clientHeight) {
                scrollTopNew = scrollY.clientHeight - scrollbarY.clientHeight;
            };
            let top = 0;
            if (scrollbarY.clientHeight > 15) {
                top = (scrollTopNew + scrollbarY.clientHeight) * content.clientHeight / scrollY.clientHeight - container.clientHeight;
            } else {
                top = (scrollTopNew * (content.clientHeight - container.clientHeight) / (scrollY.clientHeight - scrollbarY.clientHeight))
            }
            top = top > 0 ? top : 0;
            this.handleUpdate(top, undefined, container.clientHeight);
        } else {
            return false;
        }
        e.preventDefault();
    }

    /**
     * 横向滚动条按下事件
     */
    handleDragX(e) {
        this.isDragX = true;
        this.dragXInfo.FixedWidth = e.clientX - this.refs.scrollX.refs.scrollbar.offsetLeft;
        e.preventDefault();
    }

    /**
     * 当鼠标按住横向滚动条的滑块区域，并在document上移动时触发
     */
    moveSlideX = (e: MouseEvent) => {
        if (this.isDragX) {
            const scrollX = this.refs.scrollX.refs.scroll;
            const scrollbarX = this.refs.scrollX.refs.scrollbar;
            const { content, container } = this;
            let scrollLeftNew = e.clientX - this.dragXInfo.FixedWidth;
            if (scrollLeftNew <= 0) {
                scrollLeftNew = 0;
            };
            if (scrollLeftNew >= scrollX.clientWidth - scrollbarX.clientWidth) {
                scrollLeftNew = scrollX.clientWidth - scrollbarX.clientWidth;
            };
            const left = (scrollLeftNew + scrollbarX.clientWidth) * content.clientWidth / scrollX.clientWidth - container.clientWidth;
            this.handleUpdate(undefined, left, container.clientHeight);
        } else {
            return false;
        }
        e.preventDefault();
    }

    /**
     * 松开鼠标按键触发
     */
    mouseUp(e: MouseEvent) {
        if (this.isDragContent) {
            this.content.className = styles['content'];
            this.isDragContent = false;
        }
        if (this.isDragX) {
            this.isDragX = false;
        }
        if (this.isDragY) {
            this.isDragY = false;
        }
        e.preventDefault();
    }

    handleUpdate = (top, left, containerHeight) => {
        if (typeof this.props.onScroll === 'function') {
            this.props.onScroll(top, left, containerHeight);
        } else {
            if (top !== undefined) {
                if (left !== undefined) {
                    this.setState({
                        scrollViewTop: top,
                        scrollViewLeft: left
                    })
                } else {
                    this.setState({
                        scrollViewTop: top
                    })
                }
            } else if (left !== undefined) {
                this.setState({
                    scrollViewLeft: left
                })
            }
        }
    }
}