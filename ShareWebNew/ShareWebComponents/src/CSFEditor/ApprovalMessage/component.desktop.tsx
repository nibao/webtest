import * as React from 'react';
import View from './component.view';
import { noop } from 'lodash'
import SimpleDialog from '../../../ui/SimpleDialog/ui.desktop';

const ApprovalMessage: React.StatelessComponent<Components.Attributes.ApprovalMessage.Props> = function ApprovalMessage({
    onConfirm = noop,
    ...otherProps
}) {
    return (
        <SimpleDialog onConfirm={onConfirm}>
            <View {...otherProps} />
        </SimpleDialog>
    )
}

export default ApprovalMessage