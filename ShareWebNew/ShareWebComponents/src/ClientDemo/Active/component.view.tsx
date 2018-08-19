import * as React from 'react';
import Panel from '../../../ui/Panel/ui.desktop';

export default function View({ onConfirm }) {
    return (
        <Panel>
            <Panel.Main>
                This is sub component Active
            </Panel.Main>
            <Panel.Footer>
                <Panel.Button onClick={onConfirm}>OK</Panel.Button>
            </Panel.Footer>
        </Panel>
    )
}