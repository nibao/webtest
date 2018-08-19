import * as React from 'react'
import { subscribe, EventType } from '../../../core/createdir/createdir'

export default class ExceptionsBase extends React.Component<any, Components.CreateDir.Exceptions.State> {

    state = {
        events: []
    }

    unsubscribe: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.handleCreateDirEvent = this.handleCreateDirEvent.bind(this)
        this.confirm = this.confirm.bind(this)
    }

    componentDidMount() {
        this.unsubscribe = [
            subscribe(EventType.Error, this.handleCreateDirEvent)
        ]
    }

    componentWillUnmount() {
        this.unsubscribe.forEach(f => f())
    }

    /**
     * 
     * @param event 重命名事件处理
     */
    private handleCreateDirEvent(event: any) {
        this.setState({
            events: [...this.state.events, event]
        })
    }

    /**
     * 点击弹窗确认
     */
    protected confirm() {
        const { events: [event] } = this.state as any

        event.cancel()

        this.setState({
            events: this.state.events.slice(1)
        })
    }
}