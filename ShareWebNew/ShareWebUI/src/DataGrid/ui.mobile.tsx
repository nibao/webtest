import * as React from 'react';
import * as classnames from 'classnames';
import { map, get } from 'lodash';
import DataGridBase from './ui.base';
import DataGridField from '../DataGrid.Field/ui.mobile';
import CheckBox from '../CheckBox/ui.mobile';
import * as styles from './style.mobile.css';

export default class DataGrid extends DataGridBase {

    static Field = DataGridField;

    render() {
        return (
            <div className={classnames(styles['container'], this.props.className)}>
                <div>
                    <table className={styles['table']}>
                        <colgroup>
                            {
                                get(this.props.select, 'multi') === true ? <col width={40} /> : null
                            }
                            {
                                this.props.children
                            }
                        </colgroup>
                        <tbody className={styles['content']}>
                            {
                                map(this.props.data, (record, index) => (
                                    <tr
                                        onClick={(e) => this.onClickRow(e, record)}
                                        className={classnames(styles['record'], { [styles['selected']]: this.isSelected(record) })}
                                    >
                                        {
                                            // 多选复选框
                                            get(this.props.select, 'multi') === true ?
                                                <td className={classnames(styles['cell'], styles['checkbox-cell'])}>
                                                    <CheckBox
                                                        checked={this.isSelected(record)}
                                                        onClick={(e) => { this.toggleSelected(record, { multi: true }); e.stopPropagation() }} />
                                                </td>
                                                : null
                                        }
                                        {
                                            React.Children.map(this.props.children, ({ props: { field, formatter } }) => (
                                                <td className={styles['cell']}>
                                                    {
                                                        formatter(record[field], record)
                                                    }
                                                </td>
                                            ))
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}