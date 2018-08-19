import * as React from 'react'
import RenameDialogBase from './component.base'
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop'
import TextBox from '../../../ui/TextBox/ui.desktop'
import { splitName } from '../../../core/extension/extension'
import { docname } from '../../../core/docs/docs'

export default class RenameDialog extends RenameDialogBase {
    render() {
        const { value, events: [event] } = this.state
        if (event) {
            const { target } = event as any
            return (
                <ConfirmDialog
                    onConfirm={this.confirm}
                    onCancel={this.cancel}
                >
                    <TextBox
                        style={{ lineHeight: 'normal' }}
                        value={value}
                        autoFocus={true}
                        selectOnFocus={[0, splitName(docname(target))[0].length]}
                        onChange={this.updateValue}
                        onKeyDown={this.handleKeyDown}
                    />
                </ConfirmDialog>
            )
        }
        return null
    }
}