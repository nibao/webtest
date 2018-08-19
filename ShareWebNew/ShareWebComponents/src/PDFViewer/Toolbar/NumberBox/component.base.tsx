import * as React from 'react';
import { noop, isNaN } from 'lodash';
import { bindEvent, unbindEvent } from '../../../../util/browser/browser'

export default class NumberBoxBase extends React.Component<Components.PDFViewer.Toolbar.NumberBox.Props, any>{
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        onEnter: noop,
        current: 1,
        total: 1
    }
    state: Components.PDFViewer.Toolbar.NumberBox.State = {
        onFocus: false,
        value: 1
    }
    preValue = 1

    componentWillReceiveProps(nextProps) {
        if (nextProps.current !== this.props.current) {
            this.setState({
                value: nextProps.current
            })
        }
    }

    handleBlur() {
        this.handleEnter();
    }

    handleEdit() {
        this.preValue = this.state.value;
        this.setState({
            onFocus: true
        }, function () {
            bindEvent(this.refs.input.input, 'keydown', this.handleKeyDown)
        })

    }

    handleKeyDown = (e) => {
        const keynum = window.event ? e.keyCode : e.which;
        const { value } = this.state;

        if (value && value.toString().trim()) {
            if (keynum === 38) {
                this.handleChange(parseInt(value) + 1);
                e.preventDefault();
                e.stopPropagation();
            } else if (keynum === 40) {
                this.handleChange(parseInt(value) - 1);
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }

    handleEnter = () => {
        if (this.state.value > this.props.total) {
            this.setState({
                value: this.preValue
            })
        }
        unbindEvent(this.refs.input.input, 'keydown', this.handleKeyDown);
        this.setState({
            onFocus: false
        })
        if (this.state.value.toString().trim()) {
            this.props.onEnter(parseInt(this.state.value))
        } else {
            this.setState({
                value: this.props.current
            })
        }
    }

    /**
     * 跳转页码处理
     */
    handleChange(value) {
        if (/^[1-9]\d*$/.test(value)) {
            this.setState({
                value
            })
        } else {
            this.setState({
                value: isNaN(parseInt(value)) ? '' : parseInt(value)
            })
        }
    }
}