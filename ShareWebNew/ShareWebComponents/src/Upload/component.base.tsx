import * as React from 'react'
import { upload, init, EventType, subscribe } from '../../core/upload/upload'
import { isIE8 } from '../../util/browser/browser'
import { webcomponent } from '../../ui/decorators'

@webcomponent
export default class Upload extends React.Component<any, any>{

    static defaultProps = {
        swf: '',
        /**
         * 默认上传大小限制为1G, ie8 为 100M，
         */
        fileSizeLimit: isIE8() ? 1024 * 1024 * 100 : 1024 * 1024 * 1024
    }

    /**
     * 绑定的事件
     */
    unsubscribe: Array<() => void> = []

    constructor(props, context) {
        super(props, context)
        this.handleFilesQueued = this.handleFilesQueued.bind(this)
    }

    componentWillMount() {
        this.unsubscribe = [
            subscribe(EventType.UPLOAD_FILES_QUEUED, this.handleFilesQueued)
        ]
    }

    componentDidMount() {
        const { swf, fileSizeLimit } = this.props
        init({ swf, fileSizeLimit })
    }

    componentWillUnmount() {
        this.unsubscribe.forEach(f => f())
    }

    /**
     * 文件入队开始上传
     */
    handleFilesQueued() {
        upload()
    }
}