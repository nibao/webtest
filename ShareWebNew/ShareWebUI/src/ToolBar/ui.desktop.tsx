import * as React from 'react';
import ToolBarButton from '../ToolBar.Button/ui.desktop';
import * as styles from './styles.desktop.css';

const ToolBar: UI.ToolBar.Component = function ToolBar({ children }) {
    return (
        <div className={ styles['tool-bar'] }>
            {
                children
            }
        </div>
    )
} as UI.ToolBar.Component

ToolBar.Button = ToolBarButton;

export default ToolBar