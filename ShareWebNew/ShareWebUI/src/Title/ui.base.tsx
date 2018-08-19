import * as React from 'react'
import { getContextWindow } from '../decorators'

@getContextWindow
export default class Title extends React.Component<UI.Title.Props, any>{

    static defaultProps = {
        timeout: 300,
        content: ''
    }

    state = {
        open: false,
        position: [0, 0],
        width: 'auto',
        whiteSpace: 'nowrap',
        wordBreak: 'normal'
    }

    timer

    constructor(props, context) {
        super(props, context)
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
    }

    getContextWindow: () => Window

    handleMouseEnter(e) {
        const position = [e.clientX, e.clientY + 20]
        if (this.props.content) {
            this.timer = setTimeout(() => {
                this.setState({
                    open: true,
                    position
                })
            }, this.props.timeout)
        }
    }

    handleMouseLeave() {
        clearTimeout(this.timer)
        this.setState({
            open: false,
            width: 'auto',
            whiteSpace: 'nowrap',
            wordBreak: 'normal'
        })
    }
}