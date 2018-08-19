import * as React from 'react'
import * as classnames from 'classnames'
import BuildInWatermarkConfigBase, { FontSizes, Layout, ValidateMessages, ValidateState } from './component.base'
import WatermarkLibScope from '../WatermarkLibScope/component.view'
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop'
import ValidateBox from '../../ui/ValidateBox/ui.desktop'
import Select from '../../ui/Select/ui.desktop'
import Button from '../../ui/Button/ui.desktop'
import { maxLength } from '../../util/validators/validators'

import __ from './locale'
import * as styles from './styles.desktop.css'

export default class BuildInWatermarkConfig extends BuildInWatermarkConfigBase {
    render() {
        let { changed, config, validateState, tested, testing, attachable } = this.state
        return (
            config ?
                <div className={styles['container']}>
                    <div>
                        <CheckBoxOption checked={config.enabled} onChange={enabled => this.handleChange({ enabled })}>
                            {__('启用固化水印策略')}
                        </CheckBoxOption>
                    </div>
                    <table className={styles['form-table']}>
                        <tbody>
                            <tr>
                                <td className={styles['form-label']} >
                                    <div>{__('自定义文字：')}</div>
                                </td>
                                <td className={styles['form-field']} colSpan={3}>
                                    <ValidateBox
                                        width={'100%'}
                                        value={config.content}
                                        onChange={content => this.handleChange({ content })}
                                        validateMessages={ValidateMessages}
                                        validateState={validateState.content}
                                        validator={maxLength(50)}
                                        className={styles['content-box']}
                                        disabled={!config.enabled}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td className={styles['form-label']} >
                                    {__('字号：')}
                                </td>
                                <td className={styles['form-field']} >
                                    <Select
                                        onChange={fontSize => this.handleChange({ fontSize })}
                                        value={config.fontSize}
                                        disabled={!config.enabled}
                                    >
                                        {
                                            FontSizes[config.layout].map(fontSize => (
                                                <Select.Option
                                                    value={fontSize}
                                                    selected={config.fontSize === fontSize}
                                                    disabled={!config.enabled}
                                                >{fontSize}</Select.Option>
                                            ))
                                        }
                                    </Select>
                                </td>
                            </tr>
                            <tr>
                                <td className={styles['form-label']} >
                                    {__('颜色：')}
                                </td>
                                <td className={styles['form-field']} >
                                    <ValidateBox
                                        value={config.color}
                                        onChange={color => this.handleChange({ color })}
                                        validateMessages={ValidateMessages}
                                        validateState={validateState.color}
                                        validator={input => /^#?[0-9A-Fa-f]{0,6}$/.test(String(input))}
                                        disabled={!config.enabled}
                                    />
                                </td>
                                <td className={styles['form-field']} >
                                    <CheckBoxOption
                                        checked={config.transparency === 30}
                                        disabled={!config.enabled}
                                        onChange={checked => this.handleChange({ transparency: checked ? 30 : 100 })}
                                    >
                                        {__('半透明')}
                                    </CheckBoxOption>
                                </td>
                            </tr>
                            <tr>
                                <td className={styles['form-label']} >
                                    {__('水印版式：')}
                                </td>
                                <td className={styles['form-field']} >
                                    <Select
                                        value={config.layout}
                                        onChange={layout => this.handleChange({ layout, fontSize: layout === Layout.CENTER ? 48 : 36 })}
                                        disabled={!config.enabled}
                                    >
                                        <Select.Option value={Layout.CENTER} selected={config.layout === Layout.CENTER}>{__('居中')}</Select.Option>
                                        <Select.Option value={Layout.COVER} selected={config.layout === Layout.COVER}>{__('平铺')}</Select.Option>
                                    </Select>
                                </td>
                            </tr>
                            <tr>
                                <td className={styles['form-label']}>
                                    {__('配置水印服务器：')}
                                </td>
                                <td className={styles['form-field']} colSpan={2}>
                                    <ValidateBox
                                        width={300}
                                        value={config.url}
                                        onChange={url => this.handleChange({ url })}
                                        validateMessages={ValidateMessages}
                                        validateState={validateState.url}
                                        className={styles['url-box']}
                                        disabled={!config.enabled}
                                    />
                                </td>
                                <td className={styles['form-field']} >
                                    <Button onClick={this.handleTest.bind(this)} disabled={!config.enabled || testing}>
                                        {__('测试')}
                                    </Button>
                                </td>
                                {
                                    tested ?
                                        <td className={classnames(styles['form-field'], {
                                            [styles['test-attachable']]: attachable,
                                            [styles['test-unattachable']]: !attachable
                                        })}>
                                            {
                                                attachable ?
                                                    __('连接成功，指定的服务器可用。') :
                                                    __('连接失败，指定的服务器无法访问。')
                                            }
                                        </td> : null
                                }
                            </tr>
                        </tbody>
                    </table>
                    <div className={styles["footer"]}>
                        {
                            this.state.changed ?
                                <div>
                                    <span className={styles['button-wrapper']}>
                                        <Button onClick={this.handleSave.bind(this)}>{__('保存')}</Button>
                                    </span>
                                    <span className={styles['button-wrapper']}>
                                        <Button onClick={this.handleCancel.bind(this)}>{__('取消')}</Button>
                                    </span>
                                </div> : null
                        }
                    </div>
                    <WatermarkLibScope />
                </div> : null
        )
    }
}