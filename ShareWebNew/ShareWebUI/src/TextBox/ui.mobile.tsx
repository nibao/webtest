import * as React from 'react';
import * as classnames from 'classnames';
import TextInput from '../TextInput/ui.mobile';
import * as styles from './styles.mobile.css';

export default function TextBox({ style, className, disabled, width, ...props }: UI.TextBox.Props) {
    return (
        <div
            className={classnames(styles['textbox'], className, { [styles['disabled']]: disabled })}
            style={{ width, ...style }}
        >
            <div className={styles['padding']}>
                <TextInput { ...props } disabled={disabled} />
            </div>
        </div >
    )
}