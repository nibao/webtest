import * as React from 'react';
import * as styles from './styles.desktop.css';

const FormField: UI.FormField.Component = function FormField({ children }) {
    return (
        <div className={ styles['field'] }>
            {
                children
            }
        </div>
    )
}

export default FormField