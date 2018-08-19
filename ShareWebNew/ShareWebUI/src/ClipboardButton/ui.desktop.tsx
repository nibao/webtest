import * as React from 'react';
import * as classnames from 'classnames';
import ClipboardButtonBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class ClipboardButton extends ClipboardButtonBase {
    render() {
        return (
            <button
                type="button"
                className={classnames(styles['clipboard-button'], this.props.className)}
                ref={this.initClipboard}
            >
                {
                    this.props.children
                }
            </button>
        )
    }
}