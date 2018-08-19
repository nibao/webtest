import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash'
import UIIcon from '../UIIcon/ui.desktop';
import * as styles from './styles.desktop.css';

const PlainButton: React.StatelessComponent<UI.PlainButton.Props> = function PlainButton({
    type = 'button',
    disabled = false,
    icon,
    minWidth = 80,
    width,
    className,
    children,
    fallback,
    onClick = noop,
    size = 13,
    ...props
}) {
    return (
        <button
            className={
                classnames(
                    className,
                    styles['plainbutton'],
                    styles['box-sizing-border-box'],
                    {
                        [styles['disabled']]: disabled
                    }
                )
            }
            type={type}
            disabled={disabled}
            style={{ minWidth, width }}
            onClick={onClick}
            {...props}
        >
            {
                icon ?
                    <span className={styles['icon']}>
                        <UIIcon
                            size={size}
                            code={icon}
                            fallback={fallback}
                        />
                    </span> :
                    null
            }
            {
                children
            }
        </button>
    )
}

export default PlainButton