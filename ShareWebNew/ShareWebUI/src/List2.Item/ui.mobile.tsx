import * as React from 'react'
import * as classnames from 'classnames'
import { noop } from 'lodash'
import UIIcon from '../UIIcon/ui.mobile'
import CheckBox from '../CheckBox/ui.mobile'
import * as styles from './styles.mobile'

const List2Item: React.StatelessComponent<UI.List2Item.Props> = function List2Item({
    checkbox,
    rightIcon,
    onClick = noop,
    children
}) {
    return (
        <div
            className={styles['list']}
            >
            {
                checkbox ?
                    <label className={styles['checkbox']}>
                        <CheckBox
                            disabled={!!checkbox.disabled}
                            checked={!!checkbox.checked}
                            onChange={checkbox.onChange}
                            />
                    </label>
                    : null
            }
            <div className={classnames(
                styles['children'],
                { [styles['children-left']]: checkbox },
                { [styles['children-right']]: rightIcon }
            )}
                onClick={onClick}
                >
                {
                    children
                }
            </div>
            {
                rightIcon ?
                    <div
                        className={styles['icon']}
                        >
                        {rightIcon}
                    </div>
                    : null
            }
        </div>
    )
}

export default List2Item