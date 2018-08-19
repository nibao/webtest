import * as React from 'react'
import { Dialog2 as Dialog } from '../../../ui/ui.client'
import ConfigView from './component.view'
import __ from './locale'

const Config: React.StatelessComponent<TagEditor.Config.ClientProps> = ({
    ...otherProps
}) => {
    return (
        <Dialog
            width={436}
            title={__('编辑标签')}
            >
            <ConfigView
                platform={'client'}
                { ...otherProps }
                />
        </Dialog>
    )
}

export default Config