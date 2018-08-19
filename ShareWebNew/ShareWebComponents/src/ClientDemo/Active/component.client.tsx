import * as React from 'react';
import View from './component.view';
import Dialog from '../../../ui/Dialog2/ui.client';

export default function Active({ ...otherProps }) {
    return (
        <Dialog>
            <View
                {...otherProps}
            />
        </Dialog>
    )
}