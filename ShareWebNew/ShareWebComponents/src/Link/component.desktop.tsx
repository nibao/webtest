import * as React from 'react';
import LinkBase from './component.base';
import * as styles from './style.desktop.css';

export default class Link extends LinkBase {
    render() {
        return (
            <div className={styles.container}>
                {
                    this.props.children
                }
            </div>
        )
    }
}