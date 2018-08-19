import * as React from 'react'
import * as classnames from 'classnames'
import PopOver from '../PopOver/ui.desktop'
import Item from '../PopMenu.Item/ui.desktop'
import * as styles from './styles.desktop.css'

const PopMenu: React.StatelessComponent<UI.PopMenu.Props> = function PopMenu({ children, className, ...otherProps }) {
    return (
        <PopOver {...otherProps}>
            <ul className={classnames(styles['list'], className)}>
                {children}
            </ul>
        </PopOver>
    )
}

PopMenu.Item = Item

export default PopMenu