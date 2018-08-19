import * as React from 'react';
import * as classnames from 'classnames';
import MenuItem from '../Menu.Item/ui.mobile';
import * as styles from './styles.mobile.css';

const Menu: UI.Menu.Component = function Menu({ width, maxHeight, children }) {
    return (
        <div
            className={ classnames(styles['menu'], { [styles['box-sizing-border-box']]: !!width }) }
            style={ { width, maxHeight } }
        >
            {
                children
            }
        </div>
    )
} as UI.Menu.Component

Menu.Item = MenuItem;

export default Menu