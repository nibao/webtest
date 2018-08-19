import * as React from 'react'
import * as classnames from 'classnames'
import { last, noop } from 'lodash'
import * as styles from './styles.mobile.css'

const ToolButtons: React.StatelessComponent<Components.DocSelector2.ToolButtons.Props> = function ({
    className,
    crumbs = [],
    description = '',
    onConfirm = noop
}) {
    const currentDir = last(crumbs)
    const disabled = !(currentDir)

    return (
        <div className={classnames(styles['tool-buttons'], className)}>
            <div
                className={classnames(
                    styles['item'],
                    disabled ? styles['disabled'] : styles['enabled']
                )}
                onClick={disabled ? noop : () => onConfirm(currentDir)}
            >
                {description}
            </div>
        </div>
    )
}

export default ToolButtons