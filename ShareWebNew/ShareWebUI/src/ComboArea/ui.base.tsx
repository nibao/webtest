import * as React from 'react';
import { last, uniq, filter, includes, noop } from 'lodash';
import { PureComponent } from '../decorators';
import { mapKeyCode } from '../../util/browser/browser';

@PureComponent
export default class ComboAreaBase extends React.Component<UI.ComboArea.Props, any> {
    static defaultProps = {
        value: [],

        readOnly: false,

        uneditable: false,

        disabled: false,

        minHeight: 50,

        maxHeight: 100,

        onChange: noop,

        placeholder: '',

        spliter: [],

        formatter: val => val,

        validator: _val => true
    }

    state = {
        value: this.props.value || []
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.state.value) {
            this.setState({ value: nextProps.value });
        }
    }

    private triggerChange = () => {
        this.props.onChange(this.state.value);
    }

    private addChip(chips) {
        this.setState({
            value: uniq(this.state.value.concat(chips))
        }, this.triggerChange)
    }

    protected removeChip(chip) {
        this.setState({
            value: filter(this.state.value, o => o !== chip)
        }, this.triggerChange);
    }

    protected focusInput() {
        this.refs.input && this.refs.input.focus();
    }

    protected pasteHandler(e) {
        setTimeout(() => {
            this.batchAddChips();
        })
    }

    /**
     * 批量添加Chips
     */
    private batchAddChips() {
        const input = this.refs.input.value();
        const chips = input.split(new RegExp(this.props.spliter.join('|')))
            .filter(chip => this.props.validator(chip, this.state.value));

        this.addChip(chips);
        this.clearInput();
    }

    /**
     * 验证输入值并添加
     * @param value 输入值
     */
    protected validateInput(value: string): void {
        if (this.props.validator(value, this.state.value)) {
            this.addChip(value);
            this.clearInput();
        }
    }

    protected blurHandler(e: React.FocusEvent<HTMLAnchorElement>) {
        this.validateInput(this.refs.input.state.value)
    }

    protected keyDownHandler(e) {
        const input = this.refs.input.state.value;

        // 增加Chip
        if (includes(this.props.spliter, mapKeyCode(e.keyCode)) || e.keyCode === 13) {

            this.validateInput(input)

            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

        }
        // 删除输入或Chip
        else if (e.keyCode === 8) {
            if (!input) {
                if (this.state.value.length) {
                    this.removeChip(last(this.state.value));
                }
            }
        }
    }

    private clearInput() {
        this.refs.input.clear();
    }
}