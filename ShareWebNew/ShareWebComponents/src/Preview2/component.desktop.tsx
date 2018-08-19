import * as React from 'react'
import PreviewView from './component.view'
import { webcomponent } from '../../ui/decorators'

@webcomponent
export default class Preview extends React.Component<any, any>{
    render() {
        const {
            doc,
            doSaveTo,
            doDownload,
            doInnerShareLink,
            doOuterShareLink,
            doRevisionRestore,
            illegalContentQuarantine,
            onPathChange,
            onCheckLogin,
            onLoginSuccess,
            ...otherProps
        } = this.props
        return (
            <PreviewView
                doc={doc}
                doSaveTo={doSaveTo}
                doDownload={doDownload}
                doInnerShareLink={doInnerShareLink}
                doOuterShareLink={doOuterShareLink}
                doRevisionRestore={doRevisionRestore}
                illegalContentQuarantine={illegalContentQuarantine}
                onPathChange={onPathChange}
                onCheckLogin={onCheckLogin}
                onLoginSuccess={onLoginSuccess}
                {...otherProps}
            />
        )
    }
}