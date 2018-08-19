import * as React from 'react';
import WebComponent from '../webcomponent';
import { ShareMgnt } from '../../core/thrift/thrift';
import { manageLog, Level, ManagementOps } from '../../core/log/log'
import __ from './locale';

export enum ShowDialog {
    PEND,
    RESOLVE,
    REJECT,
}
export default class UserAgreementConfigBase extends WebComponent<any, any> {
    defaultConfig = {
        userAgreement: false,
        autoPopUserAgreement: false,
        agreementText: '',
    }
    state = {
        config: {
            userAgreement: false,
            autoPopUserAgreement: false,
            agreementText: '',
        },
        changed: {
            userAgreement: false,
            autoPopUserAgreement: false,
            agreementText: false,
        },
        error: {
            agreementText: false,
        },
        switchDialog: ShowDialog.PEND, // 提示Dialog显示标识
        processCircle: false, // 正在加载显示标识
    }

    componentDidMount() {
        // 初始化用户配置
        this.getUserAgreementConfig();
    }

    /**
     * 获取用户配置
     * @memberof UserAgreementConfigBase
     */
    private async getUserAgreementConfig() {
        // 获取用户配置并保存到默认配置中，以便当用户取消配置的时候恢复到默认配置
        const configJson = await ShareMgnt('OEM_GetConfigBySection', ['anyshare']);
        await (configJson => {
            configJson.filter(item =>
                (item.option === 'userAgreement' || item.option === 'agreementText' || item.option === 'autoPopUserAgreement') ? true : false
            ).map(item => {
                let { option, value } = item;
                if (option !== 'agreementText') {
                    value = value === 'true' ? true : false;
                }
                // 保存默认配置
                Object.assign(this.defaultConfig, { [option]: value });
            });
        })(configJson)
        await this.setState({
            config: this.defaultConfig
        });
    }


    /**
     * 处理显示用户协议项改变
     * @memberof UserAgreementConfigBase
     */
    protected handleUserAgreementChange() {
        let { config, changed, error } = this.state;
        this.setState({
            config: { ...config, userAgreement: !config.userAgreement },
            changed: { ...changed, userAgreement: true },
            error: { ...error, agreementText: false }, // 输入的时候清除提示，只在提交的时候验证 
        });
    }

    /**
     * 处理自动弹出用户协议改变
     * @memberof UserAgreementConfigBase
     */
    protected handleAutoPopUserAgreementChange() {
        let { config, changed, error } = this.state;
        this.setState({
            config: { ...config, autoPopUserAgreement: !config.autoPopUserAgreement },
            changed: { ...changed, autoPopUserAgreement: true },
            error: { ...error, agreementText: false }, // 输入的时候清除提示，只在提交的时候验证 
        });
    }

    /**
     * 处理用户协议内容改变
     * @memberof UserAgreementConfigBase
     */
    protected handleUserAgreementTextChange(value) {
        let { config, changed, error } = this.state;
        this.setState({
            config: { ...config, agreementText: value },
            changed: { ...changed, agreementText: true },
            error: { ...error, agreementText: false }, // 输入的时候清除提示，只在提交的时候验证 
        });
    }

    /**
     * 处理保存配置
     * @memberof UserAgreementConfigBase
     */
    protected async handleSaveUserAgreementConfig() {
        let { config: { userAgreement, autoPopUserAgreement, agreementText }, error } = this.state;
        // 勾选了任何一个选项并且输入框中没有输入值就弹出提示,否则就发送请求更改设置
        if ((userAgreement || autoPopUserAgreement) && !agreementText.length) {
            // 输入为空，显示提示信息
            this.setState({
                error: { ...error, agreementText: true }
            });
        } else {
            // 如果都没有勾选，则设置为上一个状态的agreementText，如果有任何一个勾选则就设置为当前文本框中的agreementText
            (userAgreement || autoPopUserAgreement) ? this.SetAgreement('anyshare', userAgreement, autoPopUserAgreement, agreementText) :
                this.SetAgreement('anyshare', userAgreement, autoPopUserAgreement, this.defaultConfig.agreementText)
        }
    }

