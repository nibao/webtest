import * as React from 'react';
import UIView from '../../UI/view';
import TextBox from '../../../../ui/TextBox/ui.desktop';

export default function TextBoxView() {
    return (
        <UIView
            name={ '<TextBox />' }
            description={ '文本框组件' }
            api={
                [
                    {
                        name: 'type',
                        type: ['text', 'password', 'search'],
                        required: false,
                        defaultValue: 'text',
                        note: '文本框类型'
                    },
                    {
                        name: 'value',
                        type: String,
                        required: false,
                        defaultValue: 'test',
                        note: '文本框值'
                    },
                    {
                        name: 'required',
                        type: Boolean,
                        required: false,
                        defaultValue: true,
                        note: '是否必填'
                    }
                ]
            }>
            <TextBox />
        </UIView>
    )
}