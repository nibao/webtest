import * as React from 'react';
import { noop } from 'lodash';
import Dialog from '../../ui/Dialog2/ui.desktop';
import View from './component.view';
import __ from './locale';

const ViewSecuDetails: React.StatelessComponent<Components.Attributes.ViewSecuDetails.Props> = function ViewSecuDetails({
    onConfirm = noop,
    ...otherProps
}) {
    return (
        <Dialog
            title={__('密级详情')}
            onClose={onConfirm}
            >
            <View
                {...otherProps}
                onConfirm={onConfirm}
                />
        </Dialog>
    )
}

export default ViewSecuDetails

