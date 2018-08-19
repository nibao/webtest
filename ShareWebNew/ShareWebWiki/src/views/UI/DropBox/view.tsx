import * as React from 'react';
import UIView from '../../UI/view';
import DropBox from '../../../../ui/DropBox/ui.desktop';

export default function DropBoxView() {
    return (
        <UIView
            name={ '<DropBox />' }
            description={ '下拉框组件' }
            api={ [] }
        >
            <DropBox value="Hallo">
                Hello
            </DropBox>
        </UIView >
    )
}