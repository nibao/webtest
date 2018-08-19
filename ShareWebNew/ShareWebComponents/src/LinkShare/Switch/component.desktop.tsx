import * as React from 'react';
import Button from '../../../ui/Button/ui.desktop';
import { Status } from '../helper';
import __ from './locale';

export default function Switch({ status, enableLinkAccessCode, onSwitch, opening,
    closing }) {
    if (enableLinkAccessCode) {
        return status === Status.OPEN ?
            (
                <Button onClick={() => onSwitch(false)} disabled={closing}>{__('关闭提取码')}</Button>
            ) :
            (
                <Button onClick={() => onSwitch(true)} disabled={opening}>{__('启用提取码')}</Button>
            )

    } else {
        return status === Status.OPEN ?
            (
                <Button onClick={() => onSwitch(false)} disabled={closing}>{__('关闭链接')}</Button>
            ) :
            (
                <Button onClick={() => onSwitch(true)} disabled={opening}>{__('开启链接')}</Button>
            )
    }
}