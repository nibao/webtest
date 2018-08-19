import * as React from 'react';
import { noop } from 'lodash';
import SimpleDialog from '../../../ui/SimpleDialog/ui.client';
import View from './component.view';

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