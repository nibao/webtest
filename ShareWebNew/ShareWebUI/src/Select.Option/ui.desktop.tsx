import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import Text from '../Text/ui.desktop';
import * as styles from './styles.desktop';

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
            <Text>
                {
                    children
                }
            </Text>
        </div>
    )
}

export default SelectOption