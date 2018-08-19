import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import Dialog from '../../../../ui/Dialog2/ui.client';
import DuplicateConfirmView from './component.view';
import NWWindow from '../../../../ui/NWWindow/ui.client';
import * as styles from '../styles.desktop';
import __ from '../locale';


const DuplicateConfirm: React.StatelessComponent<Components.Recycle.DuplicateConfirm.Props> = function DuplicateConfirm({
    renameDoc,
    onCancel = noop,
    suggestName,
    handleCheckSkip,
    handleUnCheckSkip,
    onConfirmRename
}) {
    return (
        <NWWindow
            modal={true}
            title={__('确认还原')}
            onClose={onCancel}
        >
            <Dialog
                width={460}
            >
                <DuplicateConfirmView
                    renameDoc={renameDoc}
                    suggestName={suggestName}
                    handleCheckSkip={handleCheckSkip}
                    handleUnCheckSkip={handleUnCheckSkip}
                    onConfirmRename={onConfirmRename}
                    onCancel={onCancel}
                />
            </Dialog>
        </NWWindow>
    )
}

export default DuplicateConfirm;