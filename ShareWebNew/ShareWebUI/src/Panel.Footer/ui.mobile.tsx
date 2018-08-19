import * as React from 'react';
import * as styles from './styles.mobile.css';

const PanelFooter: UI.PanelFooter.Component = function PanelFooter({ children }) {
    return (
        <div className={ styles['footer'] }>
            {
                children
            }
        </div>
    )
}

export default PanelFooter;