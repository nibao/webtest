import * as React from 'react'
import { noop } from 'lodash'
import * as classnames from 'classnames'
import Expand from '../Expand/ui.mobile'
import CheckBox from '../CheckBox/ui.mobile'
import * as styles from './styles.mobile.css'

const DataListItem: React.StatelessComponent<UI.DataListItem.Props> = function DataListItem({
    className,
    selectable = true,
    checkbox = true,
    selected = false,
    expandable = false,
    expandContent = null,
    expanded = false,
    selecting,
    children,
    onClick = noop,
    onContextMenu = noop,
    onDoubleClick = noop,
    ...otherProps
}) {
    return (
        <li
            className={classnames(styles['item'], { [styles['selected']]: selected })}
        >
            <div
                className={classnames(styles['wrapper'], { [styles['checkbox-padding']]: checkbox, [styles['selecting']]: selecting }, className)}
                onClick={onClick}
                onContextMenu={onContextMenu}
                onDoubleClick={onDoubleClick}
                {...otherProps}
            >
                {
                    checkbox ?
                        <div className={styles['checkbox']}>
                            {
                                selectable ?
                                    <CheckBox checked={selected} /> : null
                            }
                        </div>
                        : null
                }
                {children}
            </div>
            {
                expandable ?
                    <Expand
                        open={expanded}
                        onContextMenu={e => e.preventDefault()}
                    >
                        {expandContent}
                    </Expand> :
                    null
            }
        </li>
    )
}

DataListItem.defaultProps = {
    selectable: true,
    checkbox: true,
    expandable: false,
    expandContent: null,
    expanded: false
}

export default DataListItem