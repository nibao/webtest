import * as React from 'react';
import { noop } from 'lodash'
import * as styles from './styles.mobile.css';

const PlainButton: React.StatelessComponent<UI.PlainButton.Props> = function PlainButton({
    type = 'button',
    disabled = false,
    children,
    onClick = noop
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={styles.button}
            onClick={onClick}
        >
            {
                children
            }
        </button>
    )
}

export default PlainButton