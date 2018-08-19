import * as React from 'react'
import { uploadDataTransfer } from '../../../core/upload/upload'
import { webcomponent } from '../../../ui/decorators'

@webcomponent
export default class DragArea extends React.Component<any, any>{

    constructor(props, context) {
        super(props, context)
        this.handleDrop = this.handleDrop.bind(this)
        this.handleDragOver = this.handleDragOver.bind(this)
    }

    /**
     * 拖放事件
     */
    handleDrop(e) {
        const { dest } = this.props
        uploadDataTransfer(e.dataTransfer, dest)
        e.preventDefault()
        if (typeof this.props.onDrop === 'function') {
            this.props.onDrop(e)
        }
    }

    /**
     * dragover 事件
     * @param e 
     */
    handleDragOver(e) {
        e.preventDefault()
        if (typeof this.props.onDragOver === 'function') {
            this.props.onDragOver(e)
        }
    }
}