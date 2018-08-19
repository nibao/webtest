import * as React from 'react'
import { EventType, subscribe, trigger } from '../../core/download/download'
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { webcomponent } from '../../ui/decorators'

@webcomponent
export default class DownloadBase extends React.Component<Components.Download2.Props, any>{

    static defaultProps = {
        doc: [],
        saveName: ''
    }

    state = {
        url: ''
    }

    /**
     * unsubscribe 事件处理 handler
     */
    unsubscribe: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.handleDownloadSuccess = this.handleDownloadSuccess.bind(this)
        this.handleDownloadError = this.handleDownloadError.bind(this)
    }

    componentWillMount() {
        this.unsubscribe = [
            subscribe(EventType.DOWNLOAD_SUCCESS, this.handleDownloadSuccess),
            subscribe(EventType.DOWNLOAD_ERROR, this.handleDownloadError)
        ]
    }

    componentWillUnmount() {
        this.unsubscribe.forEach(fn => fn())
    }

    /**
     * 下载成功
     */
    handleDownloadSuccess(url) {
        if (typeof this.props.onGetURLSuccess === 'function') {
            this.props.onGetURLSuccess(url)
        } else {
            this.setState({
                url
            })
        }
    }

    /**
     * 下载失败
     */
    handleDownloadError(e) {
        if (typeof this.props.onGetURLError === 'function') {
            this.props.onGetURLError(e)
        }
    }


    /**
     * 处理下载过程中的错误
     * @param e 
     */
    protected handleError(e) {
        try {
            const errObj = JSON.parse(e.target.contentWindow.document.body.innerText)
            const { errcode } = errObj

            switch (errcode) {
                // 没有下载权限
                case ErrorCode.PermissionRestricted:
                // 外链密码不正确
                case ErrorCode.LinkAuthFailed:
                // 外链不存在
                case ErrorCode.LinkInaccessable:
                    trigger(
                        EventType.DOWNLOAD_ERROR,
                        null,
                        { errcode }
                    )

                    break
            }
        }
        catch (err) {
        }
    }
}