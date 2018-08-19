import * as React from 'react'
import { noop } from 'lodash'
import * as classnames from 'classnames'
import Expand from '../Expand/ui.desktop'
import CheckBox from '../CheckBox/ui.desktop'
import * as styles from './styles.desktop.css'

const DataListItem: React.StatelessComponent<UI.DataListItem.Props> = function DataListItem({
    className,
    checkBoxClassName,
    selectable = true,
    checkbox = true,
    selected = false,
    expandable = false,
    expandContent = null,
    expanded = false,
    children,
    onClick = noop,
    onContextMenu = noop,
    onDoubleClick = noop,
    onToggleSelect = noop,
    ...otherProps
}) {
    return (
        <li
            className={classnames(styles['item'], { [styles['selected']]: selected })}
        >
            <div
                className={classnames(styles['wrapper'], { [styles['checkbox-padding']]: checkbox }, className)}
                onClick={onClick}
                onContextMenu={onContextMenu}
                onDoubleClick={onDoubleClick}
                {...otherProps}
            >
                {
                    checkbox ?
                        <div className={classnames(styles['checkbox'], checkBoxClassName)}>
                            {
                                selectable ?
                                    <CheckBox
                                        checked={selected}
                                        onClick={onToggleSelect}
                                    /> : null
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