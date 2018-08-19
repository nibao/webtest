import * as React from 'react';
import { getErrorMessage } from '../../core/errcode/errcode';
import Overlay from '../../ui/Overlay/ui.desktop';

export default function ErrorOverlay({ error }) {
    return (
        <Overlay position="top center">
            {
                error.errcode === 500001 ? error.causemsg : getErrorMessage(error.errcode)
            }
        </Overlay >
    )
}