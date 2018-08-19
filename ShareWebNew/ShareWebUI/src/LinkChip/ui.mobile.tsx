import * as React from 'react';
import * as classnames from 'classnames';
import LinkChipBase from './ui.base';
import * as styles from './styles.mobile.css';

export default class LinkChip extends LinkChipBase {
    render() {
        return (
            <a
                href="javascript:void(0)"
                className={classnames(styles.linkChip, this.props.className)}
                onClick={this.clickHandler.bind(this)}
                onTouchStart={this.touchStartHandler.bind(this)}
                onTouchEnd={this.touchEndHandler.bind(this)}
                disabled={this.props.disabled}
                >
                {
                    this.props.children
                }
            </a>
        )
    }
} 