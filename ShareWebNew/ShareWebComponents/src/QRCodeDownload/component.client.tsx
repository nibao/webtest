import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.client';
import QRCodeDownloadView from './component.view';

export default function QRCodeDownload({ doClose, ...otherProps }) {
    return (
        <Dialog
            onClose={ doClose }
        >
            <QRCodeDownloadView
                {...otherProps}
            />
        </Dialog>
    )
}