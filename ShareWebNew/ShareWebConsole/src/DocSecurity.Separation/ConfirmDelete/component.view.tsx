import * as React from 'react';
import { noop } from 'lodash';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import __ from './locale';

export default function ConfirmDelete({ onConfirm = noop, onCancel = noop }) {
    return (
        <ConfirmDialog onConfirm={onConfirm} onCancel={onCancel}>
            {__('此操作将彻底删除该文件（包含其所有历史版本），删除后无法还原，确定要执行此操作吗？')}
        </ConfirmDialog>
    )
}