import * as React from 'react';
import { pick, assign, isFunction, noop, range, throttle } from 'lodash';
import { previewOSS } from '../../core/preview/preview';
import { watermarkFactory } from '../../core/watermark/watermark';
import { docname } from '../../core/docs/docs';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { findType } from '../../core/extension/extension';
import { bindEvent, unbindEvent, userAgent, Browser } from '../../util/browser/browser';
import { timer } from '../../util/timer/timer';
import { getContextWindow } from '../../ui/decorators';
import { Status } from './helper';

const CSS_UNITS = 96.0 / 72.0;

@getContextWindow
export default class PDFViewerBase extends React.Component<Components.PDFViewer.Props, any>{
    constructor(props, context) {
        super(props, context);
        this.fetchPDF = this.fetchPDF.bind(this);
        this.renderRange = this.renderRange.bind(this);
        this.parsePages = this.parsePages.bind(this);
    }

    state: Components.PDFViewer.State = {
        status: Status.Fetching,
        pdf: null,
        watermark: noop,
        scaleRate: 100,
        pageNumber: 1,
        totalPage: 0,
        fullScreen: false,
        scrollViewTop: 0,
        scrollViewLeft: 0,
        scrollViewHeight: 0,
        scrollViewWidth: 0,
        mode: 'ContinuousMode',
        initialSize: {
            width: 0,
            height: 0
        },
        pages: [],
        toolbar: true,
        scaleTip: false
    }

    /**
     * 定时器id：鼠标停住不动1秒后隐藏toolbar工具栏
     */
    timer: null

    /**
     * 鼠标移入工具栏
     */
    mouseIsOverTools = false

    /**
     * 全屏之前页面的滚动高度
     */
    preTop = 0

    /**
     * canvas渲染信息
     */
    rendered = {}

    componentDidMount() {
        this.stopFetchPDF = timer(async () => {
            try {
                await this.fetchPDF();
            } catch (e) {
                if (e.errcode !== 503002) {
                    this.stopFetchPDF();
                    this.props.onError(e.errcode);
                }
            }
        }, 2000)

        bindEvent(this.refs.container, 'mousemove', this.handleMouseMoveLazily);
        /**
         * 鼠标停住不动3秒后隐藏toolbar工具栏
         */
        this.timer = window.setTimeout(() => {
            this.setState({
                toolbar: false
            })
        }, 3000);
    }



    /**
     * 全屏或者退出全屏时，更新已渲染页面信息和this.state.pages数组
     */
    componentWillReceiveProps(nextProps) {
        const document = this.getContextWindow().document;
        if (nextProps.fullScreen !== this.props.fullScreen) {
            const doctype = findType(docname(this.props.doc));
            if (doctype === 'PPT' && nextProps.fullScreen) {

                this.setState({
                    mode: 'ShowMode',
                    scrollViewTop: 0
                }, async function () {
                    await this.parsePages({ mode: 'ShowMode' });
                    this.renderRange({ mode: 'ShowMode', scrollViewTop: 0 });
                })
                bindEvent(document, 'keydown', this.handleKeyDown)
                // 绑定鼠标滚轮事件(放映模式下，滚轮翻页)
                if (userAgent().app === Browser.Firefox) {
                    // 火狐浏览器
                    bindEvent(document, 'DOMMouseScroll', this.handleScrollPage)
                } else {
                    // 非火狐浏览器
                    bindEvent(document, 'mousewheel', this.handleScrollPage)
                }

            } else if (doctype === 'PPT' && !nextProps.fullScreen) {
                this.parsePages({ mode: 'ContinuousMode' }).then(() => {
                    this.renderRange({ mode: 'ContinuousMode', scrollViewTop: this.preTop });
                    this.setState({
                        mode: 'ContinuousMode',
                        scrollViewTop: this.preTop
                    })
                    unbindEvent(document, 'keydown', this.handleKeyDown)
                })
                // 卸载鼠标滚轮事件
                if (userAgent().app === Browser.Firefox) {
                    // 火狐浏览器
                    unbindEvent(document, 'DOMMouseScroll', this.handleScrollPage)
                } else {
                    // 非火狐浏览器
                    unbindEvent(document, 'mousewheel', this.handleScrollPage)
                }
            }
        } else {
            this.handlecomputeSize();
        }
    }

