import * as React from 'react';
import { MessageType } from '../../../core/message/message';
import ShareMsgs from './ShareMsgs/component.desktop';
import CheckMsgs from './CheckMsgs/component.client';
import SecurityMsgs from './SecurityMsgs/component.desktop';

export default function RenderMsgs({ showMsgType, msgs, onRead, doPreview, doRedirect, doCheck, csfSysId, csfTextArray, resultMessage, showResultDialog, closeResultDialog }) {
    switch (showMsgType) {
        case MessageType.Share:
            return (
                <ShareMsgs
                    msgs={msgs}
                    onRead={onRead}
                    doPreview={doPreview}
                    doRedirect={doRedirect}
                    csfSysId={csfSysId}
                    csfTextArray={csfTextArray}
                />
            );
        case MessageType.Check:
            return (
                <CheckMsgs
                    msgs={msgs}
                    onRead={onRead}
                    doPreview={doPreview}
                    doCheck={doCheck}
                    showResultDialog={showResultDialog}
                    closeResultDialog={closeResultDialog}
                    doRedirect={doRedirect}
                    csfSysId={csfSysId}
                    csfTextArray={csfTextArray}
                    resultMessage={resultMessage}
                />
            )
        case MessageType.Security:
            return (
                <SecurityMsgs
                    msgs={msgs}
                    onRead={onRead}
                    doPreview={doPreview}
                    doCheck={doCheck}
                    doRedirect={doRedirect}
                    showResultDialog={showResultDialog}
                    csfSysId={csfSysId}
                    csfTextArray={csfTextArray}
                />
            )
        default:
            return null;
    }
}