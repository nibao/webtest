import * as React from 'react';
import * as classnames from 'classnames';
import { generateWeekDays } from '../../util/date/date';
import LinkChip from '../LinkChip/ui.mobile';
import CalendarBase from './ui.base';
import { getLocaleWeeks } from './helper';
import * as styles from './styles.mobile.css';

export default class Calendar extends CalendarBase {
    render() {
        const [allowFrom, allowTo] = this.props.selectRange;
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
                                                    <td className={classnames(styles.cell, { [styles.selected]: this.matchSelected(date) })}>
                                                        {
                                                            date ?
                                                                <LinkChip
                                                                    key={date}
                                                                    className={styles.date}
                                                                    disabled={this.props.disabled || (allowFrom && date < allowFrom) || (allowTo && date > allowTo)}
                                                                    onTouchEnd={() => this.clickHandler(date)}
                                                                >
                                                                    {
                                                                        date.getDate()
                                                                    }
                                                                </LinkChip>
                                                                :
                                                                ''
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