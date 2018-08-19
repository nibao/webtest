import * as React from 'react';
import { Dialog2 as Dialog } from '../../../ui/ui.client'
import View from './component.view';

const EditCSF: React.StatelessComponent<Components.CSFEditor.EditCSF.ClientProps> = ({
    ...otherProps
}) => {
    return (
        <Dialog>
            <View {...otherProps} />
        </Dialog>
    )
}

export default EditCSF