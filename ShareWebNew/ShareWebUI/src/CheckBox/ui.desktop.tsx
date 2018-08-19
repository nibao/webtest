import * as React from 'react';
import * as classnames from 'classnames';
import CheckBoxBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class CheckBox extends CheckBoxBase {
    render() {
        return (
            <input
                type="checkbox"
                id={this.props.id}
                className={classnames(styles.checkbox, this.props.className)}
                checked={this.state.checked}
                disabled={this.props.disabled}
                onChange={this.changeHandler.bind(this)}
                onClick={this.handleClick.bind(this)}
                ref={checkbox => this.checkbox = checkbox}
            />
        )
    }
}