import * as React from 'react';
import { noop } from 'lodash';
import NWWindow from '../../../ui/NWWindow/ui.client';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.client'
import __ from './locale';
import * as styles from './styles.desktop.css';

const GroupDeleter: React.StatelessComponent<Components.Contact.GroupDeleter.Props> = function GroupDeleter({
    onConfirmDelete = noop,
    onCancelDelete = noop
}) {
    return (
        <NWWindow
            modal={true}
            title={__('删除分组')}
            onClose={() => onCancelDelete()}
        >
            <ConfirmDialog
                onConfirm={() => onConfirmDelete()}
                onCancel={() => onCancelDelete()}
            >
                {__('确认删除该分组吗？')}
            </ConfirmDialog>
        </NWWindow>
    )

}

export default GroupDeleter;