import * as React from 'react';
import { noop } from 'lodash';
import * as classnames from 'classnames';
import Button from '../Button/ui.mobile';
import * as styles from './styles.mobile.css';

const DrawerMenuButton: React.StatelessComponent<UI.DrawerMenuButton.Props> = function DrawerMenuButton({
    className,
    type = 'cancel',
    onClick = noop,
    children,
    ...otherProps
}) {
    return (
        <Button
            className={classnames(styles['item'], { [styles['cancelButton']]: type === 'cancel', [styles['confirmButton']]: type === 'confirm' }, className)}
            onClick={onClick}
            {...otherProps}
        >
            {children}
        </Button>
    )
}

export default DrawerMenuButton