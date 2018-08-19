import * as React from 'react';
import Dialog from '../../../ui/Dialog2/ui.desktop';
import View from './component.view';
import __ from './locale';

export default function Content({ onClose, ...otherProps }) {


    return (
        <Dialog
            title={__('查看大小')}
            onClose={onClose}
        >
            <View
                {...otherProps}
            />
        </Dialog>

    )

}