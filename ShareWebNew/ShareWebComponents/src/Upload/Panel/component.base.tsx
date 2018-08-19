import * as React from 'react'
import { cancel, reset, stop, upload, FileStatus, retry, getFiles, runtime, subscribe, EventType } from '../../../core/upload/upload'
import { webcomponent } from '../../../ui/decorators'

export enum Status {
    Inited,
    Preparing,
    Progress,
    Finished
}

@webcomponent
export default class Panel extends React.Component<any, any> {

    state = {
        files: [],
        percentage: 0,
        speed: 0,
        uploaded: 0,
        minimized: true,
        open: false,
        status: Status.Inited,
        deferredClose: null,
        fileStatus: {},
        uploadCount: 0,
        errorCount: 0,
        completedCount: 0
    }

    /**
     * 
     */
    files: Array<any> = []
    currentFile = null

    /**
     * 
     */
    unsubscribe: Array<() => void> = []

    minimizeWhenFinished = true

    constructor(props, context) {
        super(props, context)

        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)

        this.handleClose = this.handleClose.bind(this)
        this.toggleMinimize = this.toggleMinimize.bind(this)
        this.togglePanel = this.togglePanel.bind(this)

        this.handleParseDirStart = this.handleParseDirStart.bind(this)
        this.handleParseDirEnd = this.handleParseDirEnd.bind(this)
        this.handleFilesQueued = this.handleFilesQueued.bind(this)
        this.handleFileDeQueued = this.handleFileDeQueued.bind(this)
        this.handleFileCanceled = this.handleFileCanceled.bind(this)
        this.handleUploadStart = this.handleUploadStart.bind(this)
        this.handleUploadBeforeSend = this.handleUploadBeforeSend.bind(this)
        this.handleUploadProgress = this.handleUploadProgress.bind(this)
        this.handleUploadComplete = this.handleUploadComplete.bind(this)
        this.handleUploadFinished = this.handleUploadFinished.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.cancelAll = this.cancelAll.bind(this)
        this.clearCompleted = this.clearCompleted.bind(this)
    }

    componentWillMount() {
        this.unsubscribe = [
            subscribe(EventType.UPLOAD_FILES_QUEUED, this.handleFilesQueued),
            subscribe(EventType.UPLOAD_FILE_DEQUEUED, this.handleFileDeQueued),
            subscribe(EventType.UPLOAD_FILE_CANCELED, this.handleFileCanceled),
            subscribe(EventType.UPLOAD_START, this.handleUploadStart),
            subscribe(EventType.UPLOAD_BEFORE_SEND, this.handleUploadBeforeSend),
            subscribe(EventType.UPLOAD_PROGRESS, this.handleUploadProgress),
            subscribe(EventType.UPLOAD_COMPLETE, this.handleUploadComplete),
            subscribe(EventType.UPLOAD_PAESR_DIR_START, this.handleParseDirStart),
            subscribe(EventType.UPLOAD_PAESR_DIR_END, this.handleParseDirEnd),
            subscribe(EventType.UPLOAD_FINISHED, this.handleUploadFinished),
            subscribe(EventType.UPLOAD_RESET, this.handleReset)
        ]
    }

    componentWillUnmount() {
        this.unsubscribe.forEach(fn => fn())
    }

    /**
     * 鼠标移入
     */
    handleMouseEnter() {
        this.minimizeWhenFinished = false
    }

    /**
     * 鼠标移出
     */
    handleMouseLeave() {
        this.minimizeWhenFinished = true
    }

    /**
     * 开始解析上传目录
     */
    handleParseDirStart() {
        this.setState({
            status: Status.Preparing,
            files: this.files
        })
        if (!this.state.open) {
            this.setState({
                open: true
            })
        }
        if (this.state.minimized) {
            setTimeout(this.toggleMinimize, 1)
        }
    }

    /**
     * 目录创建完成
     */
    handleParseDirEnd() {
        this.setState({
            status: Status.Progress
        })
    }

    /**
     * 文件进入队列
     */
    async handleFilesQueued() {
        if ((await runtime) === 'flash') {
            if (!this.state.open) {
                this.setState({
                    open: true
                })
            }
            if (this.state.minimized) {
                setTimeout(this.toggleMinimize, 1)
            }
        }
        this.updateUploadStatus()
    }

    /**
     * 文件移除队列
     */
    handleFileDeQueued() {
        this.updateUploadStatus()
    }

    /**
     * 文件上传取消
     */
    handleFileCanceled() {
        this.updateUploadStatus()
    }

    /**
     * 开始上传
     */
    handleUploadStart() {
        this.setState({
            status: Status.Progress
        })
        this.updateUploadStatus()
    }

    /**
     * 
     */
    handleUploadBeforeSend() {
        this.updateUploadStatus()
    }

    /**
     * 文件上传进度
     * @param param0 
     */
    handleUploadProgress({ percentage, speed, uploaded }) {
        this.setState({
            percentage,
            speed,
            uploaded
        })
    }

    /**
     * 文件上传完成
     */
    handleUploadComplete() {
        this.setState({
            percentage: 0,
            speed: 0,
            uploaded: 0
        })
        this.updateUploadStatus()
    }

    /**
     * 所有文件上传完成
     */
    handleUploadFinished() {
        this.setState({
            status: Status.Finished,
            minimized: this.minimizeWhenFinished
        })
        this.updateUploadStatus()
    }

    /**
     * 更新上传状态
     */
    async updateUploadStatus() {
        let fileStatus = {}, uploadCount = 0, errorCount = 0, completedCount = 0

        this.files = await getFiles(
            FileStatus.Inited,
            FileStatus.Queued,
            FileStatus.Progress,
            FileStatus.Completed,
            FileStatus.Error,
            FileStatus.Interrupt,
            FileStatus.Invalid
        )

        this.files.forEach(file => {
            const status = file.getStatus()
            fileStatus[file.id] = status
            switch (status) {
                case FileStatus.Inited:
                case FileStatus.Queued:
                case FileStatus.Progress:
                    uploadCount++
                    break
                case FileStatus.Error:
                    errorCount++
                    break
                case FileStatus.Completed:
                    completedCount++
            }
        })
        this.setState({
            files: this.files,
            fileStatus,
            uploadCount,
            errorCount,
            completedCount
        })
    }

    retry(file) {
        retry(file)
    }

    /**
     * 移除文件
     */
    cancel(file) {
        cancel(file)
    }

    /**
     * 全部取消
     */
    cancelAll() {
        stop()

        let i = this.files.length - 1

        while (i >= 0) {
            const status = this.files[i].getStatus()
            if (status === FileStatus.Inited || status === FileStatus.Queued || status === FileStatus.Progress) {
                this.cancel(this.files[i])
            }
            i = i - 1
        }
    }

    /**
     * 情空已完成
     */
    clearCompleted() {
        this.files.forEach(file => {
            if (file.getStatus() === FileStatus.Completed) {
                cancel(file)
            }
        })
    }

    /**
     * 重置上传组件
     */
    handleReset() {
        this.files = []
        this.setState({
            status: Status.Inited,
            fileStatus: {},
            uploadCount: 0,
            errorCount: 0,
            completedCount: 0
        })
    }

    /**
    * 切换最小化
    */
    toggleMinimize() {
        this.setState({
            minimized: !this.state.minimized
        })
    }

    /**
     * 点击关闭按钮
     */
    async handleClose() {
        try {
            if (this.state.uploadCount) {
                stop()
                await new Promise((resolve, reject) => {
                    const deferredClose = {
                        confirm() {
                            resolve()
                        },
                        cancel() {
                            upload()
                            reject()
                        }
                    }
                    this.setState({
                        deferredClose
                    })
                })
            }
            reset()
            if (!this.state.minimized) {
                this.toggleMinimize()
                setTimeout(this.togglePanel, 400)
            } else {
                this.togglePanel()
            }
        } finally {
            this.setState({ deferredClose: null })
        }
    }

    /**
     * 切换面板开关
     */
    togglePanel() {
        this.setState({
            open: !this.state.open
        })
    }
}