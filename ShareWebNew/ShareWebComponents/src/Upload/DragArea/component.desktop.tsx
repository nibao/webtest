import * as React from 'react'
import DragAreaBase from './component.base'

export default class DragArea extends DragAreaBase {
    render() {
        return (
            <div
                {...this.props}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
            />
        )
    }
}