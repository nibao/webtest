import * as React from 'react';
import { find, noop } from 'lodash';
import { PureComponent } from '../decorators';

@PureComponent
export default class CascadeAreaSelectBase extends React.Component<any, any> {
    static defaultProps = {
        value: [],

        formatter: path => path,

        onSelect: noop
    }

    state = {
        active: false,

        value: this.props.value
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value && nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value })
        }
    }

    active() {
        this.setState({
            active: true
        })
    }

    deactive() {
        if (!this.KEEP_ACTIVE) {
            this.setState({
                active: false
            })
        }
    }

    /**
     * 切换选中状态
     */
    toggleActive() {
        this.setState({
            active: !this.state.active
        })
    }

    keepActive() {
        this.KEEP_ACTIVE = true;
    }

    /**
     * 格式化文本
     */
    formatText() {
        return this.props.formatter(this.state.value)
    }

    /**
     * 选中选项
     */
    handleSelect(value) {
        this.KEEP_ACTIVE = false;
        this.setState({ value });
        this.props.onSelect(value);

        if (React.Children.only(this.props.children).props.onlySelectLeaf) {
            this.deactive();
        } else {
            // 聚焦到文本框，避免下次点击空白处不触发onBlur事件
            // 推迟到文本框的onBlur之后再执行focus()
            setTimeout(() => {
                this.refs.select.focus();
            })
        }
    }
}