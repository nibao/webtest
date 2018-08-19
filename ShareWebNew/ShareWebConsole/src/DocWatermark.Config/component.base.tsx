import * as React from 'react'
import { get, keys, isEqual, pairs } from 'lodash'
import { ShareMgnt } from '../../core/thrift/thrift'
import { manageLog, Level, ManagementOps } from '../../core/log/log'
import { validateColor, isURL } from '../../util/validators/validators'
import { setCopy } from '../../util/accessor/accessor'
import { formatColor } from '../../util/formatters/formatters'
import { PureComponent } from '../../ui/decorators'
import __ from './locale'

/**
 * 版式
 */
export enum Layout {
    CENTER = 0,
    COVER = 1
}

/**
 * 用户名水印字体大小
 */
export const UserFontSizes = {
    [Layout.CENTER]: [36, 40, 48, 54, 60, 66, 72, 90, 105, 120, 144],
    [Layout.COVER]: [18, 24, 32, 36, 40]
}

/**
 * 自定义文字水印字体大小
 */
export const TextFontSizes = {
    [Layout.CENTER]: [36, 40, 48, 54, 60, 66, 72, 90, 105, 120, 144],
    [Layout.COVER]: [28, 32, 36, 40, 48]
}

/**
 * 颜色输入错误信息
 */
export const ColorValidateMessages = { 0: __('输入框不能为空'), 1: __('颜色值输入不合法') }

/**
 * 自定义文字输入错误信息
 */
export const ContentValidateMessages = { 0: __('输入框不能为空') }

/**
 * 水印服务器输入错误信息
 */
export const ServerValidateMessages = { 0: __('输入框不能为空'), 1: __('请输入有效的URL地址') }

@PureComponent
export default class DocWatermark extends React.Component<any, Components.DocWatermarkConfig.State>{

    defaultConfig: Components.DocWatermarkConfig.Config = {
        text: { layout: 1, color: '#999999', enabled: false, content: '', fontSize: 36, transparency: 30 },
        image: { src: '', scale: 100, enabled: false, transparency: 30, layout: 1 },
        user: { color: '#999999', fontSize: 18, enabled: false, transparency: 30, layout: 1 }
    }

    defaultServer = ''

    state = {
        configChanged: false,
        config: this.defaultConfig,
        configValidateResult: {
            'user.color': -1,
            'text.color': -1,
            'text.content': -1
        },

        serverChanged: false,
        server: this.defaultServer,
        serverValidateResult: -1,
        serverTested: false,
        serverTesting: false,
        serverAttachable: false,
    }

    componentWillMount() {
        this.getDocWatermarkConfig()
    }

    /**
     * 获取水印配置
     */
    async getDocWatermarkConfig() {
        try {
            this.defaultConfig = JSON.parse(await ShareMgnt('GetDocWatermarkConfig'))
            this.defaultServer = (await ShareMgnt('GetThirdPartyToolConfig', ['ASPOSE'])).url
        } catch (e) { }
        this.setState({
            config: this.defaultConfig,
            server: this.defaultServer
        })
    }

    /**
     * 输入水印服务器
     * @param value 
     */
    updateServer(value) {
        this.setState({
            serverChanged: true,
            serverTested: false,
            serverValidateResult: -1,
            server: value
        })
    }

    /**
     * 验证水印服务器
     */
    validateServer() {
        const validatorGroup = [
            url => !!url,
            url => isURL(url)
        ]
        let result = -1, canSave = true
        for (let i = 0; i < validatorGroup.length; i++) {
            if (!validatorGroup[i](this.state.server)) {
                result = i
                canSave = false
                break
            }
        }
        this.setState({
            serverValidateResult: result
        })
        return canSave
    }

    /**
     * 测试水印服务器
     */
    async testServer() {
        if (this.validateServer()) {
            this.setState({
                serverTesting: true,
                serverTested: false
            })
            let attachable = false
            try {
                attachable = await ShareMgnt('TestThirdPartyToolConfig', [this.state.server])
            } catch (e) { }
            this.setState({
                serverTesting: false,
                serverTested: true,
                serverAttachable: attachable
            })
        }
    }

