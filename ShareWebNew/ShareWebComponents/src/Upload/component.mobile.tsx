import * as React from 'react'
import UploadBase from './component.base'
import Picker from './Picker/component.mobile'
import Panel from './Panel/component.mobile'
import Exceptions from './Exceptions/component.mobile'

export default class Upload extends UploadBase {
    static Picker = Picker
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