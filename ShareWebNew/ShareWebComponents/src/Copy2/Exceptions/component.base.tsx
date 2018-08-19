import * as React from 'react'
import { subscribe, EventType } from '../../../core/copy/copy'

export default class ExceptionsBase extends React.Component<any, Components.Copy2.Exceptions.State> {
    state = {
        events: []
    }

    unsubscribe: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.handleCopyEvent = this.handleCopyEvent.bind(this)
        this.confirm = this.confirm.bind(this)
        this.break = this.break.bind(this)
    }

    componentWillMount() {
        this.unsubscribe = [
            subscribe(EventType.Error, this.handleCopyEvent)
        ]
    }

    componentWillUnmount() {
        this.unsubscribe.forEach(f => f())
    }

    /**
     * 移动事件处理
     */
    protected handleCopyEvent(event: any) {
        this.setState({
            events: [...this.state.events, event]
        })
    }

    /**
     * 点击弹窗确认
     * @param setDefault true -- 不再提示(相当于跳过)
     */
    protected confirm(setDefault = false) {
        const { events: [event] } = this.state as any

        event.cancel(setDefault)

        this.setState({
            events: this.state.events.slice(1)
        })
    }

    /**
     * 中断
     */
    protected break() {
        const { events: [event] } = this.state as any

        event.break()

        this.setState({
            events: this.state.events.slice(1)
        })
    }
}