import * as React from 'react';
import * as classnames from 'classnames'
import LinkButtonBase from './ui.base';
import * as styles from './styles.mobile.css';

export default class LinkButton extends LinkButtonBase {
    render() {
        return (
            <a
                ref="linkButton"
                href="javascript:void(0);"
                draggable={false}
                className={classnames(styles['link-button'], { [styles['disabled']]: this.props.disabled }, this.props.className)}
                onClick={this.handleClick.bind(this)}
            >
                {
                    this.props.children
                }
            </a>
        )
    }
}