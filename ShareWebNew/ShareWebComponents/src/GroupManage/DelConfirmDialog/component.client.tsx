import * as React from 'react';
import { noop } from 'lodash';
import NWWindow from '../../../ui/NWWindow/ui.client';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.client';
import __ from './locale'

export default function DelConfirmDialog({ docid, onConfirm = noop, onCancel = noop }) {
    return (
        <NWWindow
            title={__('提示')}
            modal={true}
            onClose={onCancel}
        >
            <ConfirmDialog
                onConfirm={() => onConfirm(docid)}
                onCancel={() => onCancel()}
            >
                {__('确定要删除当前群组文档吗？')}
            </ConfirmDialog >
        </NWWindow>
    )
}