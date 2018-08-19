import * as React from 'react';
import * as classnames from 'classnames';
import StackBase from './ui.base';
import * as styles from './styles.mobile.css';
export default class Stack extends StackBase {
    render() {
        const { background, className, children } = this.props;
        let { rate } = this.props;

        if (rate > 1) {
            rate = 1;
        }
        if (rate < 0) {
            rate = 0;
        }
        return (
            <span
                ref="stack"
                className={classnames(styles.item, className)}
                style={{ backgroundColor: background, width: rate * 100 + '%' }}>
                {children}
            </span>
        );
    }

}
