import * as React from 'react';
import { noop } from 'lodash'
import MessageDialog from '../../../ui/MessageDialog/ui.mobile';
import { formatterErrorText } from '../../../core/permission/permission'
import * as styles from './styles.mobile.css'

const ErrorMessages: React.StatelessComponent<Components.Share.ErrorMessages.Props> = function ErrorMessages({
    onConfirmError = noop,
    errCode,
    doc,
    template
}) {
    return (
        <MessageDialog onConfirm={onConfirmError}>
            <div className={styles['message']}>
                {
                    formatterErrorText(errCode, doc, template)
                }
            </div>
        </MessageDialog>
    )
}

export default ErrorMessages