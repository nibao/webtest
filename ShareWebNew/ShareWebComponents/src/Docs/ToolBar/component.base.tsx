import * as React from 'react'
import { noop } from 'lodash'
import { runtime } from '../../../core/upload/upload'
import { userAgent, Browser } from '../../../util/browser/browser'

export default class ToolBarBase extends React.Component<any, any>{
    static defaultProps = {
        selections: [],
        onToggleSelectAll: noop
    }

    static contextTypes = {
        toast: React.PropTypes.any
    }

    state = {
        canUploadDirectory: false
    }

    async componentWillMount() {
        const { app, version } = userAgent()
        this.setState({
            canUploadDirectory: (await runtime) === 'html5' && (
                app === Browser.Chrome ||
                app === Browser.Edge ||
                app === Browser.Firefox && version && version > 50
            )
        })
    }
}