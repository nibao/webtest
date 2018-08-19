import * as React from 'react'
import { ErrorCode } from '../../../core/apis/openapi/errorcode'
import { subscribe, EventType, OnDup } from '../../../core/rename/rename'

export default class Exceptions extends React.Component<any, any>{

    state = {
        ondup: OnDup.Check,
        events: []
    }

    events: Array<any> = []

    unbind: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.handleRenameEvent = this.handleRenameEvent.bind(this)
        this.confirm = this.confirm.bind(this)
        this.toggleOnDup = this.toggleOnDup.bind(this)
    }

    componentDidMount() {
        this.unbind = [
            subscribe(EventType.ONDUP, this.handleRenameEvent),
            subscribe(EventType.ERROR, this.handleRenameEvent)
        ]
    }

    /**
    * 切换错误处理策略
    * @param checked 
    * @param ondup 
    */
    toggleOnDup(checked, ondup) {
        this.setState({
            ondup
        })
    }

    /**
     * 
     * @param event 重命名事件处理
     */
    handleRenameEvent(event) {
        this.events = [...this.events, event]
        this.setState({
            events: this.events
        })
    }

    /**
     * 点击弹窗确认
     */
    confirm() {
        const { events: [event], ondup } = this.state
        switch (event.errcode) {
            case ErrorCode.FullnameDuplicated:
            case ErrorCode.NameDuplicatedReadonly:
            case ErrorCode.DiffTypeNameDuplicated:
                if (ondup !== OnDup.Skip) {
                    event.renameWithSuggestName()
                } else {
                    event.cancel()
                }
                this.events = this.events.slice(1)
                this.setState({
                    events: this.events,
                    ondup: OnDup.Check
                })
                break
            default:
                event.cancel()
                this.events = this.events.slice(1)
                this.setState({
                    events: this.events,
                    ondup: OnDup.Check
                })
                break
        }
    }
}