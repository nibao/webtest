import * as React from 'react';
import * as styles from './styles.mobile.css';

const FormRow: UI.FormRow.Component = function FormRow({ children }) {
    return (
        <div className={ styles.row }>
            {
                children
            }
        </div>
    )
}
export default FormRow