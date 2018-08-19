import * as React from 'react';
import * as styles from './styles.desktop.css';

const PanelMain: UI.PanelMain.Component = function PanelMain({ children }) {
    return (
        <div className={ styles['container'] }>
            <div className={ styles['padding'] }>
                {
                    children
                }
            </div>
        </div>
    )
}

export default PanelMain;