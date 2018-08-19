import * as React from 'react';
import DropBox from '../../ui/DropBox/ui.desktop';
import DatePicker from '../../ui/DatePicker/ui.desktop';
import CheckBox from '../../ui/CheckBox/ui.desktop';
import Menu from '../../ui/Menu/ui.desktop';
import ValidityBoxBase from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';

import * as calendar from './assets/calendar.png';

export default class ValidityBox extends ValidityBoxBase {
    render() {
        return (
            <DropBox
                ref="dropbox"
                fontIcon={ '\uf00e' }
                width={ this.props.width }
                dropAlign={ this.props.dropAlign }
                fallbackIcon={ calendar }
                value={ this.state.value === -1 ? this.state.value : this.state.value / 1000 }
                formatter={ this.validityFormatter.bind(this) }
                active={ this.state.active }
                onBlur={ this.setState.bind(this, { active: false }) }
            >
                <div className={ styles['padding'] }>
                    <Menu>
                        <DatePicker
                            value={ this.state.value === -1 ? null : new Date(this.state.value / 1000) }
                            selectRange={ this.props.selectRange }
                            onChange={ this.setValidity.bind(this) }
                            disabled={ this.state.value === -1 }
                        />
                        <div className={ styles['options'] }>
                            {
                                this.props.allowPermanent ? (
                                    <div>
                                        <CheckBox value={ -1 } checked={ this.state.value === -1 } onChange={ this.switchPermanent.bind(this) } />
                                        <label className={ styles['option-label'] }>
                                            {
                                                __('永久有效')
                                            }
                                        </label>
                                    </div>
                                ) : null
                            }
                        </div>
                    </Menu>
                </div>
            </DropBox>
        )
    }
}