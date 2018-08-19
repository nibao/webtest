import * as React from 'react'
import RenameBase from './component.base'
import Dialog from './Dialog/component.mobile'
import Exceptions from './Exceptions/component.mobile'

export default class Rename extends RenameBase {
    render() {
        return (
            <div>
                <Dialog />
                <Exceptions />
            </div>
        )
    }
}