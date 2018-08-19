import * as React from 'react';
import { formatTime } from '../../util/formatters/formatters';
import DropBox from '../DropBox/ui.desktop';
import DatePicker from '../DatePicker/ui.desktop';
import DateBoxBase from './ui.base';

export default class DateBox extends DateBoxBase {
    render() {
        return (
            <DropBox
                fontIcon={'\uf00e'}
                dropAlign={this.props.dropAlign}
                value={this.state.value}
                formatter={date => this.props.shouldShowblankStatus ? '---' : formatTime(date, this.props.format)}
                active={this.state.active}
                width={this.props.width}
                onActive={(active) => { this.props.onActive(active) }}
            >
                <DatePicker
                    value={this.state.value}
                    selectRange={this.props.selectRange}
                    onChange={this.select.bind(this)}
                    startsFromZero={this.props.startsFromZero}
                    onDatePickerClick={() => this.props.onDatePickerClick(this.state.active)}
                />
            </DropBox>
        )
    }
}