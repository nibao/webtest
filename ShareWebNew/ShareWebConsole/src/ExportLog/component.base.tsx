import * as React from 'react';
import { noop } from 'lodash';
import { timer } from '../../util/timer/timer';
import { formatTime } from '../../util/formatters/formatters';
import { getExportWithPassWordStatus, exportHistoryLog, exportActiveLog, getGenCompressFileStatus } from '../../core/thrift/sharemgnt/sharemgnt';
import { getLogCount } from '../../core/thrift/eacplog/eacplog';
import WebComponent from '../webcomponent';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import __ from './locale';

export enum ValidateState {
    /**
     * 验证合法
     */
    Normal,

    /**
     * 验证不合法
     */
    Diff
}

export enum ExportStatus {
    /**
     * 涉密子开关关闭
     */
    SWITCH_CLOSE,

    /**
     * 涉密子开关开启
     */
    SWITCH_OPEN,

    /**
     * 转圈圈组件正在加载中
     */
    LOADING
}

/**
 * 日志类型
 */
export enum LogType {
    /**
     * 登录日志
     */
    NCT_LT_LOGIN = 10,

    /**
     * 管理日志
     */
    NCT_LT_MANAGEMENT = 11,

    /**
     * 操作日志
     */
    NCT_LT_OPEARTION = 12
}

export enum LogDetail {
    /**
     * 活跃日志
     */
    Active,

    /**
     * 历史日志
     */
    History
}
export default class ExportLogBase extends WebComponent<Console.ExportLog.Props, Console.ExportLog.State> {
    static defaultProps = {
        onExportComplete: noop,
        onExportCancel: noop
    }
    state = {
        password: '',
        passwordAgain: '',
        isSamePassword: true,
        validateState: ValidateState.Normal,
        exportStatus: ExportStatus.SWITCH_CLOSE,
        errcode: undefined,
        errorStatus: 0
    }
    async componentWillMount() {
        let status = await getExportWithPassWordStatus()
        // 子开关状态
        if (status) {
            this.setState({
                exportStatus: ExportStatus.SWITCH_OPEN
            })
        } else {
            this.setState({
                exportStatus: ExportStatus.LOADING
            })
            this.downloadLog()
        }
    }

    /**
     * 获取第一次输入的密码
     * @param value: 第一次输入的密码
     */
    protected onPasswordInputFirstChange(value) {
        this.setState({
            password: value,
            validateState: ValidateState.Normal,
            isSamePassword: true
        })
    }

    /**
     *
     * 获取第二次输入的密码
     * @param value: 第二次输入的密码
     */
    protected onpasswordAgainChange(value) {
        this.setState({
            passwordAgain: value,
            isSamePassword: true
        })
    }

    /**
     * 验证密码输入是否合法
     */
    protected isPasswordValidate(value) {
        if (!/[a-z]/.test(value)) {
            return false;
        } else if (!/[A-Z]/.test(value)) {
            return false;
        } else if (!/[0-9]/.test(value)) {
            return false;
        } else if (value.length < 10 || value.length > 100) {
            return false;
        } else if (!/^[\w~`!@#$%\-,\.]+$/i.test(value)) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * 当密码符合要求并且两次输入相同时,返回 true
     */
    protected checkedForm(): boolean {
        if (!this.isPasswordValidate(this.state.password)) {
            this.setState({
                validateState: ValidateState.Diff
            })
            return false
        } else if (this.state.password !== this.state.passwordAgain) {
            this.setState({
                isSamePassword: false
            })
            return false
        } else {
            return true
        }
    }

    protected async submitExport() {
        if (this.checkedForm()) {
            this.downloadLog()
        }
    }

    protected async cancelExport() {
        this.props.onExportCancel()
    }

    private async downloadLog() {
        let taskId
        this.setState({
            exportStatus: ExportStatus.LOADING
        })
        if (this.props.logStyle === LogDetail.Active) {
            let { logCount, maxLogId } = await getLogCount([this.props.activeParams])
            taskId = await exportActiveLog([this.createFileName(), this.state.password, logCount, { ...this.props.activeParams, maxLogId }])
            this.recodeLog();
            this.getCompressProgress(taskId)
        } else if (this.props.logStyle === LogDetail.History) {
            const { id, validSeconds, name } = this.props.historyParams
            taskId = await exportHistoryLog([id, validSeconds, this.state.password])
            manageLog(
                ManagementOps.EXPORT,
                __('导出历史日志文件 “${name}” 成功', {
                    'name': name
                }),
                null,
                Level.INFO
            )
            this.getCompressProgress(taskId)
        }
    }

    /**
     * 获取进度
     */
    getCompressProgress(taskId) {
        let time = timer(() => {
            return getGenCompressFileStatus([taskId]).then(compressStatus => {
                if (compressStatus) {
                    time();
                    this.props.onExportComplete(`/interface/log/downloadLog?taskId=${taskId}`)
                }
            })
        }, 1000)
    }

    /**
     * 记日志
     */
    private recodeLog() {
        let logMsg;
        switch (this.props.activeParams.logType) {
            case 10:
                logMsg = __('导出登录日志');
                break;
            case 11:
                logMsg = __('导出管理日志');
                break;
            case 12:
                logMsg = __('导出操作日志');
                break;
        }
        manageLog(ManagementOps.EXPORT,
            logMsg,
            null,
            Level.INFO
        )
    }

    /**
     * 生成文件名
     */
    private createFileName(): string {
        let exportType;
        switch (this.props.activeParams.logType) {
            case 10:
                exportType = __('访问日志');
                break;
            case 11:
                exportType = __('管理日志')
                break;
            case 12:
                exportType = __('操作日志')
                break;
        }
        const start = formatTime(this.props.activeParams.startDate / 1000, 'yyyy-MM-dd');
        const end = formatTime(this.props.activeParams.endDate / 1000, 'yyyy-MM-dd');
        return (`${exportType}.${start}~${end}.zip`);
    }
}
