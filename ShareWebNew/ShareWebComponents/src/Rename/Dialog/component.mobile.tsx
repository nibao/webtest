import * as React from 'react'
import RenameDialogBase from './component.base'
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.mobile'
import TextBox from '../../../ui/TextBox/ui.mobile'
import { splitName } from '../../../core/extension/extension'
import { docname } from '../../../core/docs/docs'
import * as styles from './styles.mobile.css'
import __ from './locale'

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
                    <div className={styles['create-folder']}>
                        {__('重命名')}
                    </div>
                    <TextBox
                        className={styles['text-box']}
                        width={245}
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