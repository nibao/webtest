import * as React from 'react';
import UIIcon from '../UIIcon/ui.mobile'
import RadioBoxBase from './ui.base';
import * as styles from './styles.mobile.css';

export default class RadioBox extends RadioBoxBase {
    render() {
        return (
            <label className={styles.radio}>
                <UIIcon
                    code={this.state.checked ? '\uf0cd' : '\uf07B'}
                    color={this.props.disabled ? '#ddd' : (this.state.checked ? '#0075ed' : '#aaa')}
                    size={20}
                />
                <input
                    type="radio"
                    // className={styles.radio}
                    style={{ display: 'none' }}
                    name={this.props.name}
                    value={this.props.value}
                    disabled={this.props.disabled}
                    defaultChecked={this.state.checked}
                    onChange={this.changeHandler.bind(this)}
                    checked={this.state.checked}
                />
            </label>
        )
    }
}