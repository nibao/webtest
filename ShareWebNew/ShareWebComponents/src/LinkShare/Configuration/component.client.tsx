import * as React from 'react';
import Dialog from '../../../ui/Dialog2/ui.client';
import ConfigurationView from './component.view';

const Configuration: Component.LinkShare.Confirguration.ClientComponent = function Configuration({ ...otherProps }) {
    return (
        <Dialog
            width={ 670 }
        >
            <ConfigurationView
                {...otherProps}
            />
        </Dialog>
    )
}

export default Configuration