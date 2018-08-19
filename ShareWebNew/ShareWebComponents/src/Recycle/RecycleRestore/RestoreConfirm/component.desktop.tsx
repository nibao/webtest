import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import Dialog from '../../../../ui/Dialog2/ui.desktop';
import RestoreConfirmView from './component.view';
import * as styles from '../styles.desktop';
import __ from '../locale';


const RestoreConfirm: React.StatelessComponent<Components.Recycle.RestoreConfirm.Props> = function RestoreConfirm({
    recycleRestoreDocs,
    onCancel = noop,
    onConfirmRestore = noop,
}) {
    return (
        <Dialog
            title={__('确认还原')}
            width={400}
            onClose={() => onCancel()}
        >
            <RestoreConfirmView
                recycleRestoreDocs={recycleRestoreDocs}
                onConfirmRestore={onConfirmRestore.bind(this)}
                onCancel={() => onCancel()}
            />
        </Dialog>
    )
}

export default RestoreConfirm;