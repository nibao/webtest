import * as React from 'react';
import { noop, filter, includes, reduce, some, isArray } from 'lodash';
import { pauseTaskById, resumeTaskById, cancelTaskById, pauseAllTask, resumeAllTask, cancelAllTask, requestTransferUnsync, requestUploadUnsync } from '../../core/apis/client/sync/sync';
import { hideAllSyncLogByType, hideSyncLogById } from '../../core/apis/client/log/log';
import { getOpenAPIConfig } from '../../core/openapi/openapi';
import { pullSyncDetails } from '../../core/client/client';
import { getLocalUserById } from '../../core/apis/client/config/config';
import { defaultExecute } from '../../core/apis/client/tmp/tmp';
import { getGlobalServer } from '../../core/apis/client/config/config';
import { formatRate } from '../../util/formatters/formatters';
import { ncTaskStatus, ncTaskType } from './helper';
import WebComponent from '../webcomponent';
import __ from './locale';

export default class SyncDetailsBase extends WebComponent<Components.SyncDetails.Props, Components.SyncDetails.State>{


    static defaultProps = {
        onCloseDialog: noop,
    }

    state = {
        detail: [],
        total: 0,
        completedSyncs: [],
        completedNum: 0,
        failedSyncs: [],
        failedNum: 0,
        unSyncs: [],
        unSyncsNum: 0,
        isSelectDir: false,
        currentAbsPath: [],
        enableDirectTransfer: true,
        cancelTaskId: '',
        cancelAllTask: false,
        skipDirectTransferTip: this.props.skipDirectTransferTip
    }

    /**  
     * 销毁轮询同步详情定时器 
     */
    destroyPullSyncDetails: () => any;

    /**
     * 是否开启直传模式
     */
    enableDirectTransfer: boolean;

    async componentWillMount() {
        this.destroyPullSyncDetails = pullSyncDetails(([syncing, completed, failed, unsync, unsyncCount]) => {
            this.setState({
                detail: filter(syncing.detail, info => this.isVisibleTask(info.taskType)),
                total: syncing.total,
                completedSyncs: completed.syncLogInfo,
                completedNum: completed.total,
                failedSyncs: failed.syncLogInfo,
                failedNum: failed.total,
                unSyncs: unsync.unsyncInfo,
                unSyncsNum: unsyncCount.num
            })
        })
        const { globalServerConfig: { featuresConfig: { enableDirectTransfer } } } = await getGlobalServer();
        this.enableDirectTransfer = enableDirectTransfer;

    }

    componentWillUnmount() {
        this.destroyPullSyncDetails()
    }

    /**
     * 取消任务
     */
    cancel(taskType, taskId) {
        if (this.state.skipDirectTransferTip) {
            cancelTaskById({ taskId })
            return
        }
        if (!this.enableDirectTransfer && (taskType === ncTaskType.NC_TT_UP_CREATE_DIR || taskType === ncTaskType.NC_TT_UP_EDIT_FILE)) {
            this.setState({
                cancelTaskId: taskId
            })
            return
        }
        cancelTaskById({ taskId })
    }

    /**
     * 暂停任务
     */
    pause(taskId) {
        pauseTaskById({ taskId })
    }

    /**
     * 恢复任务
     */
    resume(taskId) {
        resumeTaskById({ taskId })
    }

    /**
     * 取消所有任务
     */
    cancelAllTask() {
        if (this.state.skipDirectTransferTip) {
            cancelAllTask({});
            return
        }
        if (!this.enableDirectTransfer && (some(this.state.detail, item => { return item.taskType === ncTaskType.NC_TT_UP_CREATE_DIR || item.taskType === ncTaskType.NC_TT_UP_EDIT_FILE }))) {
            this.setState({
                cancelAllTask: true
            })
            return
        }
        cancelAllTask({});
    }

    /**
     * 暂停所有任务
     */
    pauseAllTask() {
        pauseAllTask({});
    }

