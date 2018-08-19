import * as React from 'react';
import { noop, trim, isBoolean, isFunction } from 'lodash';
import { promisify } from '../../util/accessor/accessor';
import { PureComponent } from '../decorators';

@PureComponent
export default class SearchInputBase extends React.Component<UI.SearchInput.Props, UI.SearchInput.State> {
    static defaultProps = {
        disabled: false,

        validator: (_value) => true,

        autoFocus: false,

        loader: noop,

        onFetch: noop,

        onLoad: noop,

        onClick: noop,

        onFocus: noop,

        onBlur: noop,

        onChange: noop,

        onKeyDown: noop,

        onEnter: noop,
    }

    state = {
        value: this.props.value
    }

    refs: {
        searchInput: HTMLInputElement;
    }

    // 延迟触发搜索的定时器
    timeout: number | null = null;

    // 正在执行的搜索
    process: Promise<any> | null = null;

    componentWillReceiveProps({ value, focus }) {
        // 外部改变关键字时不触发搜索，防止AutoComplete
        if (value !== this.props.value && value !== this.state.value) {
            this.setState({ value }, () => this.fireChangeEvent(value));
        }

        if (isBoolean(focus) && focus !== this.state.focus) {
            if (focus) {
                this.refs.searchInput.focus();
            } else {
                this.refs.searchInput.blur();
            }
        }
    }

    /**
     * 文本框变化触发搜索
     * @param key 关键字
     */
    protected handleChange(value: string): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        // 延迟 执行搜索
        this.timeout = setTimeout(() => {
            if (this.process) {
                try {
                    // 如果实现了abort方法则尝试调用
                    this.process.abort();
                } catch (ex) {
                    void (0);
                }

                this.process = null;
            }

            this.load(value);
        }, 300);

        this.setState({ value }, () => this.fireChangeEvent(value));
    }

    /**
     * 触发搜索
     * @param key 输入值
     */
    public async load(input: string): Promise<any> {
        let key = trim(input);

        if (this.props.loader) {
            const process = this.props.loader(key);

            this.process = process;
            this.fireFetchEvent(input, process);

            const result = await promisify(process);
            this.fireLoadEvent(result);
        }
    }

    /**
     * 触发点击搜索
     * @param ref 文本框对象
     */
    protected handleClick(event: MouseEvent): void {
        if (!this.props.disabled) {
            this.triggerLoad(event.target.value);
            isFunction(this.props.onClick) && this.props.onClick(event)
        }
    }

    /**
     * 触发搜索
     * @param key 检索关键字
     */
    private triggerLoad(key) {
        const trimedKey = trim(key);

        if (trimedKey) {
            this.load(key);
        }
    }

    /**
     * 触发聚焦事件
     * @param ref 文本框对象
     */
    protected handleFocus(event: FocusEvent): void {
        if (!this.props.disabled) {
            isFunction(this.props.onFocus) && this.props.onFocus(event);
        }
    }

    /**
     * 触发失去焦点事件
     * @param ref 文本框对象
     */
    protected handleBlur(event: FocusEvent): void {
        if (!this.props.disabled) {
            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            isFunction(this.props.onBlur) && this.props.onBlur(event);
        }
    }

    /**
     * 触发文本框变化事件
     * @param key 文本框输入值
     */
    private fireChangeEvent(key: string) {
        isFunction(this.props.onChange) && this.props.onChange(key);
    }


    /**
     * 触发搜索进程
     * @param process 搜索进程
     */
    private fireFetchEvent(key: string, process: Promise<any>) {
        isFunction(this.props.onFetch) && this.props.onFetch(key, process);
    }

    /**
     * 触发load事件
     * @param result 搜索结果
     */
    private fireLoadEvent(result: any): void {
        isFunction(this.props.onLoad) && this.props.onLoad(result);
    }

    /**
     * 清空输入框的值
     */
    public clearInput() {
        this.handleChange('')
    }
}