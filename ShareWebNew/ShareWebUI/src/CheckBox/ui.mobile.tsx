import * as React from 'react';
import CheckBoxBase from './ui.base';
import UIIcon from '../UIIcon/ui.mobile'
import * as styles from './styles.mobile.css';

export default class CheckBox extends CheckBoxBase {
    render() {
        return (
            <span className={styles.checkbox}>
                <UIIcon
                    code={this.state.checked ? '\uf063' : '\uf07B'}
                    color={this.props.disabled ? '#ddd' : (this.state.checked ? '#0075ed' : '#aaa')}
                    size={20}
                />
                <input
                    id={this.props.id}
                    style={{ display: 'none' }}
                    type="checkbox"
                    checked={this.state.checked}
                    disabled={this.props.disabled}
                    ref={checkbox => this.checkbox = checkbox}
                    onChange={this.changeHandler.bind(this)}
                    onClick={this.handleClick.bind(this)}
                />
            </span>
        )
    }
}