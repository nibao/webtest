import * as React from 'react'
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.mobile';
import __ from './locale';

export default function DisableConfig({ onConfirm, onCancel }) {

    return (
        <ConfirmDialog
            onConfirm={onConfirm}
            onCancel={onCancel}
        >
            {__('当前用户已被禁用，请联系管理员')}
        </ConfirmDialog>
    )

}