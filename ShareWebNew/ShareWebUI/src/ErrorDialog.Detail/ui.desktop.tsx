import * as React from 'react';
import * as styles from './styles.desktop'

const ErrorDialogDetail: React.StatelessComponent<any> = function ErrorDialog({
    children
}) {
    return (
        <div className={styles['detail']}>
            {
                children
            }
        </div>
    )
}

export default ErrorDialogDetail