import * as React from 'react';
import UIView from '../../UI/view';
import Select from '../../../../ui/Select/ui.desktop';

export default function SelectView() {
    return (
        <UIView
            name={ '<Select />' }
            description={ '下拉框组件' }
            api={ [] }
        >
            <Select value={ 2 } onChange={ console.log }>
                <Select.Option value={ 1 }>Hallo</Select.Option>
                <Select.Option value={ 2 }>Hello</Select.Option>
            </Select>
        </UIView >
    )
}