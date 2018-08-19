import * as React from 'react';
import { noop, isBoolean } from 'lodash';
import { PureComponent } from '../decorators';

export enum KeyDown {
    NONE,       // 没有按下或者按下的键非向上键、非向下键

    DOWNARROW,  // 按下向下键

    UPARROW,    // 按下向上键
}

enum Status {
    PENDING, // 无操作

    FETCHING, // 正在搜索
}

@PureComponent
export default class AutoCompleteBase extends React.Component<UI.AutoComplete.Props, UI.AutoComplete.State> {
    static Status = Status;

    static defaultProps = {
        disabled: false,

        value: '',

        validator: (_value) => true,

        autoFocus: false,

        placeholder: '',

        missingMessage: '',

        loader: noop,

        onLoad: noop,

        onFetch: noop,

        onChange: noop,

        onEnter: noop,

        onFocus: noop,

        onBlur: noop,

        onKeyDown: noop,
    }

    state = {
        value: this.props.value,

        active: false,

        status: Status.PENDING,

        selectIndex: -1,

        keyDown: KeyDown.NONE
    };

    keepActive = false;

    searchBox: HTMLInputElement | null;

    componentWillReceiveProps({ value }) {
        if (value !== this.props.value && value !== this.state.value) {
            this.setState({ value })
        }
        this.setState({
            selectIndex: -1,
            keyDown: KeyDown.NONE
        })
    }

    public toggleActive(active) {
        this.setState({
            active
        });

        if (!active) {
            this.setState({
                selectIndex: -1
            })
        }
    }

    protected preventHideResults() {
        this.keepActive = true;
    }

    protected handleFetch(value, process) {
        this.setState({ value, status: Status.FETCHING });
        this.fireFetchEvent(value, process);
    }

    protected handleLoad(results) {
        this.toggleActive(true);
        this.setState({ status: Status.PENDING });
        this.fireLoadEvent(results);
    }

    protected handleBlur(event) {
        if (this.keepActive) {
            event.target.focus();
        } else {
            this.toggleActive(false)
        }

        this.keepActive = false;

        this.fireBlurEvent(event);
    }

    private fireLoadEvent(results) {
        this.props.onLoad(results)
    }

    private fireFetchEvent(key, process) {
        this.props.onFetch(key, process);
    }

    protected fireChangeEvent(key) {
        this.props.onChange(key)
    }

    protected fireBlurEvent(event) {
        this.props.onBlur(event)
    }

    /**
     * 键盘事件处理
     */
    handleKeyDown(e) {
        switch (e.keyCode) {
            case 38: {
                // 向上
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                this.setState({
                    keyDown: KeyDown.UPARROW
                })
                break
            }
            case 40: {
                // 向下
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                this.setState({
                    keyDown: KeyDown.DOWNARROW
                })
                break
            }
            default: {
                this.setState({
                    keyDown: KeyDown.NONE
                })
            }
        }

        this.props.onKeyDown(e)
    }



    /**
     * 输入框enter事件
     */
    handleEnter(e) {
        this.props.onEnter(e, this.state.selectIndex)
    }

    /**
     * 选中项发生变化
     */
    handleSelectionChange(selectIndex: number) {
        this.setState({
            selectIndex,
            keyDown: KeyDown.NONE
        })
    }

    /**
     * 清空输入框的值
     */
    public clearInput() {
        this.searchBox.clearInput()
    }
}