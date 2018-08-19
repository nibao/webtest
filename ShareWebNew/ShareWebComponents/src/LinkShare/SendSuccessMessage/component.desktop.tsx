import * as React from 'react';
import Overlay from '../../../ui/Overlay/ui.desktop';
import __ from './locale';

export default function SendSuccessMessage() {
    return (
        <Overlay position="top center">
            { __('发送成功') }
        </Overlay>
    )
}