import * as React from 'react';
import * as classnames from 'classnames'
import * as styles from './styles.desktop.css';

/**
 * @param selected 是否选中
 * @param onMouseOver 鼠标移动要上面去
 */
export default function AutoCompleteListItem({ children, onMouseOver, selected }) {
    return (
        <li
            className={classnames(styles['autocomplte-list-item'], { [styles['selected']]: selected })}
            onMouseOver={onMouseOver}
            >
            {
                children
            }
        </li>
    )
}