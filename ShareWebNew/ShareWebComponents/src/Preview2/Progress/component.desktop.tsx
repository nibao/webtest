import * as React from 'react';
import * as classnames from 'classnames';
import * as styles from './styles.desktop.css';

export default function Progress({ loaded, total, detail = false, className = undefined }) {
    return (
        loaded < total ? (
            <div
                className={classnames(styles['container'], className)}
            >
                <div
                    className={styles['bar']}
                    style={{ width: `${(loaded / total).toFixed(2) * 100}%` }}
                ></div>
                {
                    detail ? (
                        <div className={styles['detail']}>
                            {(loaded / total * 100).toFixed(2)}%
                        </div>
                    ) : null
                }
            </div>
        ) : <div></div>

    )
}