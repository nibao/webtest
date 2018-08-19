import * as React from 'react'
import * as classnames from 'classnames'
import UIIcon from '../UIIcon/ui.desktop'
import * as styles from './styles.desktop.css'

const PopMenuItem: React.StatelessComponent<any> = function PopMenuItem({ labelClassName, icon, onDOMNodeMount, label, className, children, size = 13, ...otherProps }) {
    return (
        <li
            className={classnames(styles['item'], className, { [styles['padding']]: typeof icon === 'undefined' })}
            {...otherProps}
            ref={(ref) => typeof onDOMNodeMount === 'function' ? onDOMNodeMount(ref) : null}
        >
            {
                typeof icon !== 'undefined' ?
                    typeof icon === 'string' ?
                        <UIIcon code={icon} size={16} className={styles['icon']} /> :
                        icon :
                    null
            }
            {
                label ?
                    <span
                        className={classnames(styles['label'], labelClassName)}
                        style={{ fontSize: size }}>
                        {label}
                    </span> : null
            }
            {children}
        </li >
    )
}

export default PopMenuItem