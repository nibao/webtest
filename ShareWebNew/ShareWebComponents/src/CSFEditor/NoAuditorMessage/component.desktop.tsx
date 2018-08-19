import * as React from 'react';
import { noop } from 'lodash';
import MessageDialog from '../../../ui/MessageDialog/ui.desktop';
import View from './component.view';

const NoCsfAuditorMessage: React.StatelessComponent<Components.Attributes.NoCsfAuditorMessage.Props> = function NoCsfAuditorMessage({
    onConfirm = noop,
    ...otherProps
}) {
    return (
        <MessageDialog onConfirm={onConfirm}>
            <View {...otherProps} />
        </MessageDialog>
    )
}

export default NoCsfAuditorMessage