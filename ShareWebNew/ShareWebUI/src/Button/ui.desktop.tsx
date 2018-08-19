import * as React from 'react';
import { noop } from 'lodash';
import * as classnames from 'classnames';
import UIIcon from '../UIIcon/ui.desktop';
import * as styles from './styles.desktop.css';

const Button: React.StatelessComponent<UI.Button.Props> = function Button({
    type = 'button',
    disabled = false,
    theme = 'regular',
    icon,
    minWidth,
    width,
    className,
    onClick = noop,
    onMouseDown = noop,
    children,
    fallback,
    size = 13,
    ...otherProps
}) {
    return (
        <button
            type={type}
            style={{ minWidth, width }}
            disabled={disabled}
            className={
                classnames(
                    styles['button'],
                    styles[theme],
                    className,
                    {
                        [styles['disabled']]: disabled
                    }
                )
            }
            onClick={event => !disabled && onClick(event)}
            onMouseDown={onMouseDown}
            {...otherProps}
        >
            {
                icon ?
                    <span className={styles['icon']} >
                        <UIIcon
                            size={size}
                            code={icon}
                            fallback={fallback}
                            color={theme === 'dark' ? '#fff' : '#757575'}
                        />
                    </span > :
                    null
            }
            <span>
                {
                    children
                }
            </span>
        </button >
    )
}

export default Button