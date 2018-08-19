import * as React from 'react';
import { noop } from 'lodash';
import { PureComponent } from '../decorators';

@PureComponent
export default class TextInputBase extends React.Component<UI.TextInput.Props, any> {

    static readonly defaultProps = {
        type: 'text',

        autoFocus: false,

        selectOnFocus: false,

        validator: () => true,

        onChange: noop,

        onFocus: noop,

        onBlur: noop,

        onClick: noop,

        onKeyDown: noop,

        onEnter: noop,
    }

    state: UI.TextInput.State = {
        value: this.props.value
    }

    input: HTMLInputElement;

    componentDidMount() {
        if (this.props.autoFocus) {
            this.focus()
        }
    }

    componentWillReceiveProps({ value }) {
        if (value !== this.state.value) {
            this.updateValue(value)
        }
    }

    /**
     * 输入框聚焦
     */
    private focus() {
        const { selectOnFocus } = this.props
        this.input.focus();
        if (selectOnFocus) {
            this.input.select()
            if (Array.isArray(selectOnFocus)) {
                this.input.selectionStart = selectOnFocus[0]
                this.input.selectionEnd = selectOnFocus[1] || this.input.value.length
            }
        }
    }

    /** 
     * 更新值
     */
    private updateValue(value, callback) {
        this.setState({
            value
        }, callback);
    }

    /**
     * 处理输入
     */
    protected changeHandler(e) {
        const value = e.target.value;

        if ((!this.props.required && value === '') || this.props.validator(value)) {
            this.updateValue(value, () => this.props.onChange(value));
        } else {
            e.preventDefault()
        }
    }

    /**
     * 处理聚焦
     */
    protected focusHandler(e) {
        this.props.onFocus(e);
    }

    /**
     * 处理失去焦点
     */
    protected blurHandler(e) {
        this.props.onBlur(e);
    }

    /**
     * 处理点击
     */
    protected clickHandler(e) {
        this.props.onClick(e);
        e.stopPropagation()
    }

    /**
     * 处理键盘按下
     */
    protected keyDownHandler(e) {
        if (e.keyCode === 13) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            this.props.onEnter(e);
        }

        this.props.onKeyDown(e)
    }

    /**
     * 处理悬浮
     * @param e 
     */
    protected mouseoverHandler(e) {
        this.props.onMouseover && this.props.onMouseover(e);

    }


    /**
     * 处理移除悬浮
     * @param e 
     */
    protected mouseoutHandler(e) {
        this.props.onMouseout && this.props.onMouseout(e);
    }
}