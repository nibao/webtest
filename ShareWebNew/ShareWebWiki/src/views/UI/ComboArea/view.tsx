import * as React from 'react';
import UIView from '../../UI/view';
import ComboArea from '../../../../ui/ComboArea/ui.desktop';

export default function ComboAreaView() {
    return (
        <UIView
            name={ '<ComboArea />' }
            description={ '组合选项编辑框' }
            api={
                [
                ]
            }>
            <ComboArea value={ [1, 2, 3] } uneditable={ true } />
        </UIView>
    )
}