    /**
     * 当内容高度小于窗口高度时，设置内容垂直居中
     */
    componentDidUpdate() {
        if (this.refs.pdfContainer && this.refs.pdfContainer.clientHeight) {
            if (this.refs.pdfContainer.clientHeight < this.state.scrollViewHeight) {
                this.refs.pdfContainer.style.marginTop = `${(this.state.scrollViewHeight - this.refs.pdfContainer.clientHeight) / 2}px`
            } else {
                this.refs.pdfContainer.style.marginTop = 0;
            }
        }
    }

    /**
     * 卸载组件时，卸载事件绑定
     */
    componentWillUnmount() {
        const document = this.getContextWindow().document;
        unbindEvent(this.refs.container, 'mousemove', this.handleMouseMoveLazily);

        /**
         * 组件卸载时停止转换文档
         */
        isFunction(this.stopFetchPDF) && this.stopFetchPDF();

        // 卸载鼠标滚轮事件
        if (userAgent().app === Browser.Firefox) {
            // 火狐浏览器
            unbindEvent(document, 'DOMMouseScroll', this.handleScrollPage)
        } else {
            // 非火狐浏览器
            unbindEvent(document, 'mousewheel', this.handleScrollPage)
        }
    }

    /**
     * 移动鼠标，显示toolbar工具栏
     */
    handleMouseMove = () => {
        window.clearTimeout(this.timer);
        this.timer = null;
        this.setState({
            toolbar: true
        }, () => {
            if (!this.mouseIsOverTools) {
                this.hideToolbar();
            }
        })
    }

    handleToolsMouseEnter() {
        this.mouseIsOverTools = true
    }

    handleToolsMouseLeave() {
        this.mouseIsOverTools = false
    }

    handleMouseMoveLazily = throttle(this.handleMouseMove, 200, { leading: false, trailing: true })

    hideToolbar() {
        this.timer = window.setTimeout(() => {
            this.setState({
                toolbar: false
            })
        }, 1000);
    }

    /**
     * 滑动鼠标滚轮事件(放映模式，没有滚动条的情况下，滚轮实现翻页)
     */
    handleScrollPage = (e) => {
        const container = this.refs.container;
        const content = this.refs.pdfContainer;
        const { pageNumber, initialSize, scaleRate } = this.state;
        if (container.clientHeight > content.clientHeight) {
            if (e.wheelDelta > 0 || e.detail < 0) {
                this.handlePage(Number(pageNumber) - 1);
                this.preTop = this.preTop - Math.floor((initialSize.height * scaleRate / 100 + 3))
            } else if (e.wheelDelta < 0 || e.detail > 0) {
                this.handlePage(Number(pageNumber) + 1);
                this.preTop = this.preTop + Math.floor((initialSize.height * scaleRate / 100 + 3))
            }
        }
        return false;
    }

    /**
     * ppt全屏状态（放映模式）下实现按下键盘上下左右方向键翻页
     */
    handleKeyDown = (e: KeyboardEvent) => {
        const { pageNumber, initialSize, scaleRate } = this.state;
        if (this.refs.pdfContainer.clientHeight < this.refs.container.clientHeight) {
            if (e.keyCode === 37 || e.keyCode === 38) {
                this.handlePage(Number(pageNumber) - 1);
                this.preTop = this.preTop - Math.floor((initialSize.height * scaleRate / 100 + 3))
            } else if (e.keyCode === 39 || e.keyCode === 40) {
                this.handlePage(Number(pageNumber) + 1);
                this.preTop = this.preTop + Math.floor((initialSize.height * scaleRate / 100 + 3))
            }
        }
    }

