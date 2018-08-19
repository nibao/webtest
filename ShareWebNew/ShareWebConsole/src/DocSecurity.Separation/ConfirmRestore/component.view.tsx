import * as React from 'react';
import { noop } from 'lodash';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import __ from './locale';

export default function ConfirmRestore({ onConfirm = noop, onCancel = noop }) {
    return (
        <ConfirmDialog onConfirm={onConfirm} onCancel={onCancel}>
            {__('此操作将还原该文件到原位置（包含其所有历史版本），可能存在安全风险，确定要执行此操作吗？')}
        </ConfirmDialog>
    )
}