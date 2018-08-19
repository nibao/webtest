import * as React from 'react';
import { noop } from 'lodash';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import __ from './locale'

export default function DelConfirmDialog({ docid, onConfirm = noop, onCancel = noop }) {
    return (
        <ConfirmDialog
            onConfirm={() => onConfirm(docid)}
            onCancel={() => onCancel()}
        >
            <div>{__('确定要删除当前群组文档吗？')}</div>
        </ConfirmDialog >
    )
}