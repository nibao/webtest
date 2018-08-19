import * as React from 'react'
import * as classnames from 'classnames'
import UIIcon from '../UIIcon/ui.mobile'
import * as styles from './styles.mobile.css'

const PopMenuItem: React.StatelessComponent<any> = function PopMenuItem({ icon, label, className, children, ...otherProps }) {
    return (
        <li className={classnames(styles['item'], className)} {...otherProps}>
            {
                typeof icon !== undefined ?
                    typeof icon === 'string' ?
                        <UIIcon code={icon} size={16} className={styles['icon']} /> :
                        icon :
                    null
            }
            {
                label ?
                    <span className={styles['label']}>
                        {label}
                    </span> : null
            }
            {children}
        </li>
    )
}

export default PopMenuItem