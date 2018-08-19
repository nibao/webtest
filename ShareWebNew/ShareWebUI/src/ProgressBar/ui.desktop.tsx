/// <reference path="./index.d.ts" />

import * as React from 'react';
import * as styles from './styles.desktop.css';

const ProgressBar: React.StatelessComponent<UI.ProgressBar.Props> = function ProgressBar({ width = '100%', value, renderValue = (value) => `${(value * 100).toFixed(0)}%` }) {
    return (
        <div
            className={styles['progressbar']}
            style={{ width }}
        >
            <div className={styles['text']}>
                {
                    renderValue(value)
                }
            </div>
            <div style={{ width: `${value * 100}%` }} className={styles['percentage']}>
            </div>
        </div>
    )
}

export default ProgressBar