    /**
     * 恢复所有任务
     */
    resumeAllTask() {
        resumeAllTask({});
    }

    /**
     * 清空记录
     * @param logType 0为同步成功，1为同步失败
     */
    clear(logType) {
        hideAllSyncLogByType({ logType })
    }

    /**
     * 删除某些记录
     * @param logId 任务id
     */
    deleteByLogId(logId) {
        hideSyncLogById({ logId })
    }

    /**
     * 根据相对路径打开当前文件所在目录
     */
    openDirByRelPath(relPath) {
        defaultExecute({ url: 'AnyShare://' + relPath.split('\\').slice(0, relPath.split('\\').length - 1).join('\\').replace(/\\/g, '/') })
    }

    /**
     * 根据绝对路径打开当前文件所在目录
     *  @param absPath 绝对路径
     */
    openDirByAbsPath(absPath) {
        defaultExecute({ url: absPath.split('\\').slice(0, absPath.split('\\').length - 1).join('\\').replace(/\\/g, '/') })
    }

    /**
     * 根据相对路径打开文件
     * @param relPath 相对路径
     */
    openFileByRelPath(relPath: string, taskType: number) {
        let url = 'AnyShare://' + relPath.replace(/\\/g, '/')
        if (taskType === ncTaskType.NC_TT_DIRECT_DOWNLOAD_FILE) {
            url = relPath.replace(/\\/g, '/')
        }
        defaultExecute({ url })
    }

    /**
     * 根据绝对路径打开文件
     * @param absPath 
     */
    openFileByAbsPath(absPath: string) {
        defaultExecute({ url: absPath.replace(/\\/g, '/') })
    }

    /**
     * 浏览本地文件夹
     * @param absPath 绝对路径
     */
    selectDir(absPath: ReadonlyArray<string>) {
        this.setState({
            isSelectDir: true,
            currentAbsPath: absPath
        })
    }

    onSelectDir() {
        this.setState({
            isSelectDir: false
        })
    }

    /**
     * 转移未同步文件
     * @param dirPath 目标路径
     */
    transferUnsyc(event) {
        let dirPath = event.target.value
        this.setState({
            isSelectDir: false
        })
        requestTransferUnsync({ absPaths: this.state.currentAbsPath, dirPath })
    }

    /**
     * 上传未同步文件
     * @param absPath 绝对路径
     */
    uploadUnsync(absPaths) {
        requestUploadUnsync({ absPaths })
    }

    onCancelAllTaskConfirm(skipDirectTransferTip = false) {
        cancelAllTask({});
        this.setState({
            cancelAllTask: false,
            skipDirectTransferTip
        }, () => this.props.onSkipDirectTransferTipChange(skipDirectTransferTip))

    }

    onCancelTaskIdConfirm(cancelTaskId, skipDirectTransferTip = false) {
        cancelTaskById({ taskId: cancelTaskId })
        this.setState({
            cancelTaskId: '',
            skipDirectTransferTip
        }, () => this.props.onSkipDirectTransferTipChange(skipDirectTransferTip))
    }

    onCancelConfigCancel() {
        this.setState({
            cancelTaskId: '',
            cancelAllTask: false
        })
    }

    /**
    * 检查是否为可见任务
    */
    isVisibleTask(type: ncTaskType) {
        return [
            ncTaskType.NC_TT_DOWN_EDIT_FILE,
            ncTaskType.NC_TT_UP_EDIT_FILE,
            ncTaskType.NC_TT_DIRECT_UPLOAD_FILE,
            ncTaskType.NC_TT_DIRECT_DOWNLOAD_FILE,
            ncTaskType.NC_TT_DIRECT_UPLOAD_DIR,
            ncTaskType.NC_TT_DIRECT_DOWNLOAD_DIR
        ].includes(type)
    }

