import * as React from 'react';
import * as classnames from 'classnames';
import { generateWeekDays, endOfDay, startOfDay } from '../../util/date/date';
import LinkChip from '../LinkChip/ui.desktop';
import CalendarBase from './ui.base';
import { getLocaleWeeks } from './helper';
import * as styles from './styles.desktop.css';

export default class Calendar extends CalendarBase {
    render() {
        const [start, end] = this.props.selectRange;
        const [allowFrom, allowTo] = [start ? startOfDay(start, { type: 'GMT' }) : start, end ? endOfDay(end, { type: 'GMT' }) : end];
        const localeWeeks = getLocaleWeeks()

        return (
            <div className={styles.calendar}>
                <table>
                    <thead>
                        {
                            <tr>
                                {
                                    generateWeekDays(this.props.firstOfDay).map(day => {
                                        return (
                                            <th className={styles.day}>
                                                {
                                                    localeWeeks[day]
                                                }
                                            </th>
                                        )
                                    })
                                }
                            </tr>
                        }
                    </thead>
                    <tbody>
                        {
                            this.state.weeks.map(week => {
                                return (
                                    <tr>
                                        {
                                            week.map(date => {
                                                return (
                                                    <td className={classnames(styles.cell, { [styles.selected]: this.matchSelected(date), [styles['invalid']]: !date })}>
                                                        {
                                                            date ?
                                                                <LinkChip
                                                                    key={date}
                                                                    className={styles.date}
                                                                    disabled={this.props.disabled || (allowFrom && date < allowFrom) || (allowTo && date > allowTo)}
                                                                    onClick={() => this.clickHandler(date)}
                                                                >
                                                                    {
                                                                        date.getDate()
                                                                    }
                                                                </LinkChip>
                                                                : null
                                                        }
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}