import * as React from 'react';
import Dialog from '../../ui/Dialog2/ui.desktop';
import QRCodeDownloadView from './component.view';
import __ from './locale';

export default function QRCodeDownload({ doClose, ...otherProps }) {
    return (
        <Dialog
            title={ __('下载二维码') }
            onClose={ doClose }
        >
            <QRCodeDownloadView
                {...otherProps}
            />
        </Dialog>
    )
}