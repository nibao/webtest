import * as React from 'react';
import { noop } from 'lodash'
import { Dialog2 as Dialog } from '../../../ui/ui.desktop'
import View from './component.view';
import __ from './locale';

const EditCSF: React.StatelessComponent<Components.CSFEditor.EditCSF.DesktopProps> = ({
    onCancel = noop,
    ...otherProps
}) => {
    return (
        <Dialog
            title={__('密级设置')}
            onClose={onCancel}
            >
            <View
                {...otherProps}
                onCancel={onCancel}
                />
        </Dialog>
    )
}

export default EditCSF