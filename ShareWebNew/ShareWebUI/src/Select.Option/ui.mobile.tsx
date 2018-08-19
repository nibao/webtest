import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import * as styles from './styles.mobile';

const SelectOption: UI.SelectOption.Component = function SelectOption({ className, selected, value, disabled, onSelect = noop, children }) {
    return (
        <div
            className={
                classnames(
                    styles['option'],
                    {
                        [styles['selected']]: selected
                    },
                    className
                )
            }
            onMouseDown={ !disabled && onSelect.bind(null, { value, text: children }) }
        >
            {
                children
            }
        </div>
    )
}

export default SelectOption