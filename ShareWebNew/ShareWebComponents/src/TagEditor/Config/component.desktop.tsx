import * as React from 'react'
import { noop } from 'lodash'
import { Dialog2 as Dialog } from '../../../ui/ui.desktop'
import ConfigView from './component.view'
import __ from './locale'

const Config: React.StatelessComponent<TagEditor.Config.DesktopProps> = ({
    onCloseDialog = noop,
    ...otherProps
}) => {
    return (
        <Dialog
            title={__('编辑标签')}
            width={436}
            onClose={onCloseDialog}
            >
            <ConfigView
                platform={'desktop'}
                { ...otherProps }
                />
        </Dialog>
    )
}

export default Config