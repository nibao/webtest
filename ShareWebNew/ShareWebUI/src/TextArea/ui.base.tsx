import * as React from 'react';
import { noop } from 'lodash';
import { PureComponent } from '../decorators';

@PureComponent
export default class TextAreaBase extends React.Component<UI.TextArea.Props, UI.TextArea.State> {
    static defaultProps = {

        validator: () => true,

        onChange: noop,

        onFocus: noop,

        onBlur: noop,
    }

    state = {
        value: '',

        focus: false,
    }

    componentWillMount() {
        this.updateValue(this.props.value)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.state.value) {
            this.updateValue(nextProps.value)
        }
    }

    updateValue(value) {
        this.setState({
            value
        })
    }

    changeHandler(event) {
        const value = event.target.value;

        if ((!this.props.required && value === '') || (this.props.validator && this.props.validator(value))) {
            this.updateValue(value);
            this.props.onChange && this.props.onChange(value);
        } else {
            event.preventDefault();
        }
    }


    focusHandler() {
        this.setState({ focus: true })
        this.props.onFocus && this.props.onFocus();
    }

    blurHandler() {
        this.setState({ focus: false })
        this.props.onBlur && this.props.onBlur();
    }
}