import * as React from 'react';
import { formatTime } from '../../util/formatters/formatters';
import DropBox from '../DropBox/ui.mobile';
import DatePicker from '../DatePicker/ui.mobile';
import DateBoxBase from './ui.base';
import * as styles from './styles.mobile.css';

export default class DateBox extends DateBoxBase {
    render() {
        return (
            <DropBox
                fontIcon={ '\uf00e' }
                value={ this.state.value }
                formatter={ date => formatTime(date, this.props.format) }
                active={ this.state.active }
            >
                <DatePicker
                    value={ this.state.value }
                    selectRange={ this.props.selectRange }
                    onChange={ this.select.bind(this) }
                />
            </DropBox>
        )
    }
}