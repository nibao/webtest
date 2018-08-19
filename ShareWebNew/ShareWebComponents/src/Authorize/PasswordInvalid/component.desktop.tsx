import * as React from 'react';
import { noop } from 'lodash';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import { getErrorMessage } from '../../../core/errcode/errcode';

export default function PasswordInvalid({ pwdInvalidErrcode, onConfirm = noop, onCancel = noop }) {
    return (
        <ConfirmDialog
            onConfirm={onConfirm}
            onCancel={onCancel}
        >
            {
                getErrorMessage(pwdInvalidErrcode)
            }
        </ConfirmDialog>
    )
}
