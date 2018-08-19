import * as React from 'react';
import Dialog from '../../../../ui/Dialog2/ui.client';
import EmptyConfirmView from './component.view';
import NWWindow from '../../../../ui/NWWindow/ui.client';
import * as styles from '../styles.desktop';
import __ from '../locale';


const EmptyConfirm: React.StatelessComponent<Components.Recycle.EmptyConfirm.Props> = function EmptyConfirm({
    onCancel,
    durationSelection,
    emptyRecycle,
    handleSelectStrategyMenu
}) {
    return (
        <NWWindow
            modal={true}
            title={__('清空')}
            onClose={onCancel}
        >
            <Dialog>
                <EmptyConfirmView
                    maxHeight={100}
                    durationSelection={durationSelection}
                    emptyRecycle={emptyRecycle}
                    onCancel={onCancel}
                    handleSelectStrategyMenu={handleSelectStrategyMenu}
                />
            </Dialog>
        </NWWindow>
    )
}

export default EmptyConfirm;