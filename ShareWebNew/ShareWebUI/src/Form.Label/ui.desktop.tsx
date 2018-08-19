import * as React from 'react';
import * as classnames from 'classnames';
import * as styles from './styles.desktop.css';

const FormLabel: UI.FormLabel.Component = function FormLabel({ align, children }) {
    return (
        <div className={ classnames(styles['label'], { [styles['align-top']]: align === 'top' }) }>
            {
                children
            }
        </div>
    )
}

export default FormLabel