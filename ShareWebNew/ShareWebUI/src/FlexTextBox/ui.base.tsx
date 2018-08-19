/// <reference path="./index.d.ts" />

import * as React from 'react';
import { noop, isFunction } from 'lodash';

export default class FlexTextBoxBase extends React.Component<UI.FlexTextBox.Props, UI.FlexTextBox.State> {
    static defaultProps = {
        readOnly: false,

        disabled: false,

        onKeyDown: noop,

        onPaste: noop,

        placeholder: '',
    }

    state = {
        value: ''
    }

    textBox: HTMLAnchorElement | null;

    componentWillMount() {
        this.setState({
            placeholder: this.props.placeholder
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            placeholder: nextProps.placeholder
        })
    }

    keyDownHandler(e) {
        // setTimeout之后事件对象的基本信息会丢失，因此需要把副本保存下来
        const evt = { ...e }

        e.keyCode === 13 && e.preventDefault();

        if (e.keyCode === 8 && this.value().length === 1) {
            // 修复EDGE & IE下无法删除最后一个字符的问题
            this.value('')
        }

        this.setState({
            value: this.value()
        });

        setTimeout(() => {
            isFunction(this.props.onKeyDown) && this.props.onKeyDown(evt);
        });
    }

    pasteHandler(e) {
        isFunction(this.props.onPaste) && this.props.onPaste(e);
    }

    clear() {
        this.value('');
    }

    /**
     * 获取或设定输入框的值
     * @param [text] 设定值
     */
    public value(text?: string): string {
        if (text !== undefined) {
            this.setState({ value: text })

            return 'textContent' in this.textBox ?
                (this.textBox.textContent = text.trim()) :
                (this.textBox.innerText = text.trim());
        } else {
            return 'textContent' in this.textBox ?
                this.textBox.textContent :
                this.textBox.innerText;
        }
    }

    focus() {
        this.textBox && this.textBox.focus()
    }
}