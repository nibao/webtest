import * as React from 'react';
import { noop } from 'lodash';
import Button from '../Button/ui.mobile';
import * as styles from './styles.mobile.css';

export default function DialogButton({ children, ...props }: UI.DialogButton.Props) {
    return (
        <Button
            className={styles['button']}
            {...props}
        >
            {
                children
            }
        </Button >
    )
}