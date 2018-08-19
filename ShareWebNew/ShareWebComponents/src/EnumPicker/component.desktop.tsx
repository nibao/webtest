import * as React from 'react';
import { omit, map } from 'lodash';
import EnumPickerBase from './component.base';
import Select from '../../ui/Select/ui.desktop';

export default class EnumPicker extends EnumPickerBase {
    render() {
        return (
            <Select onChange={this.handleSelect.bind(this)}>
                {
                    this.state.serializedOptions.map(option => {
                        return (
                            <Select.Option
                                value={option}
                                selected={option.name === this.props.name}
                            >
                                {
                                    option.name || '---'
                                }
                            </Select.Option>
                        )
                    })
                }
            </Select>
        );
    }
}