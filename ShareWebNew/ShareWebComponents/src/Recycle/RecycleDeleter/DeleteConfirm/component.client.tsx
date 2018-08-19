import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import Dialog from '../../../../ui/Dialog2/ui.client';
import DeleteConfirmView from './component.view';
import NWWindow from '../../../../ui/NWWindow/ui.client';
import * as styles from '../styles.desktop';
import __ from '../locale';


const DeleteConfirm: React.StatelessComponent<Components.Recycle.RecycleDeleter.Props> = function DeleteConfirm({
    docs,
    onCancel = noop,
    deleteFiles = noop,
}) {
    return (
        <NWWindow
            modal={true}
            title={__('确认删除')}
            onClose={() => onCancel()}
        >
            <Dialog
                width={400}
            >
                <DeleteConfirmView
                    recycleDeleteDocs={docs}
                    deleteFiles={deleteFiles.bind(this)}
                    onCancel={() => onCancel()}
                />
            </Dialog>
        </NWWindow>
    )
}

export default DeleteConfirm;

