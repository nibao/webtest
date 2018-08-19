import * as React from 'react'
import SetCSFBase from './component.base'
import Dialog from '../../../ui/Dialog2/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';

export default class SetCSF extends SetCSFBase {
    render() {
        const { open } = this.state
        if (open) {
            return (
                <Dialog>
                    
                </Dialog>
            )
        }
    }
}