import * as React from 'react';
import { noop } from 'lodash'
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.client';
import { docname } from '../../../core/docs/docs';
import __ from './locale';

const SecretModeMessages: React.StatelessComponent<Components.Share.SecretModeMessages.Props> = function SecretModeMessages({
    onConfirm = noop,
    onCancel = noop,
    doc,
    csflevelText,
    onResize = noop
}) {
    return (
        <ConfirmDialog
            onConfirm={onConfirm}
            onCancel={onCancel}
            onResize={onResize}
            >
            {
                __('您确定要将密级为 “${csflevel}” 的文件 “${name}” 共享给指定的访问者吗？', { csflevel: csflevelText, name: docname(doc) })
            }
        </ConfirmDialog>
    )
}

export default SecretModeMessages