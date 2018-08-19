import WebComponent from '../webcomponent';
import { EACP } from '../../core/thrift/thrift';
import { manageLog, Level, ManagementOps } from '../../core/log/log'
import { timeOutI18n, toSeconds } from './helper'
import __ from './locale';

export default class FileConflictConfigBase extends WebComponent<Console.FileConflictConfig.Props, Console.FileConflictConfig.State> {

    defaultConfig = {
        fileLockStatus: false,
        fileLockTimeout: toSeconds(3, 'min'),
    }

    state = {
        config: {
            fileLockStatus: false,
            fileLockTimeout: toSeconds(3, 'min'),
        },
        changed: {
            fileLockStatus: false,
            fileLockTimeout: false,
        },
        successDialog: false,
        errMsg: '',
    }

    componentDidMount() {
        // 初始化用户配置
        this.getFileConflictConfig();
    }
    /**
     * 获取文件冲突策略
     * @private
     * @memberof FileConflictConfigBase
     */
    private async getFileConflictConfig() {
        const { isEnable: fileLockStatus, expiredInterval: fileLockTimeout } = await EACP('EACP_GetAutolockConfig')
        this.setState({
            config: { ...this.state.config, fileLockStatus, fileLockTimeout }
        }, () => {
            // 保存默认配置
            Object.assign(this.defaultConfig, this.state.config);
        });
    }


    /**
     * 处理切换文件锁状态
     * @protected
     * @memberof FileConflictConfigBase
     */
    protected handleFileLockStatusChange() {
        let { config, changed } = this.state;
        this.setState({
            config: { ...config, fileLockStatus: !config.fileLockStatus },
            changed: { ...changed, fileLockStatus: true },
        });
    }

    /**
     * 处理更改文件锁自动解锁时间
     * @param {number} [time]
     * @protected
     * @memberof FileConflictConfigBase
     */
    protected handleFileLockTimeoutChange(time: number) {
        let { config, changed } = this.state;
        this.setState({
            config: { ...config, fileLockTimeout: time },
            changed: { ...changed, fileLockTimeout: true },
        });
    }


    /**
     * 设置文件锁状态和超时时间
     * @private
     * @memberof FileConflictConfigBase
     */
    private setFileLock() {
        return EACP('EACP_SetAutolockConfig', [{ 'ncTAutolockConfig': { 'isEnable': this.state.config.fileLockStatus, 'expiredInterval': this.state.config.fileLockTimeout } }]);
    }


    /**
     * 保存文件冲突策略
     * @protected
     * @memberof FileConflictConfigBase
     */
    protected async handleSaveFileConflictConfig() {
        const { config: { fileLockStatus, fileLockTimeout } } = this.state;
        try {
            const response = await this.setFileLock();
            if (response) {
                throw Error(response.errmsg);
            }
            await manageLog(
                ManagementOps.SET,
                __(fileLockStatus ? '启用 文件锁机制 成功' : '禁用 文件锁机制 成功'),
                (fileLockStatus ? __(fileLockTimeout === -1 ? '永不解锁' : '超时解锁的时间间隔：${fileLockTimeout}', { 'fileLockTimeout': timeOutI18n[fileLockTimeout.toString()] }) : ''),
                (fileLockStatus ? Level.INFO : Level.WARN)
            );
            // 弹出成功提示信息，重置改动状态标识
            this.setState({
                successDialog: true,
                changed: {
                    fileLockStatus: false,
                    fileLockTimeout: false
                },
            });
            // 更新默认配置
            Object.assign(this.defaultConfig, this.state.config);
        } catch (error) {
            // 弹出错误提示信息
            if (error.message) {
                this.setState({
                    errMsg: __(error.message)
                });
            }
            manageLog(
                ManagementOps.SET,
                __(fileLockStatus ? '启用 文件锁机制 失败' : '禁用 文件锁机制 失败'),
                error,
                Level.WARN
            );
        }
    }

    /**
     * 取消保存文件冲突策略 
     * @protected
     * @memberof FileConflictConfigBase
     */
    protected handleCancelFileConflictConfig() {
        this.setState({
            config: this.defaultConfig,
            changed: {
                fileLockStatus: false,
                fileLockTimeout: false
            },
        });
    }
    /**
     * 处理关闭提示信息弹窗
     * @protected
     * @memberof FileConflictConfigBase
     */
    protected handleCloseDialog() {
        this.setState({
            successDialog: false,
            errMsg: '',
        });
    }

}

