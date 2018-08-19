import * as React from 'react'
import Dialog from './Dialog/component.mobile'
import Exceptions from './Exceptions/component.mobile'

const CreateDir: React.StatelessComponent<any> = function () {
    return (
        <div>
            <Dialog />
            <Exceptions />
        </div>
    )
}

export default CreateDir