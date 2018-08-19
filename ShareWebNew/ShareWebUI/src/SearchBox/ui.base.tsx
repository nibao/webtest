import * as React from 'react';
import { noop, isFunction } from 'lodash';
import { PureComponent } from '../decorators';

@PureComponent
export default class SearchBoxBase extends React.Component<UI.SearchBox.Props, UI.SearchBox.State> {
    static defaultProps = {
        disabled: false,

        value: '',

        validator: (_value) => true,

        autoFocus: false,

        icon: '\uf01e',

        loader: noop,

        onFetch: noop,

        onLoad: noop,

        onFocus: noop,

        onBlur: noop,

        onChange: noop,

        onEnter: noop,

        onClick: noop,

        onKeyDown: noop,
    }

    state: UI.SearchBox.State = {
        value: this.props.value
    }

    /*
     * 延迟触发搜索的定时器
     */
    timeout: number | null = null;

    /*
     * 正在执行的搜索
     */
    process: Promise<any> | null = null;

    componentWillReceiveProps({ value }) {
        // 外部改变关键字时不触发搜索，防止AutoComplete
        if (value !== this.props.value && value !== this.state.value) {
            this.updateValue(value);
        }
    }

    /**
     * 触发搜索
     * @param input 值
     */
    public load(input: string): void {
        this.refs.searchInput.load(input)
    }

    /**
     * 输入发生变化时触发
     * @param value 文本值
     */
    protected handleChange(value: string): void {
        this.updateValue(value);
    }

    /**
     * 设置聚焦状态
     */
    protected focus(event): void {
        this.setState({ focus: true });
        isFunction(this.props.onFocus) && this.props.onFocus(event);
    }

    /**
     * 设置失焦状态
     */
    protected blur(event): void {
        this.setState({ focus: false });
        isFunction(this.props.onBlur) && this.props.onBlur(event);
    }

    /**
     * 清空值
     */
    protected clearInput(): void {
        this.updateValue('');
        this.load('');
    }

    /**
     * 更新值并触发onChange事件
     * @param value 值
     */
    protected updateValue(value: string): void {
        this.setState({
            value
        }, () => this.fireChangeEvent(value));
    }

    /**
     * 触发文本框变化事件
     * @param key 文本框输入值
     */
    private fireChangeEvent(key: string): void {
        isFunction(this.props.onChange) && this.props.onChange(key);
    }

    /**
     * 清空输入框的值
     */
    public clearInput() {
        this.refs.searchInput.clearInput()
    }
}