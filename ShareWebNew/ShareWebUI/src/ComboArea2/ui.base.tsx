import * as React from 'react';
import { last, uniq, filter, includes, noop } from 'lodash';
import { PureComponent } from '../decorators';
import { mapKeyCode, isBrowser, Browser } from '../../util/browser/browser';

@PureComponent
export default class ComboArea2Base extends React.Component<UI.ComboArea2.Props, any> {
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

        validator: val => true,


    }

    props: UI.ComboArea2.Props;

    state = {
        value: this.props.value || '',
        items: [],
        placeholder: this.props.placeholder
    }

    isIE = false;

    componentWillMount() {
        this.isIE = isBrowser({ app: Browser.MSIE });

        this.setState({
            placeholder: this.props.placeholder
        })
    }

    componentDidMount() {
        const { children } = this.props
        this.setState({
            items: React.Children.toArray(children)
        })
        this.setState({
            focus: true
        })
        this.refs.input && this.refs.input.focus();
    }

    componentWillReceiveProps({ children, value, placeholder }) {

        this.setState({
            items: React.Children.toArray(children)
        })

        if (value !== this.state.value) {
            this.setState({ value });
        }

        if (this.props.placeholder !== placeholder) {
            this.setState({
                placeholder: placeholder
            })
        }
    }


    protected focusInput() {
        this.refs.input && this.refs.input.focus();
        this.setState({
            focus: true,
            placeholder: this.isIE ? '' : this.props.placeholder
        })
    }

    protected blurInput() {
        this.setState({
            focus: false,
            placeholder: this.props.placeholder
        })
    }


    protected keyDownHandler(e) {
        const input = this.refs.input.state.value;
        // 增加Chip
        if (includes(this.props.spliter, mapKeyCode(e.keyCode)) || e.keyCode === 13) {

            // const chips = input.split(new RegExp(this.props.spliter.join('|')))
            //     .filter(chip => this.props.validator(chip));
            // this.props.addChip(chips);
            // this.clearInput();

            if (this.props.validator(input)) {
                this.props.addChip(input);
                this.clearInput();
            } else {
                this.clearInput();
            }

            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

        }
        // 删除输入或Chip
        else if (e.keyCode === 8) {
            if (!input) {
                this.props.removeChip(input);
            }
        }

        // 如果已经达到容量上限，禁止任何输入
        if (this.state.items.length >= 30) {
            this.clearInput();

        }
        this.props.onChange(this.refs.input.value());
    }

    clearInput() {
        this.refs.input.clear();
    }
}