    async handleZoomStart(nextScaleRate) {
        nextScaleRate = parseInt(nextScaleRate);
        if (nextScaleRate > 400 || nextScaleRate < 10) {
            return;
        }
        const { scrollViewTop, scrollViewLeft, scaleRate, totalPage, initialSize, mode, pageNumber, scrollViewWidth, scrollViewHeight } = this.state;
        let pdfTop = Math.floor(scrollViewTop / scaleRate * nextScaleRate);
        this.totalPDFleft = Math.floor(initialSize.width * nextScaleRate / 100) > scrollViewWidth ? Math.floor(initialSize.width * nextScaleRate / 100) - this.state.scrollViewWidth : 0;
        if (mode === 'ShowMode') {
            // 缩放后，更新全屏前的scrollTop，目的是退出全屏的时候能定位到当前页
            this.preTop = Math.floor(initialSize.height * nextScaleRate / 100 + 3) * (pageNumber - 1) - 3;
            this.totalPDFtop = Math.floor(initialSize.height * nextScaleRate / 100) > scrollViewHeight ? Math.floor(initialSize.height * nextScaleRate / 100) - scrollViewHeight : 0;
            if (scrollViewLeft > this.totalPDFleft && scrollViewTop > this.totalPDFtop) {
                await new Promise(resolve => {
                    this.setState({
                        scrollViewLeft: this.totalPDFleft,
                        scrollViewTop: this.totalPDFtop,
                        scaleRate: nextScaleRate
                    }, () => {
                        resolve();
                    })
                })
            } else if (scrollViewLeft > this.totalPDFleft) {
                await new Promise(resolve => {
                    this.setState({
                        scrollViewLeft: this.totalPDFleft,
                        scaleRate: nextScaleRate
                    }, () => {
                        resolve();
                    })
                })
            } else if (scrollViewTop > this.totalPDFtop) {
                await new Promise(resolve => {
                    this.setState({
                        scrollViewTop: this.totalPDFtop,
                        scaleRate: nextScaleRate
                    }, () => {
                        resolve();
                    })
                })
            } else {
                await new Promise(resolve => {
                    this.setState({
                        scaleRate: nextScaleRate
                    }, () => {
                        resolve();
                    })
                });
            }

        } else if (mode === 'ContinuousMode') {
            this.totalPDFtop = totalPage * Math.floor(initialSize.height * nextScaleRate / 100) + 3 * totalPage - scrollViewHeight;
            if (this.totalPDFtop < 0) {
                this.totalPDFtop = 0;
            }
            pdfTop = pdfTop > this.totalPDFtop ? this.totalPDFtop : pdfTop;
            if (scrollViewLeft > this.totalPDFleft) {
                await new Promise(resolve => {
                    this.setState({
                        scrollViewLeft: this.totalPDFleft,
                        scrollViewTop: pdfTop,
                        scaleRate: nextScaleRate
                    }, () => {
                        resolve();
                    })
                })
            } else {
                await new Promise(resolve => {
                    this.setState({
                        scaleRate: nextScaleRate,
                        scrollViewTop: pdfTop
                    }, () => {
                        resolve();
                    })
                })
            }
        }
    }

    /**
     * 拖拽slider结束松开鼠标
     */
    async handleZoomEnd(scaleRate) {
        scaleRate = parseInt(scaleRate);
        this.setState({
            scaleTip: true
        }, () => {
            setTimeout(() => {
                this.setState({
                    scaleTip: false
                })
            }, 2000)
        })
        await this.parsePages({ scaleRate });
        this.renderRange({ scaleRate });
    }

    timeoutId

    /**
     * 缩放
     * @param nextScaleRate 
     */
    async handleScale(nextScaleRate) {
        await new Promise(resolve => {
            clearTimeout(this.timeoutId)
            this.setState({
                scaleTip: true
            }, () => {
                this.timeoutId = setTimeout(() => {
                    this.setState({
                        scaleTip: false
                    })
                }, 2000)
                resolve()
            })
        })
        await this.handleZoomStart(nextScaleRate);
        await this.parsePages({ scaleRate: nextScaleRate });
        this.renderRange({ scaleRate: nextScaleRate });
    }

