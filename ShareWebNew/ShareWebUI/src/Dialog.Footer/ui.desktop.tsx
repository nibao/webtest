import * as React from 'react';
import * as styles from './styles.desktop.css';

const DialogFooter: UI.DialogFooter.StatelessComponent = function DialogFooter({ children }) {
    return (
        <div className={ styles['container'] }>
            <div className={ styles['padding'] } role="drag-area">
                {
                    children
                }
            </div>
        </div>
    )
}

export default DialogFooter;