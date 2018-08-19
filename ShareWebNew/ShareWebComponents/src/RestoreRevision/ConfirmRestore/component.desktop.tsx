import * as React from 'react';
import { noop } from 'lodash';
import { formatTime } from '../../../util/formatters/formatters';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import __ from './locale';

export default function ConfirmRestore({ revision, onConfirm = noop, onCancel = noop }) {
    return (
        <ConfirmDialog
            onConfirm={onConfirm}
            onCancel={onCancel}
        >
            {__('您确定要将当前文件还原为时间点${time}的版本吗？', { time: revision.modified ? formatTime(revision.modified / 1000) : '---' })}
        </ConfirmDialog>
    )
}