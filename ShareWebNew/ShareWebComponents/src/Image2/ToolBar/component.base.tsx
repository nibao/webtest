import *  as React from 'react'
import { findDOMNode } from 'react-dom'
import { timer } from '../../../util/timer/timer'
import { bindEvent, unbindEvent } from '../../../util/browser/browser'

export default class ToolBar extends React.Component<any, any>{

    constructor(props, context) {
        super(props, context)
        this.zoomIn = this.zoomIn.bind(this)
        this.zoomOut = this.zoomOut.bind(this)
    }

    /**
     * 放大
     */
    zoomIn() {
        this.zoom(0.1)
    }

    /**
     * 缩小
     */
    zoomOut() {
        this.zoom(-0.1)
    }

    /**
     * 缩放
     * @param step 
     */
    zoom(step) {
        this.props.onZoom(this.props.zoom + step)
    }
}