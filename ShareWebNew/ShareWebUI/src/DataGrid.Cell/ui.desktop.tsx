import * as React from 'react';
import * as styles from './styles.desktop.css';

export default function DataGridCell({ children }: UI.DataGridCell.Props) {
    return (
        <td className={ styles['cell'] }>
            {
                children
            }
        </td>
    )
}