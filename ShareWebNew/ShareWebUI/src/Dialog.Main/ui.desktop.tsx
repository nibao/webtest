import * as React from 'react';
import * as styles from './styles.desktop.css';

const DialogMain: UI.DialogMain.StatelessComponent = function DialogMain({ children }) {
    return (
        <div className={ styles['container'] } role="drag-area">
            <div className={ styles['padding'] }>
                {
                    children
                }
            </div>
        </div>
    )
}

export default DialogMain;