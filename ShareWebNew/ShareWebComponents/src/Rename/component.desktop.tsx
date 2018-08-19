import * as React from 'react'
import RenameBase from './component.base'
import Dialog from './Dialog/component.desktop'
import Exceptions from './Exceptions/component.desktop'

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