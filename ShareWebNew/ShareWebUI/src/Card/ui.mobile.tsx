import * as React from 'react'
import * as classnames from 'classnames'
import Text from '../Text/ui.desktop'
import * as styles from './styles.mobile'

const Card: React.StatelessComponent<UI.Card.Props> = function Card({
    children,
    className
}) {
    return (
        <div className={classnames(styles['card'], className)}>
            {
                children
            }
        </div>
    )
}

export default Card