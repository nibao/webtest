import * as React from 'react';
import * as styles from './styles.desktop'

const ErrorDialogTitle: React.StatelessComponent<any> = function ErrorDialog({
    children
}) {
    return (
        <div className={styles['title']}>
            {
                children
            }
        </div>
    )
}

export default ErrorDialogTitle