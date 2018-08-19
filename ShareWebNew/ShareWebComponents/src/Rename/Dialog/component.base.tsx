import * as React from 'react'
import { docname } from '../../../core/docs/docs'
import { subscribe, EventType } from '../../../core/rename/rename'

export default class RenameDialog extends React.Component<any, any>{
    state = {
        events: [],
        value: ''
    }

    events: Array<any> = []
    unsubscribe: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.updateValue = this.updateValue.bind(this)
        this.handleGetNewName = this.handleGetNewName.bind(this)
        this.cancel = this.cancel.bind(this)
        this.confirm = this.confirm.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    componentWillMount() {
        this.unsubscribe = [
            subscribe(EventType.GET_NEW_NAME, this.handleGetNewName)
        ]
    }

    componentWillUnmount() {
        this.unsubscribe.forEach(f => f())
    }

    /**
     * 获取文件名事件处理函数
     * @param event 
     */
    handleGetNewName(event) {
        this.events = [...this.events, event]
        this.setState({
            events: this.events,
            value: this.events.length === 1 ? docname(this.events[0].target) : ''
        })
    }

    /**
     * 更新输入框
     * @param value 
     */
    updateValue(value) {
        this.setState({
            value
        })
    }

    /**
     * 取消重命名
     */
    cancel() {
        const { cancel } = this.state.events[0] as any
        cancel()
        this.close()
    }

    /**
     * 确认重命名
     */
    confirm() {
        const { setNewName } = this.state.events[0] as any
        setNewName(this.state.value)
        this.close()
    }

    /**
     * 关闭弹窗
     */
    close() {
        const [event, ...restEvents] = this.events
        this.events = restEvents
        this.setState({
            value: event ? docname(event.target) : '',
            events: this.events
        })
    }    
    
    /**
    * 回车触发confirm
    */
   handleKeyDown(e) {
       if (e.keyCode === 13) {
           this.confirm()
       }
   }
}