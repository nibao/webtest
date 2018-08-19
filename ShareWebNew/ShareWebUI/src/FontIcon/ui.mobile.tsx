import * as React from 'react'
import * as classnames from 'classnames'
import { noop } from 'lodash';
import * as styles from './styles.mobile.css'

export default function FontIcon({ code, font, title, size, color, onClick, onMouseOver = noop, onMouseLeave = noop, disabled, className }: UI.FontIcon.Props) {
    return (
        <span
            className={classnames(styles['icon'], {
                [styles['link']]: onClick && typeof onClick === 'function',
                [styles['disabled']]: disabled
            }, className)}
            title={title}
            onClick={event => {
                !disabled && typeof onClick === 'function' && onClick(event);
            }}
            style={{ fontFamily: font, fontSize: size, color }}>{code}</span>
    )
}