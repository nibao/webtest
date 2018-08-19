import * as React from 'react';
import DatePickerBase from './ui.base';
import FlexBox from '../FlexBox/ui.desktop';
import Calendar from '../Calendar/ui.desktop';
import UIIcon from '../UIIcon/ui.desktop';
import * as styles from './styles.desktop.css';
import * as prevmonth from './assets/prevmonth.png';
import * as nextmonth from './assets/nextmonth.png';
import * as prevyear from './assets/prevyear.png';
import * as nextyear from './assets/nextyear.png';

export default class DatePicker extends DatePickerBase {
    render() {
        return (
            <div
                className={styles.container}
                onClick={this.props.onDatePickerClick}
            >
                <div className={styles.monthPanel}>
                    <FlexBox>
                        <FlexBox.Item align="left middle">
                            <span className={styles.navWrapper}>
                                <UIIcon
                                    disabled={this.props.disabled}
                                    size="12"
                                    code={'\uf010'}
                                    fallback={prevyear}
                                    onClick={e => {
                                        e.stopPropagation();
                                        this.flipYear(-1)
                                    }}
                                />
                            </span>
                            <span className={styles.navWrapper}>
                                <UIIcon
                                    disabled={this.props.disabled}
                                    size="12"
                                    code={'\uf012'}
                                    fallback={prevmonth}
                                    onClick={e => {
                                        e.stopPropagation();
                                        this.flipMonth(-1)
                                    }}
                                />
                            </span>
                        </FlexBox.Item>
                        <FlexBox.Item align="center middle">
                            {
                                `${this.state.year}-${this.state.month}`
                            }
                        </FlexBox.Item>
                        <FlexBox.Item align="right middle">
                            <span className={styles.navWrapper}>
                                <UIIcon
                                    disabled={this.props.disabled}
                                    size="12"
                                    code={'\uf011'}
                                    fallback={nextmonth}
                                    onClick={e => {
                                        e.stopPropagation();
                                        this.flipMonth(1)
                                    }}
                                />
                            </span>
                            <span className={styles.navWrapper}>
                                <UIIcon
                                    disabled={this.props.disabled}
                                    size="12"
                                    code={'\uf00f'}
                                    fallback={nextyear}
                                    onClick={e => {
                                        e.stopPropagation();
                                        this.flipYear(1)
                                    }}
                                />
                            </span>
                        </FlexBox.Item>
                    </FlexBox>
                </div>
                <div className={styles.calendar}>
                    <Calendar
                        disabled={this.props.disabled}
                        selectRange={this.props.selectRange}
                        year={this.state.year}
                        month={this.state.month}
                        select={this.props.value}
                        startsFromZero={this.props.startsFromZero}
                        onSelect={this.props.onChange.bind(this)}
                    />
                </div>
            </div >
        )
    }
}