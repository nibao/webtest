import * as React from 'react';
import { noop } from 'lodash';
import DatePickerBase from './ui.base';
import UIIcon from '../UIIcon/ui.mobile';
import FlexBox from '../FlexBox/ui.mobile';
import Calendar from '../Calendar/ui.mobile';
import * as styles from './styles.mobile.css';

export default class DatePicker extends DatePickerBase {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.monthPanel}>
                    <FlexBox>
                        <FlexBox.Item align="left middle">
                            <span className={styles.navWrapper}>
                                <UIIcon disabled={this.props.disabled} size="12" code={'\uf010'} onClick={() => this.flipYear(-1)} />
                            </span>
                            <span className={styles.navWrapper}>
                                <UIIcon disabled={this.props.disabled} size="12" code={'\uf012'} onClick={() => this.flipMonth(-1)} />
                            </span>
                        </FlexBox.Item>
                        <FlexBox.Item align="center middle">
                            {
                                `${this.state.month.getFullYear()}-${this.state.month.getMonth() + 1}`
                            }
                        </FlexBox.Item>
                        <FlexBox.Item align="right middle">
                            <span className={styles.navWrapper}>
                                <UIIcon disabled={this.props.disabled} size="12" code={'\uf011'} onClick={() => this.flipMonth(1)} />
                            </span>
                            <span className={styles.navWrapper}>
                                <UIIcon disabled={this.props.disabled} size="12" code={'\uf00f'} onClick={() => this.flipYear(1)} />
                            </span>
                        </FlexBox.Item>
                    </FlexBox>
                </div>
                <div className={styles.calendar}>
                    <Calendar selectRange={this.props.selectRange} month={this.state.month} date={this.props.date} onSelect={this.props.onSelect.bind(this)} />
                </div>
            </div>
        )
    }
}