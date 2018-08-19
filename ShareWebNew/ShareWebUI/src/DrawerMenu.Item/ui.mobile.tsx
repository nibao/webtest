import * as React from 'react';
import { noop } from 'lodash';
import * as classnames from 'classnames';
import * as styles from './styles.mobile.css';


const DrawerMenuItem: React.StatelessComponent<UI.DrawerMenuItem.Props> = function DrawerMenuItem({
    className,
    children,
    ...otherProps
}) {
    return (
        <div
            className={classnames(styles['item'], className)}
            {...otherProps}
        >
            {children}
        </div>
    )
}


export default DrawerMenuItem