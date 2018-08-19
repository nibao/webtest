import * as React from 'react'
import WebComponent from '../webcomponent'
import { ShareMgnt } from '../../core/thrift/thrift'
import { assign, pick } from 'lodash'
import { isURL, validateColor } from '../../util/validators/validators'
import { formatColor } from '../../util/formatters/formatters'
import { manageLog, Level, ManagementOps } from '../../core/log/log'
import __ from './locale'
/**
 * 版式
 */
export enum Layout {
    CENTER = 0,
    COVER = 1
}

/**
 * 水印字体大小
 */
export const FontSizes = {
    [Layout.CENTER]: [36, 40, 48, 54, 60, 66, 72, 90, 105, 120, 144],
    [Layout.COVER]: [28, 32, 36, 40, 48]
}

/**
 * 
 */
export enum ValidateState {
    Normal,
    Empty,
    InvalidUrl,
    InvalidColor
}

export const ValidateMessages = {
    [ValidateState.Empty]: __('输入框不能为空'),
    [ValidateState.InvalidColor]: __('颜色值输入不合法'),
    [ValidateState.InvalidUrl]: __('请输入有效的URL地址')
}


export default class BuildInWatermarkConfigBase extends WebComponent<any, any>{

    defaultConfig = {
        enabled: false,
        content: '',
        fontSize: 36,
        color: '#999999',
        layout: Layout.COVER,
        transparency: 30,
        url: null
    }

    state = {
        changed: false,
        tested: false,
        testing: false,
        attachable: true,
        validateState: {
            content: ValidateState.Normal,
            color: ValidateState.Normal,
            url: ValidateState.Normal
        },
        config: null
    }

    componentWillMount() {
        this.getWaterMarkConfig()
    }

    async getWaterMarkConfig() {
        let enabled = await ShareMgnt('GetDownloadWatermarkStatus'),
            configJson = await ShareMgnt('GetDownloadWatermarkConfig'),
            {url} = await ShareMgnt('GetThirdPartyToolConfig', ['ASPOSE'])
        assign(this.defaultConfig, {
            enabled,
            ...JSON.parse(configJson || JSON.stringify({})),
            url
        })
        this.setState({
            config: { ...this.defaultConfig }
        })
    }

    handleChange(config = {}) {
        let {validateState} = this.state
        this.setState({
            changed: true,
            tested: 'url' in config ? false : this.state.tested,
            config: { ...this.state.config, ...config },
            validateState: {
                content: 'content' in config ? ValidateState.Normal : validateState.content,
                color: 'color' in config ? ValidateState.Normal : validateState.color,
                url: 'url' in config ? ValidateState.Normal : validateState.url
            }
        })
    }

    validateURL() {
        let {config, validateState} = this.state
        if (config.url && isURL(config.url)) {
            return true
        } else {
            this.setState({
                validateState: {
                    ...validateState,
                    url: config.url ? ValidateState.InvalidUrl : ValidateState.Empty
                }
            })
            return false
        }
    }

    validateContent() {
        let {config, validateState} = this.state
        if (!config.content) {
            this.setState({
                validateState: { ...validateState, content: ValidateState.Empty }
            })
            return false
        }
        return true
    }

    validaColor() {
        let {config, validateState} = this.state
        if (!config.color) {
            this.setState({
                validateState: { ...validateState, color: ValidateState.Empty }
            })
            return false
        }
        if (!validateColor(config.color)) {
            this.setState({
                validateState: { ...validateState, color: ValidateState.InvalidColor }
            })
            return false
        }
        return true
    }

    async handleTest() {
        if (this.validateURL()) {
            this.setState({
                tested: false,
                testing: true
            })
            try {
                let attachable = await ShareMgnt('TestThirdPartyToolConfig', [this.state.config.url])
                this.setState({
                    tested: true,
                    testing: false,
                    attachable
                })
            } catch (e) {
                this.setState({
                    tested: true,
                    testing: false,
                    attachable: false
                })
            }
        }
    }

    async handleSave() {
        let {config, validateState} = this.state
        if (!config.enabled || this.validateContent() && this.validaColor() && this.validateURL()) {
            assign(this.defaultConfig, config.enabled ? { ...config, color: formatColor(config.color) } : { enabled: false })
            try {
                await ShareMgnt('SetDownloadWatermarkStatus', [this.defaultConfig.enabled])
                await ShareMgnt('SetDownloadWatermarkConfig', [JSON.stringify(pick(this.defaultConfig, ['enabled', 'content', 'color', 'layout', 'fontSize', 'transparency']))])
                await ShareMgnt('SetThirdPartyToolConfig', [{
                    ncTThirdPartyToolConfig: {
                        enabled: this.defaultConfig.enabled,
                        thirdPartyToolId: "ASPOSE",
                        url: this.defaultConfig.url
                    }
                }])
                await manageLog(
                    ManagementOps.SET,
                    __(config.enabled ? '启用 固化水印 成功' : '禁用 固化水印 成功'),
                    '',
                    Level.INFO
                )
            } catch (e) {
                await this.getWaterMarkConfig()
            } finally {
                this.setState({
                    testing: false,
                    tested: false,
                    config: { ...this.defaultConfig },
                    validateState: {
                        content: ValidateState.Normal,
                        color: ValidateState.Normal,
                        url: ValidateState.Normal
                    }
                }, () => {
                    this.setState({
                        changed: false
                    })
                })
            }
        }
    }

    handleCancel() {
        this.setState({
            config: { ...this.defaultConfig }
        }, () => {
            this.setState({
                changed: false
            })
        })
    }
}