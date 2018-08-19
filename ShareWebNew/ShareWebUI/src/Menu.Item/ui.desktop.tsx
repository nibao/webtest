import * as React from 'react';
import * as styles from './styles.desktop.css';

const MenuItem: UI.MenuItem.Component = function MenuItem({ children, onClick }) {
    return (
        <div
            className={ styles['container'] }
            onClick={ onClick }
        >
            { children }
        </div>
    )
}

export default MenuItem;