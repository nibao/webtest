import * as React from 'react';
import { noop } from 'lodash';
import Dialog from '../../ui/Dialog2/ui.client';
import View from './component.view';

const ViewSecuDetails: React.StatelessComponent<Components.Attributes.ViewSecuDetails.Props> = function ViewSecuDetails({
    onConfirm = noop,
    ...otherProps
}) {
    return (
        <Dialog
            >
            <View
                {...otherProps}
                onConfirm={onConfirm}
                />
        </Dialog>
    )
}

export default ViewSecuDetails
