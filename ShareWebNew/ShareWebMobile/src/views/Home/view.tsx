import * as React from 'react'
import Upload from '../../../components/Upload/component.mobile'

const HomeView: React.StatelessComponent<any> = function ({
    children
}) {
    return (
        <div>
            {
                children
            }
            <Upload swf={'/libs/webuploader/dist/Uploader.swf'} />
        </div>
    )
}

export default HomeView