import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash'
import Chip from '../Chip/ui.desktop';
import * as styles from './styles.desktop.css';

const ComboAreaItem: React.StatelessComponent<UI.ComboAreaItem.Props> = function ComboAreaItem({
    readOnly,
    disabled,
    data,
    children,
    className,
    chipClassName,
    removeChip = noop,
    ...otherProps
}) {

    return (
        <div
            className={classnames(styles['chip-wrap'], className)}
            {...otherProps }
        >
            <Chip
                readOnly={readOnly}
                disabled={disabled}
                removeHandler={() => { removeChip(data) }}
                className={chipClassName}
                actionClassName={styles['chip-action']}>
                {
                    children
                }
            </Chip>
        </div>
    );
}

ComboAreaItem.defaultProps = {
    readOnly: false,
    disabled: false,
    removeChip: noop
}

export default ComboAreaItem;