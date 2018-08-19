import * as React from 'react';
import * as classnames from 'classnames';
import { noop } from 'lodash';
import Dialog from '../../../../ui/Dialog2/ui.desktop';
import DuplicateConfirmView from './component.view';
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
        <Dialog
            title={__('重名提示')}
            width={460}
            onClose={onCancel}
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
    )
}

export default DuplicateConfirm;