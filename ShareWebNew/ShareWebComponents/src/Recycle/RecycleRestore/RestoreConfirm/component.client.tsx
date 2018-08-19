import * as React from 'react';
import { noop } from 'lodash';
import Dialog from '../../../../ui/Dialog2/ui.client';
import RestoreConfirmView from './component.view';
import NWWindow from '../../../../ui/NWWindow/ui.client';
import * as styles from '../styles.desktop';
import __ from '../locale';


const RestoreConfirm: React.StatelessComponent<Components.Recycle.RestoreConfirm.Props> = function RestoreConfirm({
    recycleRestoreDocs,
    onCancel = noop,
    onConfirmRestore = noop,
}) {
    return (
        <NWWindow
            modal={true}
            title={__('确认还原')}
            onClose={() => onCancel()}
        >
            <Dialog
                width={400}
            >
                <RestoreConfirmView
                    recycleRestoreDocs={recycleRestoreDocs}
                    onConfirmRestore={onConfirmRestore.bind(this)}
                    onCancel={() => onCancel()}
                />
            </Dialog>
        </NWWindow>
    )
}

export default RestoreConfirm;