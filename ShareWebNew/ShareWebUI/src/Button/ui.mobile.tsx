import * as React from 'react';
import { noop } from 'lodash';
import * as classnames from 'classnames';
import * as styles from './styles.mobile.css';

const Button: React.StatelessComponent<UI.Button.Props> = function Button({
    type = 'button',
    disabled = false,
    minWidth,
    className,
    onClick = noop,
    onMouseDown = noop,
    children
}) {
    return (
        <button
            type={type}
            style={{ minWidth }}
            disabled={disabled}
            className={classnames(styles.button, className)}
            onClick={() => !disabled && onClick()}
            onMouseDown={onMouseDown}
        >
            {children}
        </button>
    )
}

export default Button