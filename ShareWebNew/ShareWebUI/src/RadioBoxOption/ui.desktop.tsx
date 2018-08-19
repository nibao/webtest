import * as React from 'react';
import * as classnames from 'classnames';
import RadioBox from '../RadioBox/ui.desktop';
import * as styles from './styles.desktop.css';

export default function RadioBoxOption({ children, ...props }: UI.RadioBoxOption.Props) {
    return (
        <label className={styles['container']}>
            <RadioBox
                className={styles['radio-box']}
                {...props}
            />
            <span className={classnames(styles['text'], { [styles['disabled']]: props.disabled })}>
                {
                    children
                }
            </span>
        </label>
    )
}