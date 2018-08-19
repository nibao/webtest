import * as React from 'react';
import Revision from './Revision/component.client'
import RevisionsBase from './component.base';

export default class Revisions extends RevisionsBase {

    render() {
        return (
            <div>
                {
                    this.state.revisions.map(revision => (
                        <Revision
                            key={revision.rev}
                            doc={this.props.doc}
                            revision={revision}
                            doRevisionView={this.revisionView.bind(this, { ...this.props.doc, name: revision.name, rev: revision.rev })}
                            doRevisionRestore={this.props.doRevisionRestore}
                        />
                    ))
                }
            </div>
        )

    }

}