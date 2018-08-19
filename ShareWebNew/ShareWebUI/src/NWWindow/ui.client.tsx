/// <reference path="./index.d.ts" />

import * as React from 'react'
import { unmountComponentAtNode, unstable_renderSubtreeIntoContainer } from 'react-dom'
import { isFunction, throttle, isBoolean, isNumber, isString, isUndefined } from 'lodash'
import Mask from '../Mask/ui.client'
import NWProvider from '../NWProvider/ui.client'
import { PureComponent } from '../decorators'

@PureComponent
export default class NWWindow extends React.Component<UI.NWWindow.Props, any> {
    static defaultProps = {
        // 在NW中如果加载本地资源文件会导致窗口关闭后内存无法释放，从而引起内存泄漏问题
        // 因此HTML文件通过HTTP服务器获取
        url: `http://127.0.0.1:10080/assets/html/dialog.html`,

        show: true,

        frame: true,

        resizable: false,
    }

    /**
     * NW窗口实例
     */
    nwWindow: UI.NWWindow.NWWindow | null;

    /**
     * 组件挂载容器，同时用于计算组件尺寸
     */
    container = document.createElement('div');

    /**
     * 观察元素变化
     */
    observer?: MutationObserver;

    /**
     * 上一次尺寸变化后的宽度，用于内容变化时进行比较从而决定是否要触发窗口自适应
     */
    prevContainerWidth?: number;

    /**
     * 上一次尺寸变化后的高度，用于内容变化时进行比较从而决定是否要触发窗口自适应
     */
    prevContainerHeight?: number;

    componentDidMount() {
        nw.Window.open(this.props.url, {
            id: this.props.id,
            title: this.props.title,
            width: this.props.width,
            height: this.props.height,
            resizable: this.props.resizable,
            frame: this.props.frame,
            show: false, // nw窗口打开时默认先隐藏，等加载完内容后计算尺寸再显示
        }, (nwWindow) => {

            nwWindow.on('close', () => {
                isFunction(this.props.onClose) && this.props.onClose()
            })

            nwWindow.on('loaded', async () => {
                this.nwWindow = nwWindow

                nwWindow.window.document.body.appendChild(this.container)

                await this.renderComponent(this.container)

                this.fitWindow()

                if (this.props.show) {
                    nwWindow.setPosition('center')
                    nwWindow.show()
                }

                isFunction(this.props.onLoaded) && this.props.onLoaded(nwWindow)
            })

            if (this.props.maximize) {
                nwWindow.maximize();
            }

            if (this.props.minWidth && this.props.minHeight) {
                nwWindow.setMinimumSize(this.props.minWidth, this.props.minHeight)
            }

            isFunction(this.props.onOpen) && this.props.onOpen(nwWindow)
        });
    }

    componentWillReceiveProps({ id, title, width, height, minHeight, minWidth, resizable, show }) {
        if (this.nwWindow) {
            if ((isString(id) || isNumber(id)) && id !== this.props.id) {
                this.nwWindow.id = id;
            }

            if ((isString(title) || isNumber(title)) && title !== this.props.title) {
                this.nwWindow.title = title;
            }

            if ((isNumber(width) && width !== this.props.width) || (isNumber(height) && height !== this.props.height)) {
                this.nwWindow.resizeTo(width, height)
            }

            if ((isNumber(minWidth) && minWidth !== this.props.minWidth) || (isNumber(minHeight) && minHeight !== this.props.minHeight)) {
                this.nwWindow.setMinimumSize(minWidth, minHeight)
            }

            if (isBoolean(resizable) && resizable !== this.props.resizable) {
                this.nwWindow.setResizable(resizable)
            }

            if (isBoolean(show) && show !== this.props.show) {
                if (show === true) {
                    this.nwWindow.show()
                } else {
                    this.nwWindow.hide()
                }
            }
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.nwWindow) {
            await this.renderComponent(this.container)
        }
    }

    componentWillUnmount() {
        this.nwWindow.close(true)

        if (this.observer) {
            this.observer.disconnect()
        }

        unmountComponentAtNode(this.container)
        this.container.parentNode.removeChild(this.container)

        delete this.container
        delete this.nwWindow
        delete this.observer
    }

    /**
     * 适应窗口大小
     * 如果props传了width/height则不触发窗口适应内容
     */
    fitWindow() {
        if (isUndefined(this.props.width) && isUndefined(this.props.height)) {
            this.container.style.display = 'inline-block';

            this.resizeWindow();
            this.observe(this.container)

        } else {
            this.nwWindow.resizeTo(this.props.width, this.props.height)
        }
    }

    /**
     * 渲染React到容器
     * @param callback 渲染结束后执行回调
     */
    renderComponent(container) {
        return new Promise(resolve => {
            unstable_renderSubtreeIntoContainer(
                this,
                <NWProvider
                    window={this.nwWindow.window}
                >
                    {
                        this.props.children
                    }
                </NWProvider>,
                container,
                // 略微加上延迟，避免内容未渲染完成就resolve掉
                () => setTimeout(resolve, 200)
            )
        })
    }

    /**
     * 观察目标对象尺寸变化，自动缩放窗口大小
     * @param target 要观察变化的目标对象
     */
    private observe(target) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    if (target.clientWidth !== this.prevContainerWidth || target.clientHeight !== this.prevContainerHeight) {
                        this.throttleResizeWindow();
                    }
                }
            })
        })

        observer.observe(target, { childList: true, subtree: true })

        this.observer = observer

    }

    /**
     * 窗口自适应内容
     */
    private resizeWindow() {
        if (this.nwWindow) {
            const frameWidth = this.nwWindow.window.outerWidth - this.nwWindow.window.innerWidth;
            const frameHeight = this.nwWindow.window.outerHeight - this.nwWindow.window.innerHeight;
            const { clientWidth, clientHeight } = this.container;

            this.prevContainerWidth = clientWidth;
            this.prevContainerHeight = clientHeight;

            this.nwWindow.resizeTo(clientWidth + frameWidth, clientHeight + frameHeight);
        }
    }

    /**
     * 窗口自适应，并且限制了执行的频率
     */
    private throttleResizeWindow = throttle(this.resizeWindow, 1000 / 24, { leading: false, trailing: true })

    render() {
        return this.props.modal ? (
            <Mask />
        ) : null
    }
}