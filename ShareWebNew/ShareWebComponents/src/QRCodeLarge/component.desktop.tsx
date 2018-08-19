import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.desktop';
import QRCodeLargeView from './component.view';
import __ from './locale';

export default function QRCodeLarge({ doClose, ...otherProps }) {
    return (
        <Dialog
            title={ __('二维码原图') }
            onClose={ doClose }
        >
            <QRCodeLargeView
                {...otherProps}
            />
        </Dialog>
    )
}