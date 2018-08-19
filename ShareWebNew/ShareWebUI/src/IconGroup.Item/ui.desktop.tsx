import * as React from 'react'
import * as classnames from 'classnames'
import UIIcon from '../UIIcon/ui.desktop'
import * as styles from './styles.desktop.css'

const IconGroupItem: React.StatelessComponent<UI.IconGroupItem.Props> = function IconGroupItem({ className, code, disabled, ...otherProps }) {
    return (
        <UIIcon
            code={code}
            disabled={disabled}
            className={classnames(styles['icon'], { [styles['enabled']]: !disabled }, className)}
            {...otherProps}
        />
    )
}

export default IconGroupItem