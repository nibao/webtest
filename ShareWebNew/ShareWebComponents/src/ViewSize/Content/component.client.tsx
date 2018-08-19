import * as React from 'react';
import Dialog from '../../../ui/Dialog2/ui.client';
import View from './component.view';
import __ from './locale';

export default function Content({ ...otherProps }) {

    return (
        <Dialog width={400}>
            <View
                {...otherProps}
            />
        </Dialog>
    )

}