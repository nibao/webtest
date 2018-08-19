import * as React from 'react'
import { subscribe, EventType } from '../../../core/copy/copy'

export default class DialogBase extends React.Component<any, Components.Copy2.Dialog.State> {
    state = {
        events: []
    }

    unsubscribe: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.handleGetDestParent = this.handleGetDestParent.bind(this)
        this.copy = this.copy.bind(this)
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
     * 复制
     */
    protected copy(destParent: any) {
        const { copyTo } = this.state.events[0] as any

        copyTo(destParent)

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