import * as React from 'react'

export default class PDFNavBase extends React.Component<any, any>{
    static defaultProps = {
        limit: 0,
        start: 1,
        end: 2,
        init: 1,
        step: 0.25
    }

    state = {
        zoom: this.props.init,
        input: 1
    }

    componentDidMount() {
        this.props.onZoom(this.state.zoom)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            input: nextProps.current + 1
        })
    }

    /**
     * 下一页
     */
    prevPage() {
        const current = this.props.current > 0 ? this.props.current - 1 : 0
        this.setState({
            input: current + 1
        }, () => this.props.onPageChange(current))
    }

    /**
     * 上一页
     */
    nextPage() {
        const current = this.props.current < this.props.limit - 1 ? this.props.current + 1 : this.props.limit - 1
        this.setState({
            input: current + 1
        }, () => this.props.onPageChange(current))
    }

    /**
     * 跳转页面
     */
    go(e) {
        if (this.state.input.toString().trim()) {
            this.props.onPageChange(this.state.input - 1)
        } else {
            this.setState({
                input: this.props.current + 1
            })
        }
        e.preventDefault()
    }

    /**
     * 缩小
     */
    zoomOut() {
        const { start, step } = this.props
        let zoom = this.state.zoom <= start ? start : this.state.zoom - step
        if (zoom !== this.state.zoom) {
            this.setState({
                zoom
            }, () => this.props.onZoom(this.state.zoom))
        }
    }

    /**
     * 放大
     */
    zoomIn() {
        const { end, step } = this.props
        let zoom = this.state.zoom >= end ? end : this.state.zoom + step
        if (zoom !== this.state.zoom) {
            this.setState({
                zoom
            }, () => this.props.onZoom(this.state.zoom))
        }
    }

    /**
     * 跳转页码处理
     */
    changeHandler(e) {
        const value = parseInt(e.target.value)
        if (value > this.props.limit) {
            this.setState({
                input: this.state.input
            })
        } else if (value > 0 && value <= this.props.limit) {
            this.setState({
                input: value
            })
        } else {
            this.setState({
                input: ' '
            })
        }
    }
}