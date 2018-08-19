import * as React from 'react';
import * as classnames from 'classnames';
import FlexBox from '../../ui/FlexBox/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import CheckBox from '../../ui/CheckBox/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import TextArea from '../../ui/TextArea/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import ChipX from '../../ui/ChipX/ui.desktop';
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import { FormStatus } from './helper';
import ThirdConfigBase from './component.base';
import * as styles from './styles.css';
import * as baseInfo from './assets/base_info.png';
import __ from './locale';


export default class ThirdConfig extends ThirdConfigBase {
    render() {
        return (
            <div className={ styles['container'] }>
                <div className={ styles['header'] }>
                    <Icon url={ baseInfo } size="16" />
                    <span className={ styles['header-title'] }>{ __('第三方认证通用配置') }</span>
                </div>
                <div className={ styles['content'] }>
                    <div>
                        <CheckBoxOption disabled={ !this.state.thirdPartyAuthHasGot } onChange={ (checked) => { this.setEnabledStatus(checked) } } checked={ this.state.editingAuthConfig.enabled }>
                            { __('启用第三方用户系统认证') }
                        </CheckBoxOption>
                    </div>
                    <Form>
                        <Form.Row>
                            <Form.Label>{ __('认证服务ID：') }</Form.Label>
                            <Form.Field>
                                <TextBox
                                    value={ this.state.editingAuthConfig.thirdPartyId }
                                    disabled={ !this.state.thirdPartyAuthHasGot || !this.state.editingAuthConfig.enabled }
                                    onChange={ val => this.setConfig('thirdPartyId', val) }
                                />
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>{ __('认证服务名称：') }</Form.Label>
                            <Form.Field>
                                <TextBox
                                    value={ this.state.editingAuthConfig.thirdPartyName }
                                    disabled={ !this.state.thirdPartyAuthHasGot || !this.state.editingAuthConfig.enabled }
                                    onChange={ val => this.setConfig('thirdPartyName', val) }
                                />
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>
                                { __('认证服务参数：') }
                            </Form.Label>
                            <Form.Field>
                                <TextArea
                                    value={ this.state.editingAuthConfig.config }
                                    disabled={ !this.state.thirdPartyAuthHasGot || !this.state.editingAuthConfig.enabled }
                                    onChange={ val => { this.setConfig('config', val) } }
                                    width={ 600 }
                                    height={ 290 }
                                />
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>
                            </Form.Label>
                            <Form.Field>
                                {
                                    this.state.formStatus !== FormStatus.NORMAL ?
                                        (
                                            <div className={ styles['red'] }>
                                                {
                                                    this.renderValidataMsg(this.state.formStatus)
                                                }
                                            </div>
                                        )
                                        :
                                        null
                                }
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>
                            </Form.Label>
                            <Form.Field>

                                {
                                    this.state.change ?
                                        (
                                            <div className={ styles['buttonGroup'] }>
                                                <div className={ styles['buttonWrapper'] }>
                                                    <Button onClick={ this.saveHandle.bind(this) }>{ __('保存') }</Button>
                                                </div>
                                                <div className={ styles['buttonWrapper'] }>
                                                    <Button onClick={ this.reset.bind(this) }>{ __('取消') }</Button>
                                                </div>
                                            </div>
                                        )
                                        :
                                        null
                                }
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label>{ __('认证模块插件：') }</Form.Label>
                            <Form.Field>
                                <TextBox
                                    className={ styles['v-middle'] }
                                    value={ this.state.fileName }
                                    readOnly={ true }
                                    width={ 250 }
                                />
                                <div className={ styles['buttonWrapper'] }>
                                    <div className={ styles['btn-uploader-picker'] } ref="select"></div>
                                </div>
                                <div className={ styles['buttonWrapper'] }>
                                    <div className={ classnames({ [styles['red']]: !this.state.pluginUploadStatus, [styles['green']]: this.state.pluginUploadStatus }) }>
                                        {
                                            this.state.pluginUploadStatus ? __('已上传') : __('未上传')
                                        }
                                    </div>
                                </div>
                            </Form.Field>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label></Form.Label>
                            <Form.Field>
                                { __('请从本地选择tar.gz 格式的文件上传') }
                            </Form.Field>
                        </Form.Row>
                    </Form>
                </div>
                <div>
                    {
                        this.state.uploading ?
                            (
                                <Dialog 
                                    width={ 450 }
                                    title={ __('提示') }
                                    buttons={[]}
                                >
                                    <Panel>
                                        <Panel.Main>
                                            { __('正在上传认证模块插件，请稍候......') }
                                        </Panel.Main>
                                    </Panel>
                                </Dialog>
                            )
                            :
                            null
                    }
                </div>
                <div>
                    {
                        this.state.errorMsg ?
                            (
                                <MessageDialog onConfirm={ this.resetError.bind(this) }>
                                    <p>{ this.state.errorMsg }</p>
                                </MessageDialog>
                            )
                            :
                            null
                    }
                </div>
                <div>
                    {
                        this.state.illegal ?
                            (
                                <MessageDialog onConfirm={ this.resetIllegalTip.bind(this) }>
                                    <p>{ __('请选择扩展名为 tar.gz 的文件。') }</p>
                                </MessageDialog>
                            )
                            :
                            null
                    }
                </div>

            </div>
        )
    }

    renderValidataMsg(formStatus) {
        switch (formStatus) {
            case FormStatus.ERR_MISSING_ID:
                return __('认证服务ID不允许为空')
            case FormStatus.ERR_MISSING_NAME:
                return __('认证服务名称不允许为空')
            case FormStatus.ERR_MISSING_CONFIG:
                return __('认证服务参数不允许为空')
        }
    }


}