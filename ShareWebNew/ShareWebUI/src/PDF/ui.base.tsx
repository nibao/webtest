import { range, throttle, noop } from 'lodash';
import * as React from 'react';
import __ from './locale'

/**
 * 计算缩放比例
 */
function calcScale(width, page) {
    // window.devicePixelRatio不存在时，至少放大2倍
    return (width / page.view[2]) * Math.max(window.devicePixelRatio || 1, 2);
}

/**
 * 生成文档数据
 * @param pdf
 * @returns {*}
 */
function buildPagesData(pdf, width) {
    return Promise.all(range(pdf.numPages).map(n => buildDataByPageIndex(pdf, n + 1, width)));
}


/**
 * 构建单页的数据结构
 * @param pdf
 * @param n
 * @returns {*}
 */
function buildDataByPageIndex(pdf, n, width) {
    return pdf.getPage(n).then(page => {
        return {
            page,
            viewport: page.getViewport(calcScale(width, page))
        };
    });
}



/**
 * PDF预览组件
 * @component
 * @props pdf {PDFDocument} pdf对象
 * @props scale {number} 缩放比例
 */
export default class PDFBase extends React.Component<UI.PDF.Props, any> implements UI.PDF.Component {
    constructor(props) {
        super(props);
        this.mouseWheelHandler = throttle(this.mouseWheelHandler, 500, { leading: true, trailing: false })
    }

    static defaultProps = {
        pdf: null,

        width: 0,

        watermark: noop
    }

    state = {
        pages: [],

        rendering: false,

        pageIndex: 0,

        zoom: 1
    }


    /**
     * 加载PDF
     * @param options.lazy 是否懒加载
     * @param options.rerender 是否重新渲染
     */
    load(pdf, { rerender = false, width = 0 } = {}) {

        this.setState({
            rendering: true
        });

        Promise.all(range(1, pdf.numPages + 1).map(pageIndex => buildDataByPageIndex(pdf, pageIndex, width * this.state.zoom))).then((newPages) => {
            this.setState({
                pages: newPages,
                rendering: false
            })
        })
    }

    componentDidMount() {
        this.setState({
            watermark: this.props.watermark({ zoom: this.state.zoom * Math.max(window.devicePixelRatio || 1, 2) })
        })
        if (this.props.pdf) {
            this.load(this.props.pdf, { width: this.props.width })
        }
        window.addEventListener('mousewheel', this.mouseWheelHandler.bind(this))
        document.body.addEventListener('DOMMouseScroll', this.mouseWheelHandler.bind(this))
    }

    componentWillReceiveProps(nextProps) {
        if ((nextProps.pdf && nextProps.pdf !== this.props.pdf) || (nextProps.width !== this.props.width)) {
            this.load(nextProps.pdf, { rerender: true, width: nextProps.width })
        }
    }

    componentWillUnmount() {
        window.removeEventListener('mousewheel', this.mouseWheelHandler.bind(this))
        document.body.removeEventListener('DOMMouseScroll', this.mouseWheelHandler.bind(this))
    }

    go(pageIndex) {
        this.setState({
            pageIndex
        })
        this.refs.container.scrollLeft = 1
        this.refs.container.scrollTop = 1
    }

    zoom(value) {
        this.setState({
            zoom: value,
            watermark: this.props.watermark({ zoom: value * Math.max(window.devicePixelRatio || 1, 2) })
        }, () => {
            this.load(this.props.pdf, { rerender: true, width: this.props.width })
        })
    }

    mouseWheelHandler(e) {
        const { scrollTop, clientHeight, scrollHeight } = this.refs.container;

        if (scrollTop + clientHeight >= scrollHeight) {
            if ((e.wheelDelta < 0 || e.detail > 0) && (this.state.pageIndex < this.state.pages.length - 1) && scrollTop + clientHeight >= scrollHeight) {
                this.go(this.state.pageIndex + 1)
                e.preventDefault()
            }
        } else
            if (scrollTop === 0) {
                if ((e.wheelDelta > 0 || e.detail < 0) && (this.state.pageIndex > 0) && scrollTop === 0) {
                    this.go(this.state.pageIndex - 1)
                    e.preventDefault()
                }
            }
    }
}