import * as React from 'react';
import Button from '../../../ui/Button/ui.desktop';

export default function View({ active = true, onSwitch, onClose }) {
    return (
        <div>
            <Button onClick={() => onSwitch(!active)}>Switch</Button>
            <Button onClick={() => onClose()}>Close</Button>
        </div>
    )
}