import * as React from 'react'
import * as classnames from 'classnames'
import Item from '../IconGroup.Item/ui.desktop'
import * as styles from './styles.desktop.css'

const IconGroup: React.StatelessComponent<UI.IconGroup.Props> = function IconGroup({ className, children, ...otherProps }) {
    return (
        <div className={classnames(styles['container'], className)} {...otherProps}>
            {children}
        </div>
    )
}

IconGroup.Item = Item

export default IconGroup