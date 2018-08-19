import * as React from 'react';
import * as classnames from 'classnames';
import LinkChipBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class LinkChip extends LinkChipBase {
    render() {
        return (
            <a
                href="javascript:void(0)"
                className={classnames(styles.linkChip, this.props.className)}
                onClick={this.clickHandler.bind(this)}
                disabled={this.props.disabled}
                title={this.props.title}
                onDoubleClick={this.doubleClickHandler.bind(this)}
            >
                {
                    this.props.children
                }
            </a>
        )
    }
} 