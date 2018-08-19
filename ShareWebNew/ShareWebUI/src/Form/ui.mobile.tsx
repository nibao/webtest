import * as React from 'react';
import FormRow from '../Form.Row/ui.mobile';
import FormLabel from '../Form.Label/ui.mobile';
import FormField from '../Form.Field/ui.mobile';
import * as styles from './styles.mobile.css';

export default function Form({children, ...props}: UI.Form.Props) {
    return (
        <form {...props} className={styles['form']} onSubmit={(e) => e.preventDefault()}>
            {
                children
            }
        </form>
    )
}

Form.Row = FormRow;

Form.Label = FormLabel;

Form.Field = FormField;