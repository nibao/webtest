import * as React from 'react';
import * as classnames from 'classnames';
import CheckBox from '../CheckBox/ui.desktop';
import * as styles from './styles.desktop.css';

export default function CheckBoxOption({ className,children, disabled, ...props }: UI.CheckBoxOption.Props) {
    return (
        <label className={ classnames(styles['container'],className) }>
            <CheckBox
                disabled={ disabled }
                {...props}
            />
            <span className={ classnames(styles['text'], { [styles['disabled']]: disabled }) }>
                {
                    children
                }
            </span>
        </label>
    )
}
