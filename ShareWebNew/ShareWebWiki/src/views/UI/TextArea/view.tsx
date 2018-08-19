import * as React from 'react';
import UIView from '../../UI/view';
import TextArea from '../../../../ui/TextArea/ui.desktop';

export default function TextAreaView() {
    return (
        <UIView
            name={ '<TextArea />' }
            description={ '文本域组件' }
            api={
                [
                ]
            }>
            <TextArea
                width={ 100 }
                height={ 100 }
            />
        </UIView>
    )
}