import * as React from 'react'
import { subscribe, EventType } from '../../../core/move/move'

export default class DialogBase extends React.Component<any, Components.Move2.Dialog.State> {
    state = {
        events: []
    }

    unsubscribe: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.handleGetDestParent = this.handleGetDestParent.bind(this)
        this.move = this.move.bind(this)
        this.cancel = this.cancel.bind(this)
    }

    componentWillMount() {
        this.unsubscribe = [
            subscribe(EventType.GetDest, this.handleGetDestParent)
        ]
    }

    componentWillUnmount() {
        this.unsubscribe.forEach(f => f())
    }

    protected handleGetDestParent(event: any) {
        this.setState({
            events: [...this.state.events, event]
        })
    }

    /**
     * 移动
     */
    protected move(destParent: any) {
        const { moveTo } = this.state.events[0] as any

        moveTo(destParent)

        this.close()
    }

    /**
     * 取消复制
     */
    protected cancel() {
        const { cancel } = this.state.events[0] as any

        cancel()
        this.close()
    }

    private close() {
        this.setState({
            events: this.state.events.slice(1)
        })
    }
}