import * as React from 'react'
import { OnDup, subscribe, EventType } from '../../../core/upload/upload'
import { webcomponent } from '../../../ui/decorators'

@webcomponent
export default class ExceptionsBase extends React.Component<any, any>{
    state = {
        type: -1,
        event: null,
        setDefault: false,
        ondup: OnDup.Skip
    }

    unsubscribe: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.handleUploadDup = this.handleUploadDup.bind(this)
        this.handleUploadError = this.handleUploadError.bind(this)
        this.handleUploadRuntimeError = this.handleUploadRuntimeError.bind(this)
        this.close = this.close.bind(this)
        this.confirmDup = this.confirmDup.bind(this)
        this.closeDup = this.closeDup.bind(this)
        this.confirmError = this.confirmError.bind(this)
        this.toggleOnDup = this.toggleOnDup.bind(this)
        this.toggleSetDefault = this.toggleSetDefault.bind(this)
    }

    componentWillMount() {
        this.unsubscribe = [
            subscribe(EventType.UPLOAD_DUP, this.handleUploadDup),
            subscribe(EventType.UPLOAD_ERROR, this.handleUploadError),
            subscribe(EventType.UPLOAD_RUNTIME_ERROR, this.handleUploadRuntimeError)
        ]
    }

    componentWillUnmount() {
        this.unsubscribe.forEach(f => f())
    }

    /**
     * 运行环境错误， 未安装flash
     */
    handleUploadRuntimeError(event) {
        this.setState({
            type: EventType.UPLOAD_RUNTIME_ERROR,
            event
        })
    }

    /**
     * 同名冲突
     */
    handleUploadDup(event) {
        this.setState({
            type: EventType.UPLOAD_DUP,
            event,
            setDefault: false,
            ondup: event.suggestName ? OnDup.Rename : OnDup.Cover
        })
    }

    /**
     * 上传出错
     */
    handleUploadError(event) {
        this.setState({
            type: EventType.UPLOAD_ERROR,
            event,
            setDefault: false
        })
    }

    /**
     * 关闭错误弹窗
     */
    close() {
        this.setState({
            event: null
        })
    }

    /**
     * 确认重名冲突
     */
    confirmDup() {
        const { event, ondup, setDefault } = this.state
        if (event) {
            switch (ondup) {
                case OnDup.Rename:
                    event.uploadWithSuggestName(setDefault)
                    break
                case OnDup.Cover:
                    event.cover(setDefault)
                    break
                default:
                    event.skip(setDefault)
                    break
            }
        }
        this.close()
    }

    /**
     * 关闭重名冲突对话框
     */
    closeDup() {
        if (this.state.event) {
            this.state.event.skip()
        }
        this.close()
    }

    /**
     * 确认错误弹窗
     */
    confirmError() {
        const { event, setDefault } = this.state
        if (event) {
            event.skip(setDefault)
        }
        this.close()
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
     * 切换记住选项
     */
    toggleSetDefault(setDefault) {
        this.setState({
            setDefault
        })
    }
}