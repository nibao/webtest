import * as React from 'react'
import { map } from 'lodash'
import { Dialog2 } from '../../../ui/ui.desktop'
import * as styles from './styles.desktop.css'
import __ from './locale'

const DetailsDialog: React.StatelessComponent<Components.NodeManagement.DetailsDialog.Props> = ({
    id,
    details,
    onDetailClose,
}) => (
        <Dialog2
            width={500}
            title={id}
            onClose={onDetailClose}
        >
            <div
                className={styles['wrapper']}
            >
                <table
                    className={styles['table']}
                >
                    <thead
                        className={styles['heads']}
                    >
                        <th
                            className={styles['cell']}

                        >
                            {__('磁盘属性')}
                        </th>
                        <th
                            className={styles['cell']}
                        >
                            {__('数值')}
                        </th>
                    </thead>
                    <tbody>
                        {
                            map(details, (value, key) => {
                                return (
                                    <tr
                                        className={styles['rows']}
                                    >
                                        <td
                                            className={styles['cell']}
                                        >
                                            {key}
                                        </td>
                                        <td
                                            className={styles['cell']}
                                        >
                                            {value}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </Dialog2>
    )

export default DetailsDialog