    /**
     * 翻页
     */
    handlePage(pageNumber) {
        const { totalPage, initialSize, scaleRate, mode } = this.state;
        /**
         * 计算pdf向上滚动的scrollTop
         */
        let pdfTop = Math.floor(initialSize.height * scaleRate / 100 + 3) * (pageNumber - 1) - 3;
        if (pdfTop > this.totalPDFtop) {
            pdfTop = this.totalPDFtop
        } if (pdfTop <= 0) {
            pdfTop = 0
        }
        switch (true) {
            case pageNumber > totalPage:
                pageNumber = totalPage;
                break;
            case pageNumber < 1:
                pageNumber = 1;
                break;
        }
        if (mode === 'ShowMode') {
            this.setState({
                pageNumber
            }, async function () {
                await this.parsePages();
                this.renderRange();
                // 翻页后，更新全屏前的scrollTop，目的是退出全屏的时候能定位到当前页
                this.preTop = pdfTop;
            })
        } else if (mode === 'ContinuousMode') {
            this.setState({
                pageNumber,
                scrollViewTop: pdfTop
            }, function () {
                this.renderRange();
            })
        }
    }

    handleFullScreen() {
        if (this.state.mode === 'ContinuousMode') {
            // 全屏之前，记住之前滚动条的滚动距离
            this.preTop = this.state.scrollViewTop;
        }
        this.props.onRequestFullScreen();
    }

    handleChangeScrollView(width, height) {
        this.setState({
            scrollViewHeight: height,
            scrollViewWidth: width
        })
    }


    /**
     * 重新计算滚动条
     */
    handlecomputeSize() {
        this.refs.scrollView && this.refs.scrollView.computeSize(this.state.scrollViewTop, this.state.scrollViewLeft);
    }

    /**
     * PDF容器滚动条（拖动、滚动）回调，渲染pdf
     */
    handleScroll(top, left, height) {
        const { initialSize, scaleRate, mode, pages } = this.state;
        if (mode === 'ShowMode') {
            if (top !== undefined && left !== undefined) {
                this.setState({
                    scrollViewTop: top,
                    scrollViewLeft: left,
                    scrollViewHeight: height,
                })
            } else if (top !== undefined) {
                this.setState({
                    scrollViewTop: top,
                    scrollViewHeight: height,
                })
            } else if (left !== undefined) {
                this.setState({
                    scrollViewLeft: left,
                    scrollViewHeight: height,
                })
            }
        } else if (mode === 'ContinuousMode') {
            if (top !== undefined && left !== undefined) {
                let page = Math.ceil(((top + height / 2) / Math.floor(initialSize.height * scaleRate / 100 + 3)));
                page = page > 0 ? page : 1;
                this.setState({
                    scrollViewTop: top,
                    scrollViewLeft: left,
                    scrollViewHeight: height,
                    pageNumber: initialSize.height ? page : 1
                }, () => {
                    if (pages.length) {
                        this.renderRange();
                    }
                })
            } else if (top !== undefined) {
                let page = Math.ceil(((top + height / 2) / Math.floor(initialSize.height * scaleRate / 100 + 3)));
                page = page > 0 ? page : 1;
                this.setState({
                    scrollViewTop: top,
                    scrollViewHeight: height,
                    pageNumber: initialSize.height ? page : 1
                }, () => {
                    if (pages.length) {
                        this.renderRange();
                    }
                })
            } else if (left !== undefined) {
                this.setState({
                    scrollViewLeft: left,
                    scrollViewHeight: height
                })
            }
        }
    }

    /**
     * 获取PDF
     */
    async fetchPDF() {
        const { doc, illegalContentQuarantine } = this.props;
        const self = this;
        /**
         * 文件转码
         */
        const { url } = await previewOSS(assign({ illegalContentQuarantine }, pick(doc, ['docid', 'rev', 'link', 'password'])));
        const loadingTask = PDFJS.getDocument(url);
        loadingTask.onProgress = (data) => self.props.onPropgress(data);

        /**
         * 获取水印
         */
        const watermark = await watermarkFactory(doc);

        try {
            /**
             * 获取pdf对象
             */
            const pdf = await loadingTask;
            let viewport;
            const page = await pdf.getPage(1);
            viewport = page.getViewport(1);
            self.setState({
                pdf,
                watermark,
                totalPage: pdf.numPages,
                initialSize: {
                    width: Math.floor(viewport.width * CSS_UNITS),
                    height: Math.floor(viewport.height * CSS_UNITS)
                },
                status: Status.OK
            }, async () => {
                self.rendered = {};
                /**
                 * 解析pdf
                 * 
                 */
                await self.parsePages();

                /**
                 * 渲染pdf
                 */
                self.renderRange();
            })

            self.totalPDFtop = pdf.numPages * Math.floor(viewport.height * CSS_UNITS) * self.state.scaleRate / 100 + 3 * pdf.numPages - self.state.scrollViewHeight;
        } catch (e) {
            self.props.onError(Status.Failed);
            if (e.status === 0) {
                const onNetworkError = getOpenAPIConfig('onNetworkError');
                if (isFunction(onNetworkError)) {
                    onNetworkError();
                }
            }
        }

        /**
         * 转换文档成功,停止转换文档的轮循工作
         */
        if (isFunction(this.stopFetchPDF)) {
            this.stopFetchPDF();
        }
    }

