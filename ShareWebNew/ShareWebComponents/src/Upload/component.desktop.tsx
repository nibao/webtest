import * as React from 'react'
import UploadBase from './component.base'
import DragArea from './DragArea/component.desktop'
import Picker from './Picker/component.desktop'
import Panel from './Panel/component.desktop'
import Exceptions from './Exceptions/component.desktop'

export default class Upload extends UploadBase {
    static Picker = Picker
    static DragArea = DragArea
    static Panel = Panel
    static Exceptions = Exceptions

    render() {
        return (
            <div>
                <Panel />
                <Exceptions />
            </div>
        )
    }
}