import * as React from 'react';
import { noop } from 'lodash';
import MessageDialog from '../../ui/MessageDialog/ui.client';
import NWWindow from '../../ui/NWWindow/ui.client';
import InvalidTipMessageView from './component.view';
import __ from './locale';

const InvalidTipMessage: React.StatelessComponent<Components.InvalidTipMessage.Props> = function InvalidTipMessage({
    onConfirm = noop,
    errorCode,
    errorDoc,
    onlyrecycle = true
}) {
    return (
        <NWWindow
            onOpen={nwWindow => this.nwWindow = nwWindow}
            modal={true}
            title={__('提示')}
            onClose={() => onConfirm(errorDoc.size === -1 && !errorDoc.isdir)}
        >
            {
                errorCode ?
                    <MessageDialog
                        onConfirm={() => onConfirm(errorDoc.size === -1 && !errorDoc.isdir)}
                    >
                        <InvalidTipMessageView
                            errorCode={errorCode}
                            errorDoc={errorDoc}
                            onlyrecycle={onlyrecycle}
                        />
                    </MessageDialog>
                    :
                    <MessageDialog
                        onConfirm={() => onConfirm(errorDoc.size === -1 && !errorDoc.isdir)}
                    >
                        <p>{__('网络连接失败')}</p>
                    </MessageDialog>
            }
        </NWWindow>
    )
}

export default InvalidTipMessage;