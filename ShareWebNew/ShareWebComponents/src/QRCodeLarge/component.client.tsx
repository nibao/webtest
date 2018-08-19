import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.client';
import QRCodeLargeView from './component.view';

export default function QRCodeLarge({ doClose, ...otherProps }) {
    return (
        <Dialog
            onClose={doClose}
        >
            <QRCodeLargeView
                {...otherProps}
            />
        </Dialog>
    )
}