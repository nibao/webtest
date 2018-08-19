import * as React from 'react'
import * as classnames from 'classnames'
import { noop } from 'lodash'
import __ from './locale'
import * as styles from './styles.mobile'

const ToolButton: React.StatelessComponent<Components.VisitorAdder.ToolButton.Props> = function ToolButton({
    className,
    selectNums = 0,
    onCancel = noop,
    onConfirm
}) {
    return (
        <div className={classnames(styles['tool'], className)}>
            <div
                className={styles['cancel-btn']}
                onClick={onCancel}
            >
                {__('取消')}
            </div>
            <div
                className={classnames(styles['confirm-btn'], !onConfirm ? styles['disable'] : styles['enable'])}
                onClick={onConfirm ? onConfirm : noop}
            >
                {
                    selectNums ? __('确定(${selectNums})', { selectNums }) : __('确定')
                }
            </div>
        </div >
    )
}

export default ToolButton