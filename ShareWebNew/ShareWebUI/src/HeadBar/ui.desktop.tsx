import * as React from 'react';
import * as classnames from 'classnames';
import * as styles from './styles.desktop';

export default function HeadBar({ children }) {
    return (
        <div>
            <div className={styles['title']}>
                {
                    children
                }
            </div>
            <div className={styles['line']}></div>
        </div>
    )
}