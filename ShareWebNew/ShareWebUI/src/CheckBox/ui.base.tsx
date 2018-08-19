import * as React from 'react';
import { isBoolean, noop } from 'lodash';
import { findDOMNode } from 'react-dom';
import { PureComponent } from '../decorators';

@PureComponent
export default class CheckBoxBase extends React.Component<UI.CheckBox.Props, any> {
    static defaultProps = {
        onChange: noop,

        onCheck: noop,

        onUncheck: noop,

        onClick: noop,

        halfChecked: false,
    }

    state: UI.CheckBox.State = {
        checked: this.props.checked
    }

    checkbox = null;

    componentWillReceiveProps(nextProps) {
        if (isBoolean(nextProps.checked) && nextProps.checked !== this.state.checked) {
            this.setState({
                checked: nextProps.checked
            })
            this.checkbox.indeterminate = false;
        }
        if (nextProps.halfChecked) {
            this.checkbox.indeterminate = true;
        } else {
            this.checkbox.indeterminate = false;
        }
    }

    protected changeHandler(event: Event) {
        if (!this.props.disabled) {
            const checked = event.target.checked;

            if (checked) {
                this.props.onCheck(this.props.value);
            } else {
                this.props.onUncheck(this.props.value);
            }

            this.props.onChange(checked, this.props.value);

            this.setState({
                checked
            })
        }
    }

    protected handleClick(event: MouseEvent) {
        if (!this.props.disabled) {
            this.props.onClick(event);
        }
    }
}