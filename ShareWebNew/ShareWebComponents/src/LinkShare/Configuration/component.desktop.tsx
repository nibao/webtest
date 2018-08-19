import * as React from 'react';
import Dialog from '../../../ui/Dialog2/ui.desktop';
import ConfigurationView from './component.view';
import __ from './locale';

export default function Configuration({ enableLinkAccessCode, doConfigurationClose, ...otherProps }) {
    return (
        <Dialog
            width={ 670 }
            title={ enableLinkAccessCode ? __('提取码') : __('外链共享') }
            onClose={ doConfigurationClose }
        >
            <ConfigurationView
                {...{ ...otherProps, enableLinkAccessCode }}
            />
        </Dialog>
    )
}