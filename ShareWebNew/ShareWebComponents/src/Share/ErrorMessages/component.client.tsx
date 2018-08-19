import * as React from 'react';
import { noop } from 'lodash'
import MessageDialog from '../../../ui/MessageDialog/ui.client';
import { formatterErrorText } from '../../../core/permission/permission'

const ErrorMessages: React.StatelessComponent<Components.Share.ErrorMessages.Props> = function ErrorMessages({
    onConfirmError = noop,
    errCode,
    doc,
    template
}) {
    return (
        <MessageDialog
            onConfirm={onConfirmError}
            >
            {
                formatterErrorText(errCode, doc, template)
            }
        </MessageDialog>
    )
}

export default ErrorMessages