    /**
     * 设置 首页显示用户协议 自动弹出用户协议 用户协议内容
     * @param {string} section 
     * @param {boolean} userAgreement 
     * @param {boolean} autoPopUserAgreement 
     * @param {string} agreementText 
     * @memberof UserAgreementConfigBase
     */
    private async SetAgreement(section: string, userAgreement: boolean, autoPopUserAgreement: boolean, agreementText: string) {
        try {
            this.setState({
                processCircle: true // 显示加载进度
            });
            this.defaultConfig.userAgreement === userAgreement ? null : await this.setUserAgreement(section, userAgreement);
            this.defaultConfig.autoPopUserAgreement === autoPopUserAgreement ? null : await this.setAutoPopUserAgreement(section, autoPopUserAgreement);
            this.defaultConfig.agreementText === agreementText ? null : await this.setAgreementText(section, agreementText, autoPopUserAgreement);
            // 修改成功更新默认配置
            this.defaultConfig = { ...this.defaultConfig, userAgreement, autoPopUserAgreement, agreementText }
            this.setState({
                config: this.defaultConfig, // 更新显示配置
                processCircle: false, // 取消显示加载进度
                switchDialog: ShowDialog.RESOLVE, // 显示成功提示
                changed: { // 恢复改动标识
                    userAgreement: false,
                    autoPopUserAgreement: false,
                    agreementText: false,
                },
            });
        } catch (err) {
            this.setState({
                processCircle: false, // 取消显示加载进度
                switchDialog: ShowDialog.REJECT, // 显示错误提示
            });
        }
    }

    /**
     * 处理更改 首页显示用户协议
     * @param {string} section 
     * @param {boolean} userAgreement 
     * @memberof UserAgreementConfigBase
     */
    private async setUserAgreement(section: string, userAgreement: boolean) {
        await ShareMgnt('OEM_SetConfig', [{ ncTOEMInfo: { section: section, option: 'userAgreement', value: userAgreement ? 'true' : 'false' } }])
        await manageLog(
            ManagementOps.SET,
            __(userAgreement ? '启用 在登录界面显示用户协议 成功' : '禁用 在登录界面显示用户协议 成功'),
            '',
            Level.WARN
        )
    }

    /**
     * 处理更改 首页自动弹出用户协议
     * @private
     * @param {string} section 
     * @param {boolean} autoPopUserAgreement 
     * @memberof UserAgreementConfigBase
     */
    private async setAutoPopUserAgreement(section: string, autoPopUserAgreement: boolean) {
        await ShareMgnt('OEM_SetConfig', [{ ncTOEMInfo: { section: section, option: 'autoPopUserAgreement', value: autoPopUserAgreement ? 'true' : 'false' } }]);
        await manageLog(
            ManagementOps.SET,
            __(autoPopUserAgreement ? '启用 首次登录时自动弹出用户协议 成功' : '禁用 首次登录时自动弹出用户协议 成功'),
            '',
            Level.WARN
        )
    }

    /**
     * 处理 更改用户协议内容（每次更改用户协议需要重置用户阅读用户协议标识，需要将autoPopUserAgreement重设触发）
     * @private
     * @param {string} section 
     * @param {boolean} autoPopUserAgreement 
     * @param {string} agreementText 
     * @memberof UserAgreementConfigBase
     */
    private async setAgreementText(section: string, agreementText: string, autoPopUserAgreement: boolean) {
        await ShareMgnt('OEM_SetConfig', [{ ncTOEMInfo: { section: section, option: 'agreementText', value: agreementText } }]);
        await ShareMgnt('OEM_SetConfig', [{ ncTOEMInfo: { section: section, option: 'autoPopUserAgreement', value: autoPopUserAgreement ? 'true' : 'false' } }]);
    }

    /**
     * 处理取消配置，将配置项恢复到初始化的时候的配置
     * @memberof UserAgreementConfigBase
     */
    protected handleCancelUserAgreementConfig() {
        // 恢复到默认配置并做清理
        let { config, changed, error } = this.state;
        this.setState({
            config: { ...config, ...this.defaultConfig }, // 恢复默认设置
            changed: { ...changed, userAgreement: false, autoPopUserAgreement: false, agreementText: false }, // 恢复改动标识
            error: { ...error, agreementText: false }, // 清除错误提示
        });
    }

    /**
     * 取消显示Dialog
     * @memberof UserAgreementConfigBase
     */
    protected handleCancelDialog() {
        this.setState({
            switchDialog: ShowDialog.PEND,
        })
    }
}

