import * as React from 'react';
import { noop } from 'lodash';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import __ from './locale';

export default function WithinAppealValidity({ onConfirm = noop, onCancel = noop }) {
    return (
        <ConfirmDialog onConfirm={onConfirm} onCancel={onCancel}>
            {__('选中的文件未过可申诉期限，确定要执行此操作吗？')}
        </ConfirmDialog>
    )
}