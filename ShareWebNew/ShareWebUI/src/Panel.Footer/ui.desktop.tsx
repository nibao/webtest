import * as React from 'react';
import * as styles from './styles.desktop.css';

const PanelFooter: UI.PanelFooter.Component = function PanelFooter({ children }) {
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

export default PanelFooter;