import * as React from 'react';
import { noop } from 'lodash';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop'
import __ from './locale';
import * as styles from './styles.desktop.css';

const GroupDeleter: React.StatelessComponent<Components.Contact.GroupDeleter.Props> = function GroupDeleter({
    onCancelDelete = noop,
    onConfirmDelete = noop
}) {
    return (
        <ConfirmDialog
            title={__('删除分组')}
            onConfirm={() => onConfirmDelete()}
            onCancel={() => onCancelDelete()}
        >
            {__('确认删除该分组吗？')}
        </ConfirmDialog>
    )

}

export default GroupDeleter;