import * as React from 'react';
import { clock, natural } from '../../util/validators/validators';
import ClockBoxBase from './ui.base';
import FlexBox from '../FlexBox/ui.desktop';
import TextBox from '../TextBox/ui.desktop';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class ClockBox extends ClockBoxBase {
    render() {
        return (
            <div className={ styles['container'] }>
                <TextBox className={ styles['input'] } width={ 36 } validator={ natural } value={ this.state.hours } onChange={ (hours) => this.triggerChange({ hours }) } />
                <label className={ styles['unit'] }>{ __('时') }</label>
                <TextBox className={ styles['input'] } width={ 36 } validator={ clock } value={ this.state.minutes } onChange={ (minutes) => this.triggerChange({ minutes }) } />
                <label className={ styles['unit'] }>{ __('分') }</label>
                <TextBox className={ styles['input'] } width={ 36 } validator={ clock } value={ this.state.seconds } onChange={ (seconds) => this.triggerChange({ seconds }) } />
                <label className={ styles['unit'] }>{ __('秒') }</label>
            </div>
        )
    }
}

