import * as React from 'react'
import { trim } from 'lodash'
import { subscribe, EventType } from '../../../core/createdir/createdir'

/**
 * 前端检测的错误
 */
export enum ErrorCode {
    /**
     * 文件夹名称不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符
     */
    NameInvalid = 1,

    /**
     * 文件夹名称以.结尾
     */
    NameEndWithDot = 2,

    /**
     * 文件名为空
     */
    EmptyName = 3
}

export default class DialogBase extends React.Component<any, Components.CreateDir.Dialog.State> {
    state = {
        events: [],
        value: '',
        errCode: 0
    }

    unsubscribe: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.updateValue = this.updateValue.bind(this)
        this.handleGetNewName = this.handleGetNewName.bind(this)
        this.cancel = this.cancel.bind(this)
        this.confirm = this.confirm.bind(this)
    }

    componentWillMount() {
        this.unsubscribe = [
            subscribe(EventType.GetNewName, this.handleGetNewName)
        ]
    }

    componentWillUnmount() {
        this.unsubscribe.forEach(f => f())
    }

    /**
     * 获取文件名事件处理函数
     * @param event 
     */
    private handleGetNewName(event: any) {
        this.setState({
            events: [...this.state.events, event],
            value: ''
        })
    }

    /**
     * 更新输入框
     * @param value 
     */
    protected updateValue(value: string) {
        this.setState({
            value
        })
    }

    /**
     * 取消重命名
     */
    protected cancel() {
        const { cancel } = this.state.events[0] as any

        cancel()
        this.close()
    }

    /**
     * 确认重命名
     */
    protected confirm() {
        this.close()

        const { createDir, cancel } = this.state.events[0] as any

        const name = trim(this.state.value)
        const errCode = this.checkName(name)

        if (!errCode) {
            // 重命名
            createDir(name)
        } else {
            // 取消重命名，弹出对应的错误（前端检测的错误）
            cancel()

            this.setState({
                errCode
            })
        }
    }

    /**
     * 关闭弹窗
     */
    private close() {
        this.setState({
            value: '',
            events: this.state.events.slice(1)
        })
    }

    /**
     * 检测输入字符是否合法
     * @param name 
     * @returns 返回错误码
     */
    private checkName(name: string): number {
        // 文件名为空
        if (!name) {
            return ErrorCode.EmptyName
        }

        // 文件夹名称不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符。
        if (!(/^[^\\/:*?"<>|]{0,244}$/.test(name))) {
            return ErrorCode.NameInvalid
        }

        // 文件名以.结尾
        if (/\.$/.test(name)) {
            return ErrorCode.NameEndWithDot
        }

        return 0
    }

    /**
     * 清空错误
     */
    protected clearErrcode() {
        this.setState({ errCode: 0 })
    }
}