    /**
     *  检查是否为上行任务
     * @param ncTaskType 任务类型
     */
    isUpwardTask(type: ncTaskType): boolean {
        return [
            ncTaskType.NC_TT_UP_CREATE_DIR,
            ncTaskType.NC_TT_UP_DELETE_DIR,
            ncTaskType.NC_TT_UP_EDIT_FILE,
            ncTaskType.NC_TT_UP_DELETE_FILE,
            ncTaskType.NC_TT_CLOUD_COPY_DIR,
            ncTaskType.NC_TT_CLOUD_MOVE_DIR,
            ncTaskType.NC_TT_CLOUD_COPY_FILE,
            ncTaskType.NC_TT_CLOUD_MOVE_FILE,
            ncTaskType.NC_TT_DIRECT_UPLOAD_DIR,
            ncTaskType.NC_TT_DIRECT_UPLOAD_FILE,
            ncTaskType.NC_TT_COMPLETE_UPLOAD_DIR,
            ncTaskType.NC_TT_UP_EDIT_DUP_FILE
        ].includes(type)
    }

    /**
     * 根据任务类型显示图标
     * @param type 
     */
    showTaskIcon(type: ncTaskType): { code: string, color: string } {
        switch (type) {
            case ncTaskType.NC_TT_UP_CREATE_DIR:
            case ncTaskType.NC_TT_UP_EDIT_FILE:
            case ncTaskType.NC_TT_CLOUD_COPY_DIR:
            case ncTaskType.NC_TT_CLOUD_MOVE_DIR:
            case ncTaskType.NC_TT_CLOUD_COPY_FILE:
            case ncTaskType.NC_TT_CLOUD_MOVE_FILE:
            case ncTaskType.NC_TT_DIRECT_UPLOAD_DIR:
            case ncTaskType.NC_TT_DIRECT_UPLOAD_FILE:
            case ncTaskType.NC_TT_COMPLETE_UPLOAD_DIR:
                return { code: '\uf031', color: '#31ae36' }
            case ncTaskType.NC_TT_UP_EDIT_DUP_FILE:
                return { code: '\uf09b', color: '#03a7e8' }
            case ncTaskType.NC_TT_DOWN_RENAME_DIR:
            case ncTaskType.NC_TT_DOWN_RENAME_FILE:
            case ncTaskType.NC_TT_UP_RENAME_DIR:
            case ncTaskType.NC_TT_UP_RENAME_FILE:
                return { code: '\uf07e', color: '#fb8c00' }
            case ncTaskType.NC_TT_DOWN_DELETE_DIR:
            case ncTaskType.NC_TT_DOWN_DELETE_FILE:
            case ncTaskType.NC_TT_UP_DELETE_DIR:
            case ncTaskType.NC_TT_UP_DELETE_FILE:
                return { code: '\uf07f', color: '#d70000' }
            default:
                return { code: '\uf01b', color: '#81c884' }
        }
    }

    showTextByStatus(type: ncTaskType, status: ncTaskStatus, rate: number): string {
        if (this.isUpwardTask(type)) {
            switch (status) {
                case ncTaskStatus.NC_TS_WAITING:
                    return __('等待上传')

                case ncTaskStatus.NC_TS_PAUSED:
                    return __('暂停中')

                case ncTaskStatus.NC_TS_EXECUTING:
                    return formatRate(rate)

                case ncTaskStatus.NC_TS_CANCELD:
                    return __('正在取消')

                case ncTaskStatus.NC_TS_DONE:
                    return __('上传完成')

                default:
                    return ''
            }
        } else {
            switch (status) {
                case ncTaskStatus.NC_TS_WAITING:
                    return __('等待下载')

                case ncTaskStatus.NC_TS_PAUSED:
                    return __('暂停中')

                case ncTaskStatus.NC_TS_EXECUTING:
                    return formatRate(rate)

                case ncTaskStatus.NC_TS_CANCELD:
                    return __('正在取消')

                case ncTaskStatus.NC_TS_DONE:
                    return __('下载完成')

                default:
                    return ''
            }
        }
    }
} 