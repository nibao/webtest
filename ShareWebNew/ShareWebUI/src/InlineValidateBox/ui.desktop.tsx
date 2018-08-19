import * as React from 'react';
import * as classnames from 'classnames';
import ValidateBox from '../ValidateBox/ui.desktop';
import * as styles from './styles.desktop.css';

export default function InlineValidateBox({ className, width, ...props }: UI.InlineValidateBox.Props) {
    return (
        <ValidateBox width={width ? width : 58} className={classnames(styles['inline-validatebox'], className)} {...props} />
    )
}