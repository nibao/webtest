import * as React from 'react'
import { docname } from '../../../core/docs/docs'
import { trim } from 'lodash'

export enum Type {
    NameInvalid = 1,      // 文件夹名称不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符
    NameEndWithDot = 2,   // 文件夹名称以.结尾
}

export default class Form extends React.Component<any, any>{
    state = {
        value: '',
        error: null
    }

    constructor(props, context) {
        super(props, context)
        this.confirm = this.confirm.bind(this)
        this.cancel = this.cancel.bind(this)
        this.updateValue = this.updateValue.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        const { doc } = this.props
        this.state = {
            value: docname(doc),
            error: null
        }
    }

    /**
     * 输入
     * @param value 
     */
    updateValue(value) {
        this.setState({
            value
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

    /**
     * 确认
     */
    async confirm() {
        const { onConfirm } = this.props
        const { value } = this.state

        if (value) {
            // 前端检测文件名是否合法
            const type = this.checkName(value)

            if (type) {
                await new Promise(resolve => {
                    this.setState({
                        error: {
                            type,
                            resolve
                        }
                    })
                })
                this.setState({
                    error: null
                })

                return
            }

            if (typeof onConfirm === 'function') {
                onConfirm(trim(value))
            }
        }
    }

    /**
     * 取消
     */
    cancel() {
        if (typeof this.props.onCancel === 'function') {
            this.props.onCancel()
        }
    }

    /**
     * 检测输入字符是否合法
     * @param name 
     * @returns 返回错误码
     */
    private checkName(name: string): number {
        // 文件夹名称不能包含下列字符：\\ / : * ? " < > |，且长度不能大于244个字符。
        if (!(/^[^\\/:*?"<>|]{0,244}$/.test(name))) {
            return Type.NameInvalid
        }

        // 文件名以.结尾
        if (/\.$/.test(name)) {
            return Type.NameEndWithDot
        }

        return 0
    }
}