import * as React from 'react'
import DetailBase from './component.base'
import DocProperties from '../../DocProperties/component.desktop'

export default class Detail extends DetailBase {
    render() {
        return (
            <DocProperties
                docs={this.props.docs}
                parent={this.props.parent}
                onTagClick={this.props.onTagClick}
                doRevisionView={this.props.doRevisionView}
                doRevisionRestore={this.props.doRevisionRestore}
                doRevisionDownload={this.props.doRevisionDownload}
                doApprovalCheck={this.props.doApprovalCheck}
            />
        )
    }
}