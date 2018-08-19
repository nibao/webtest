import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import Dialog from '../../../../ui/Dialog2/ui.desktop';
import DeleteConfirmView from './component.view';
import * as styles from '../styles.desktop';
import __ from '../locale';


const DeleteConfirm: React.StatelessComponent<Components.Recycle.RecycleDeleter.Props> = function DeleteConfirm({
    docs,
    onCancel = noop,
    deleteFiles = noop,
}) {
    return (
        <Dialog
            title={__('确认删除')}
            onClose={() => onCancel()}
        >
            <DeleteConfirmView
                recycleDeleteDocs={docs}
                deleteFiles={deleteFiles.bind(this)}
                onCancel={() => onCancel()}
            />
        </Dialog>
    )
}

export default DeleteConfirm;