    /**
     * 解析pdf,获取页面信息，设置this.state.pages数组
     * 放映模式：this.state.pages只有一个元素
     * 连续模式：this.state.pages长度为pdf总页数
     */
    async parsePages({ scaleRate = this.state.scaleRate, mode = this.state.mode } = { scaleRate: this.state.scaleRate, mode: this.state.mode }) {
        this.rendered = {};
        const { pdf } = this.state;
        const pageNumber = Number(this.state.pageNumber);
        let pages;
        if (mode === 'ShowMode') {
            let pageShow = await pdf.getPage(pageNumber);
            pages = [{ page: pageShow, viewport: pageShow.getViewport(scaleRate / 100 * CSS_UNITS) }]
        } else if (mode === 'ContinuousMode') {
            pages = await range(1, pdf.numPages + 1).reduce(async (prePagesPromise, i) => {
                let pageContinuous = await pdf.getPage(i)
                return [...(await prePagesPromise), { page: pageContinuous, viewport: pageContinuous.getViewport(scaleRate / 100 * CSS_UNITS) }]
            }, [])
        }
        await new Promise(resolve => {
            this.setState({
                pages
            }, () => {
                this.handlecomputeSize();
                resolve();
            })
        })
    }

    /**
     * 计算需要渲染的页面index范围并对这些页面进行渲染
     * @param scrollViewTop PDF页面向上滚动的scrollTop
     * @param height PDF单页高度
     */
    renderRange = ({ scrollViewTop = this.state.scrollViewTop, scaleRate = this.state.scaleRate, mode = this.state.mode } = { scrollViewTop: this.state.scrollViewTop, scaleRate: this.state.scaleRate, mode: this.state.mode }) => {
        const PRINT_RESOLUTION = 150;
        const PRINT_UNITS = PRINT_RESOLUTION / 72.0;
        const { watermark, pages, scrollViewHeight } = this.state;
        const height = Math.floor(pages[0].viewport.height);
        const a = Math.floor(scrollViewTop / (height + 3));
        const b = Math.ceil((scrollViewTop + scrollViewHeight) / (height + 3));
        const mark = watermark({ zoom: scaleRate / 100 * PRINT_UNITS });

        pages.slice(a, b + 1).reduce(async (prePromise, { page, viewport }, index) => {
            if (mode === 'ContinuousMode') {
                if (this.rendered[a + index])
                    return;
                this.rendered[a + index] = true;
            }
            await prePromise;
            const canvas = this.refs[`canvas${a + index}`];
            canvas.width = Math.floor(viewport.width) * Math.max(window.devicePixelRatio || 1, 2);
            canvas.height = Math.floor(viewport.height) * Math.max(window.devicePixelRatio || 1, 2);
            const ctx = canvas.getContext('2d');
            ctx.save();
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();
            const context = {
                canvasContext: ctx,
                transform: [PRINT_UNITS, 0, 0, PRINT_UNITS, 0, 0],
                viewport: viewport,
                intent: 'print'
            };
            await page.render(context);
            if (mark) {
                if (mark.layout !== 0) {
                    context.canvasContext.fillStyle = context.canvasContext.createPattern(mark.src, 'repeat')
                    context.canvasContext.fillRect(0, 0, canvas.width, canvas.height)
                } else {
                    context.canvasContext.drawImage(mark.src, (canvas.width - mark.src.width) / 2, (canvas.height - mark.src.height) / 2)
                }
            }
        }, Promise.resolve(null));
    }
}