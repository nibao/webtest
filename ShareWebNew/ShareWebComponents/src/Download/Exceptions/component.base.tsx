import * as React from 'react'
import { noop } from 'lodash'
import { ErrorCode, subscribe, EventType } from '../../../core/download/download'
import { ErrorCode as ErrCode } from '../../../core/apis/openapi/errorcode'
import __ from './locale'

export default class Exceptions extends React.Component<any, any>{

    state = {
        error: null,
        close: noop
    }

    /**
     * unbind 下载事件
     */
    unsubscribe: () => void

    /**
     * 事件处理 Promise
     */
    exceptionPromise = Promise.resolve()

    static contextTypes = {
        toast: React.PropTypes.func
    }

    constructor(props, context) {
        super(props, context)
        this.handleDownloadError = this.handleDownloadError.bind(this)
    }

    componentDidMount() {
        this.unsubscribe = subscribe(EventType.DOWNLOAD_ERROR, this.handleDownloadError)
    }

    componentWillUnmount() {
        if (typeof this.unsubscribe === 'function') {
            this.unsubscribe()
        }
    }

    /**
     * 下载错误处理
     */
    async handleDownloadError(error) {
        switch (error.errcode) {
            case ErrorCode.WATERMARK_NOT_SUPPORT:
                if (typeof this.context.toast === 'function') {
                    this.context.toast(__('不支持当前格式的文件下载'))
                }
                break
            case ErrorCode.MAKING_WATERMARK:
            case ErrorCode.WAITING_WATERMARK:
                if (typeof this.context.toast === 'function') {
                    this.context.toast(__('正在制作水印，请稍后...'))
                }
                break

            // 外链关闭，外链密码变更，不处理
            case ErrCode.LinkInaccessable:
            case ErrCode.LinkAuthFailed:
                break

            default:
                this.exceptionPromise = this.exceptionPromise.then(() => {
                    return new Promise(resolve => {
                        this.setState({
                            error,
                            close: resolve
                        })
                    }).then(() => {
                        this.setState({
                            error: null
                        })
                    })
                })
        }
    }
}