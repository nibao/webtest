import * as React from 'react'
import { subscribe, EventType } from '../../../core/move/move'

export default class ExceptionsBase extends React.Component<any, Components.Move2.Exceptions.State> {
    state = {
        events: [],

        checked: false
    }

    unsubscribe: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.handleMoveEvent = this.handleMoveEvent.bind(this)
        this.cancel = this.cancel.bind(this)
        this.break = this.break.bind(this)
        this.move = this.move.bind(this)
    }

    componentWillMount() {
        this.unsubscribe = [
            subscribe(EventType.Error, this.handleMoveEvent)
        ]
    }

    componentWillUnmount() {
        this.unsubscribe.forEach(f => f())
    }

    /**
     * 移动事件处理
     */
    protected handleMoveEvent(event: any) {
        this.setState({
            events: [...this.state.events, event]
        })
    }

    /**
     * 点击弹窗确认
     * @param setDefault true -- 不再提示(相当于跳过)
     */
    protected cancel(setDefault = false) {
        const { events: [event] } = this.state as any

        event.cancel(setDefault)

        this.close()
    }

    /**
     * 中断
     */
    protected break() {
        const { events: [event] } = this.state as any

        event.break()

        this.close()
    }

    /**
     * 继续移动
     */
    protected move(setDefault: boolean = false) {
        const { events: [event] } = this.state as any

        event.move(setDefault)

        this.close()
    }

    protected toggleChecked() {
        this.setState({
            checked: !this.state.checked
        })
    }

    private close() {
        const { events: [event] } = this.state as any

        this.setState({
            events: this.state.events.slice(1),
            checked: false
        })
    }
}