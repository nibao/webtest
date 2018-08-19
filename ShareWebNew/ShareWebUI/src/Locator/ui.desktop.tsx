import * as React from 'react';
import * as classnames from 'classnames';
import LocatorBase from './ui.base';
import * as styles from './styles.desktop.css';

export default class Locator extends LocatorBase {
    render() {
        return (
            <div
                className={classnames(styles['locator'], this.props.className)}
                ref={el => this.el = el}
            >
                {
                    this.props.children
                }
            </div>
        )
    }
}