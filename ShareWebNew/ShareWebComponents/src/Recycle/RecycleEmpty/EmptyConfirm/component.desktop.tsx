import * as React from 'react';
import Dialog from '../../../../ui/Dialog2/ui.desktop';
import EmptyConfirmView from './component.view';
import * as styles from '../styles.desktop';
import __ from '../locale';


const EmptyConfirm: React.StatelessComponent<Components.Recycle.EmptyConfirm.Props> = function EmptyConfirm({
    onCancel,
    durationSelection,
    emptyRecycle,
    handleSelectStrategyMenu
}) {
    return (
        <Dialog
            title={__('清空')}
            width={500}
            onClose={onCancel}
        >
            <EmptyConfirmView
                maxHeight={200}
                durationSelection={durationSelection}
                emptyRecycle={emptyRecycle}
                onCancel={onCancel}
                handleSelectStrategyMenu={handleSelectStrategyMenu}
            />
        </Dialog>
    )
}

export default EmptyConfirm;