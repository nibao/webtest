import * as React from 'react';
import * as classnames from 'classnames';
import FlexTextBoxBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class FlexTextBox extends FlexTextBoxBase {
    render() {
        return (
            <div
                ref={node => this.textBox = node}
                className={classnames(
                    styles['textbox'],
                    {
                        [styles['placeholder']]: this.state.placeholder !== '',
                        [styles['disabled']]: this.props.disabled
                    },
                    this.props.className,
                )}
                placeholder={this.state.placeholder}
                onKeyDown={this.keyDownHandler.bind(this)}
                onPaste={this.pasteHandler.bind(this)}
                onBlur={this.props.onBlur}
                contentEditable={!this.props.disabled}
            />
        )
    }
}