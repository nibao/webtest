import * as React from 'react';
import { getConfig, setConfig, test } from '../../core/thrift/sharemgnt/sharemgnt';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import WebComponent from '../webcomponent';
import __ from './locale';

export enum ValidateState {
    /**
     * 正常
     */
    OK,

    /**
     * 空值
     */
    Empty
}

export enum Provider {
    /**
     * 默认的
     */
    Default,

    /**
     * 腾讯服务商
     */
    Tecent,
}

export enum TestErrorType {
    /**
     * 短信服务器配置不合法
     */
    InvalidConfig = 22601,

    /**
     * 不支持的短信服务器类型
     */
    NotSupportServer = 22605,

    /**
     * 连接短信服务器失败
     */
    ConnectServerError = 22610,
}

export default class MSGConfig extends WebComponent<Console.MSGConfig.Props, Console.MSGConfig.State> {

    // 初始状态
    config = {};

    state = {
        provider: Provider.Default,

        isFormChanged: false,

        testing: false,

        statusCode: {
            test: 0,
            save: 0
        },
        configInfo: {
            appSDK: '',
            appKEY: '',
            modelID: ''
        },
        validateState: {
            appSDK: ValidateState.OK,
            appKEY: ValidateState.OK,
            modelID: ValidateState.OK
        }
    }

    async componentWillMount() {
        const defaultConfig = JSON.parse(await getConfig());
        this.config = defaultConfig
        this.setState({
            provider: (defaultConfig.server_id === 'tencent_cloud') ? Provider.Tecent : Provider.Default,
            configInfo: {
                appSDK: defaultConfig.app_id,
                appKEY: defaultConfig.app_key,
                modelID: defaultConfig.template_id,
            }
        })
    }

    /**
     * 输入值改变函数
     * @param item: 配置项
     * @param val:  最新的值
     */
    protected changeHandler(item, val) {
        this.setState({
            configInfo: { ...this.state.configInfo, [item]: val },
            isFormChanged: true
        });
    }

    /**
     * 服务商下拉框改变
     * @param val:  选中的值
     */
    protected selectChangeHandler(val) {
        if (val === Provider.Default) {
            this.defaultConfig()
        } else {
            this.setState({
                provider: val
            })
        }
    }

    /**
     * 测试配置
     */
    protected async testHandler() {
        const validateState = this.checkValidate(this.state.configInfo)
        this.validateSetter(validateState)
        this.setState({ testing: true })
        const configInfo = {
            server_id: "tencent_cloud",
            server_name: __("腾讯云"),
            expire_time: "30",
            app_id: this.state.configInfo.appSDK,
            app_key: this.state.configInfo.appKEY,
            template_id: this.state.configInfo.modelID
        }
        const info = JSON.stringify(configInfo)
        if (this.validateOk(validateState)) {
            try {
                this.setState({
                    testing: false
                })
                await test([info]);
                this.setState({
                    testing: true,
                    statusCode: {
                        ...this.state.statusCode,
                        test: 0
                    }
                })
            } catch (err) {
                this.setState({
                    testing: true,
                    statusCode: {
                        ...this.state.statusCode,
                        test: err.error.errID
                    }
                })
            }
        }
    }

    /**
     * 保存配置
     */
    protected async saveHandler() {
        const validateState = this.checkValidate(this.state.configInfo)
        this.validateSetter(validateState)
        const configInfo = {
            server_id: "tencent_cloud",
            server_name: __("腾讯云"),
            expire_time: "30",
            app_id: this.state.configInfo.appSDK,
            app_key: this.state.configInfo.appKEY,
            template_id: this.state.configInfo.modelID
        }
        const info = JSON.stringify(configInfo)
        if (this.validateOk(validateState)) {
            try {
                await setConfig([info]);
                this.loglog()
                this.setState({ 
                    isFormChanged: false,
                    testing: false
                })
            } catch (err) {
                this.setState({
                    statusCode: {
                        ...this.state.statusCode,
                        save: err.error.errID
                    }
                })
            }
        }
    }

    /**
     * 取消配置
     */
    protected cancalHandler() {
        this.defaultConfig()
        this.setState({
            provider: (this.config.server_id === 'tencent_cloud') ? Provider.Tecent : Provider.Default,
            configInfo: {
                appSDK: this.config.app_id,
                appKEY: this.config.app_key,
                modelID: this.config.template_id,
            }
        })
    }

    /**
     * 取消小弹窗
     */
    protected confirmConfigErrorHandler() {
        this.setState({
            statusCode: {
                ...this.state.statusCode,
                save: 0
            },
        });
    }


    private loglog() {
        manageLog(
            ManagementOps.SET,
            __('短信服务器配置'),
            __('短信服务商：${provider}，SDK AppID：${appSDK}，短信正文模板ID：${modelID}', {
                provider: __('腾讯云'),
                appSDK: this.state.configInfo.appSDK,
                modelID: this.state.configInfo.modelID
            }),
            Level.INFO
        )
    }

    /**
     * 检查configInfo是否为空
     * @param configInfo:  configInfo的值
     */
    private checkValidate(configInfo) {
        return {
            appSDK: configInfo.appSDK ? ValidateState.OK : ValidateState.Empty,
            appKEY: configInfo.appKEY ? ValidateState.OK : ValidateState.Empty,
            modelID: configInfo.modelID ? ValidateState.OK : ValidateState.Empty
        }
    }

    /**
     * 设置validateState的值
     * @param validateState: validateState的值
     */
    private validateSetter(validateState) {
        this.setState({
            validateState: {
                ...this.state.validateState,
                ...validateState,
            }
        })
    }

    /**
     * 设置默认的值
     */
    private defaultConfig() {
        this.setState({
            provider: Provider.Default,
            isFormChanged: false,
            testing: false,
            statusCode: {
                test: 0,
                save: 0
            },
            configInfo: {
                appSDK: '',
                appKEY: '',
                modelID: '',
            },
            validateState: {
                ...this.state.validateState,
                appSDK: ValidateState.OK,
                appKEY: ValidateState.OK,
                modelID: ValidateState.OK
            }
        })
    }

    /**
     * 确认validateState是否都是有效的
     * @param validateState: validateState的值
     */
    private validateOk(validateState) {
        return !(validateState.appSDK || validateState.appKEY || validateState.modelID)
    }
}