import * as React from 'react';
import * as styles from './styles.mobile.css';

const DialogFooter: UI.DialogFooter.StatelessComponent = function DialogFooter({ children }) {
    return (
        <div className={ styles['footer'] }>
            {
                children
            }
        </div>
    )
}

export default DialogFooter;