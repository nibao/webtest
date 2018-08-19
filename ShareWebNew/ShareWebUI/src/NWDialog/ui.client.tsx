import * as React from 'react';
import { isFunction } from 'lodash';
import Dialog from '../Dialog2/ui.client';

/**
 * 外框多出的宽度
 */
const FrameWidth = window.outerWidth - window.innerWidth

/**
 * 外框多出的高度
 */
const FrameHeight = window.outerHeight - window.innerHeight


const NWDialog: React.StatelessComponent<UI.NWDialog.Props> = function NWDialog({ onResize, children, ...otherProps }) {
    return (
        <Dialog
            onResize={({ width, height }) => isFunction(onResize) && onResize(width, height)}
        >
            {
                children
            }
        </Dialog>
    )
}

export default NWDialog