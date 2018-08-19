import * as React from 'react';
import { noop } from 'lodash';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import InvalidTipMessageView from './component.view';

const InvalidTipMessage: React.StatelessComponent<Components.InvalidTipMessage.Props> = function InvalidTipMessage({
    onConfirm = noop,
    errorCode,
    errorDoc,
    onlyrecycle = true
}) {
    return (
        <MessageDialog
            onConfirm={() => onConfirm(errorDoc.size === -1 && !errorDoc.isdir)}
        >
            <InvalidTipMessageView
                errorCode={errorCode}
                errorDoc={errorDoc}
                onlyrecycle={onlyrecycle}
            />
        </MessageDialog>
    )


}

export default InvalidTipMessage;