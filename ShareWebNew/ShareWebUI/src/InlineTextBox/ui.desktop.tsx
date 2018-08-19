import * as React from 'react';
import * as classnames from 'classnames';
import TextBox from '../TextBox/ui.desktop';
import * as styles from './styles.desktop.css';

export default function InlineTextBox({className, ...props}: UI.InlineTextBox.Props) {
    return (
        <TextBox className={classnames(styles['inline-textbox'], className)} {...props} />
    )
}