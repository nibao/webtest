import * as React from 'react';
import * as classnames from 'classnames';
import TextInputBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class TextInput extends TextInputBase {
    render() {
        return (
            <input
                ref={input => this.input = input}
                id={this.props.id}
                className={classnames(styles['input'], this.props.className)}
                style={this.props.style}
                autoComplete="off"
                type={this.props.type}
                value={this.state.value}
                placeholder={this.props.placeholder}
                readOnly={this.props.readOnly}
                disabled={this.props.disabled}
                onChange={this.changeHandler.bind(this)}
                onFocus={this.focusHandler.bind(this)}
                onBlur={this.blurHandler.bind(this)}
                onClick={this.clickHandler.bind(this)}
                onKeyDown={this.keyDownHandler.bind(this)}
                onMouseOver={this.mouseoverHandler.bind(this)}
                onMouseOut={this.mouseoutHandler.bind(this)}
            />
        )
    }
}