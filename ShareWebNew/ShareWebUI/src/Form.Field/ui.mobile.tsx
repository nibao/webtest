import * as React from 'react';
import * as styles from './styles.mobile.css';

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