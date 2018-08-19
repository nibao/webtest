import * as React from 'react'
import * as classnames from 'classnames'
import DocWatermarkBase, { TextFontSizes, UserFontSizes, Layout, ColorValidateMessages, ContentValidateMessages, ServerValidateMessages } from './component.base'
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop'
import ValidateBox from '../../ui/ValidateBox/ui.desktop'
import Button from '../../ui/Button/ui.desktop'
import Select from '../../ui/Select/ui.desktop'
import { maxLength } from '../../util/validators/validators'
import * as styles from './styles.view.css'
import __ from './locale'

export default class DocWatermark extends DocWatermarkBase {
    render() {
        const { server, serverChanged, serverValidateResult, serverTesting, serverAttachable, serverTested,
            config, configChanged, configValidateResult } = this.state
        return (
            <div>
                <div>
                    <table>
                        <tbody>
                            <tr>
                                <td className={styles['cell']}>
                                    {__('配置水印服务器URL路径：')}
                                </td>
                                <td className={styles['cell']}>
                                    <ValidateBox
                                        width={300}
                                        value={server}
                                        validateState={serverValidateResult}
                                        validateMessages={ServerValidateMessages}
                                        disabled={serverTesting}
                                        onChange={this.updateServer.bind(this)}
                                    />
                                </td>
                                <td className={styles['cell']}>
                                    <Button onClick={this.testServer.bind(this)} disabled={serverTesting}>{__('测试')}</Button>
                                </td>
                                {
                                    serverTested ?
                                        <td className={classnames(styles['cell'], {
                                            [styles['server-attachable']]: serverAttachable,
                                            [styles['server-unattachable']]: !serverAttachable
                                        })}>
                                            {__(serverAttachable ? '连接成功，指定的服务器可用。' : '连接失败，指定的服务器无法访问。')}
                                        </td> : null
                                }
                            </tr>
                        </tbody>
                    </table>
                    {
                        serverChanged ?
                            <div className={styles['button-wrapper']}>
                                <Button onClick={this.saveServer.bind(this)} className={styles['button']}>{__('保存')}</Button>
                                <Button onClick={this.cancelServer.bind(this)} className={styles['button']}> {__('取消')}</Button>
                            </div> : null
                    }
                </div>
                <div>
                    <div className={styles['title']}>
                        <CheckBoxOption checked={config.user.enabled} onChange={enabled => this.updateConfig({ 'user.enabled': enabled })}>
                            {__('用户名水印')}
                        </CheckBoxOption>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                                <td className={styles['cell']}>
                                    {__('字号：')}
                                </td>
                                <td className={styles['cell']}>
                                    <Select
                                        onChange={fontSize => this.updateConfig({ 'user.fontSize': fontSize })}
                                        value={config.user.fontSize}
                                        disabled={!config.user.enabled}
                                        width={220}
                                    >
                                        {
                                            UserFontSizes[config.user.layout].map(fontSize => (
                                                <Select.Option
                                                    value={fontSize}
                                                    selected={config.user.fontSize === fontSize}
                                                    disabled={!config.user.enabled}
                                                >{fontSize}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </td>
                            </tr>
                            <tr>
                                <td className={styles['cell']}>
                                    {__('颜色：')}
                                </td>
                                <td className={styles['cell']}>
                                    <ValidateBox
                                        value={config.user.color}
                                        validateMessages={ColorValidateMessages}
                                        validateState={configValidateResult['user.color']}
                                        validator={input => /^#?[0-9A-Fa-f]{0,6}$/.test(String(input))}
                                        disabled={!config.user.enabled}
                                        onChange={color => this.updateConfig({ 'user.color': color })}
                                        width={220}
                                    />
                                </td>
                                <td className={styles['cell']}>
                                    <CheckBoxOption
                                        checked={config.user.transparency !== 100}
                                        disabled={!config.user.enabled}
                                        onChange={checked => this.updateConfig({ 'user.transparency': checked ? 30 : 100 })}
                                    >
                                        {__('半透明')}
                                    </CheckBoxOption>
                                </td>
                            </tr>
                            <tr>
                                <td className={styles['cell']}>
                                    {__('水印版式：')}
                                </td>
                                <td className={styles['cell']}>
                                    <Select
                                        value={config.user.layout}
                                        onChange={layout => this.updateConfig({
                                            'user.layout': layout,
                                            'user.fontSize': layout === Layout.CENTER ? 40 : 18,
                                            'text.layout': layout,
                                            'text.fontSize': layout === Layout.CENTER ? 48 : 32
                                        })}
                                        disabled={!config.user.enabled}
                                        width={220}
                                    >
                                        <Select.Option value={Layout.CENTER} selected={config.user.layout === Layout.CENTER}>{__('居中')}</Select.Option>
                                        <Select.Option value={Layout.COVER} selected={config.user.layout === Layout.COVER}>{__('平铺')}</Select.Option>
                                    </Select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <div className={styles['title']}>
                        <CheckBoxOption checked={config.text.enabled} onChange={enabled => this.updateConfig({ 'text.enabled': enabled })}>
                            {__('自定义水印')}
                        </CheckBoxOption>
                    </div>
                    <table>
                        <tbody>
                            <tr>
                                <td className={styles['cell']}>
                                    {__('文字：')}
                                </td>
                                <td className={styles['cell']}>
                                    <ValidateBox
                                        value={config.text.content}
                                        onChange={content => this.updateConfig({ 'text.content': content })}
                                        validateMessages={ContentValidateMessages}
                                        validateState={configValidateResult['text.content']}
                                        validator={maxLength(50)}
                                        disabled={!config.text.enabled}
                                        width={220}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles['cell']}>
                                    {__('字号：')}
                                </td>
                                <td className={styles['cell']}>
                                    <Select
                                        onChange={fontSize => this.updateConfig({ 'text.fontSize': fontSize })}
                                        value={config.text.fontSize}
                                        disabled={!config.text.enabled}
                                        width={220}
                                    >
                                        {
                                            TextFontSizes[config.text.layout].map(fontSize => (
                                                <Select.Option
                                                    value={fontSize}
                                                    selected={config.text.fontSize === fontSize}
                                                    disabled={!config.text.enabled}
                                                >{fontSize}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </td>
                            </tr>
                            <tr>
                                <td className={styles['cell']}>
                                    {__('颜色：')}
                                </td>
                                <td className={styles['cell']}>
                                    <ValidateBox
                                        value={config.text.color}
                                        validateMessages={ColorValidateMessages}
                                        validateState={configValidateResult['text.color']}
                                        validator={input => /^#?[0-9A-Fa-f]{0,6}$/.test(String(input))}
                                        disabled={!config.text.enabled}
                                        onChange={color => this.updateConfig({ 'text.color': color })}
                                        width={220}
                                    />
                                </td>
                                <td className={styles['cell']}>
                                    <CheckBoxOption
                                        checked={config.text.transparency !== 100}
                                        disabled={!config.text.enabled}
                                        onChange={checked => this.updateConfig({ 'text.transparency': checked ? 30 : 100 })}
                                    >
                                        {__('半透明')}
                                    </CheckBoxOption>
                                </td>
                            </tr>
                            <tr>
                                <td className={styles['cell']}>
                                    {__('水印版式：')}
                                </td>
                                <td className={styles['cell']}>
                                    <Select
                                        value={config.text.layout}
                                        onChange={layout => this.updateConfig({
                                            'user.layout': layout,
                                            'user.fontSize': layout === Layout.CENTER ? 40 : 18,
                                            'text.layout': layout,
                                            'text.fontSize': layout === Layout.CENTER ? 48 : 32
                                        })}
                                        disabled={!config.text.enabled}
                                        width={220}
                                    >
                                        <Select.Option value={Layout.CENTER} selected={config.text.layout === Layout.CENTER}>{__('居中')}</Select.Option>
                                        <Select.Option value={Layout.COVER} selected={config.text.layout === Layout.COVER}>{__('平铺')}</Select.Option>
                                    </Select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    {
                        configChanged ?
                            <div className={styles['button-wrapper']}>
                                <Button onClick={this.saveWatermarkConfig.bind(this)} className={styles['button']}>{__('保存')}</Button>
                                <Button onClick={this.cancelWatermarkConfig.bind(this)} className={styles['button']}>{__('取消')}</Button>
                            </div> : null
                    }
                </div>
            </div>
        )
    }
}