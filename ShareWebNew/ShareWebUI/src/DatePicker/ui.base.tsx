import * as React from 'react';
import { noop } from 'lodash';
import { formatTime } from '../../util/formatters/formatters';
import { PureComponent } from '../decorators';

interface Props {
    onChange: (date: Date) => any; // 选中日期时触发

    onChangeCalendar: Function; // 日历翻页时触发

    selectRange: Array<Date>;

    startsFromZero: boolean; // 选中的日期对象从当天00:00:00开始
}

@PureComponent
export default class DatePickerBase extends React.Component<any, any> {
    static defaultProps = {
        onChange: noop,

        onChangeCalendar: noop,

        selectRange: [],

        startsFromZero: false
    }

    state = {
        year: (this.props.value || new Date()).getFullYear(),

        month: (this.props.value || new Date()).getMonth() + 1
    }

    componentWillReceiveProps({ disabled, value }) {
        // value和this.props.value都存在，才可以进行getTime()比较
        if (!disabled && ((value && !this.props.value) || (!value && this.props.value) || (value && this.props.value && value.getTime() !== this.props.value.getTime()))) {
            this.setState({
                year: value.getFullYear(),
                month: value.getMonth() + 1
            })
        }
    }

    flipYear(yearChange) {
        if (this.state.year + yearChange < 1970) {
            return;
        }
        this.setState({
            year: this.state.year + yearChange
        })

        this.fireChangeCalendarEvent();
    }

    flipMonth(monthChange) {


        const nextMonth = this.state.month + monthChange;

        if (nextMonth > 12) {
            this.flipYear(1);

            this.setState({
                month: 1
            })
        }
        else if (nextMonth < 1) {

            if (this.state.year === 1970) {
                return;
            }

            this.flipYear(-1);

            this.setState({
                month: 12
            })
        } else {
            this.setState({
                month: this.state.month + monthChange
            })
        }

        this.fireChangeCalendarEvent();
    }

    fireChangeCalendarEvent() {
        this.props.onChangeCalendar();
    }
}