    /**
     * 保存水印服务器
     */
    async saveServer() {
        if (this.validateServer()) {
            try {
                await ShareMgnt('SetThirdPartyToolConfig', [{
                    ncTThirdPartyToolConfig: {
                        enabled: true,
                        thirdPartyToolId: 'ASPOSE',
                        url: this.state.server
                    }
                }])
                manageLog(
                    ManagementOps.SET,
                    __('启用 水印服务器配置 成功'),
                    __('部署服务器的URL路径：${url}', { url: this.state.server }),
                    Level.INFO
                )
                this.defaultServer = this.state.server
                this.setState({
                    serverChanged: false
                })
            } catch (e) { }
        }
    }

    /**
     * 取消设置水印服务器
     */
    cancelServer() {
        this.setState({
            server: this.defaultServer,
            serverChanged: false,
            serverTested: false,
            serverAttachable: false,
            serverValidateResult: -1
        })
    }

    /**
     * 输入配置信息
     * @param values 
     */
    updateConfig(values = {}) {
        this.setState({
            configChanged: true,
            config: pairs(values).reduce((oldConfig, [path, value]) => setCopy(oldConfig, path, value), this.state.config),
            configValidateResult: keys(values).reduce((oldResult, key) => ({ ...oldResult, [key]: -1 }), this.state.configValidateResult)
        })
    }

    /**
     * 验证水印配置
     */
    valdateConfig() {

        const { config } = this.state

        const validators = {
            'user.color': [
                color => config.user.enabled ? !!color : true,
                color => config.user.enabled ? validateColor(color) : true
            ],
            'text.content': [content => config.text.enabled ? !!content : true],
            'text.color': [
                color => config.text.enabled ? !!color : true,
                color => config.text.enabled ? validateColor(color) : true
            ]
        }

        let canSave = true

        const configValidateResult = keys(validators).reduce((results, key) => {
            let result = -1
            const value = get(config, key)
            const validatorGroup = validators[key]
            for (let i = 0; i < validatorGroup.length; i++) {
                if (!validatorGroup[i](value)) {
                    result = i
                    canSave = false
                    break
                }
            }
            return { ...results, [key]: result }
        }, {})

        this.setState({
            configValidateResult
        })

        return canSave
    }

    /**
     * 保存水印配置
     */
    async saveWatermarkConfig() {
        if (this.valdateConfig()) {
            const { config } = this.state
            let fixedConfig = setCopy(
                setCopy(config, 'user.color', formatColor(config.user.color)),
                'text.color',
                formatColor(config.text.color)
            )
            this.setState({
                config: fixedConfig
            })
            try {
                await ShareMgnt('SetDocWatermarkConfig', [JSON.stringify(fixedConfig)])

                if (!isEqual(this.defaultConfig.user, fixedConfig.user)) {
                    manageLog(
                        ManagementOps.SET,
                        __(fixedConfig.user.enabled ? '启用 用户名水印 成功' : '禁用 用户名水印 成功'),
                        '',
                        Level.INFO
                    )
                }

                if (!isEqual(this.defaultConfig.text, fixedConfig.text)) {
                    manageLog(
                        ManagementOps.SET,
                        __(fixedConfig.text.enabled ? '启用 自定义版权水印 成功' : '禁用 自定义版权水印 成功'),
                        '',
                        Level.INFO
                    )
                }

                this.defaultConfig = config
                this.setState({
                    configChanged: false
                })
            } catch (e) { }
        }
    }

    /**
     * 取消设置水印配置
     */
    cancelWatermarkConfig() {
        this.setState({
            config: this.defaultConfig,
            configChanged: false,
            configValidateResult: {
                'user.color': -1,
                'text.colot': -1,
                'text.content': -1
            }
        })
    }
}