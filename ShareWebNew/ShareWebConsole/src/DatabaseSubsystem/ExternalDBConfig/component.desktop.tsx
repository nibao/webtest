import * as React from 'react';
import { isBoolean } from 'lodash';
import { Form, ValidateBox, ConfirmDialog, Panel } from '../../../ui/ui.desktop';
import ExternalDBConfigBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class ExternalDBConfig extends ExternalDBConfigBase {

    render() {
        let { externalDBInfo, defaultHostValidateState, defaultPortValidateState, testResult, saveResult } = this.state
        return (
            <div className={styles['external-wrap']}>
                <Form>
                    <Form.Row>
                        <Form.Label align="middle">
                            {__('数据库服务器地址：')}
                        </Form.Label>
                        <Form.Field>
                            <div className={styles['form-data']}>
                                <ValidateBox
                                    width={'420px'}
                                    align="right"
                                    className={styles['validate-box']}
                                    validateState={defaultHostValidateState}
                                    value={externalDBInfo ? externalDBInfo.db_host : ''}
                                    disabled={externalDBInfo.db_host}
                                />
                            </div>
                        </Form.Field>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label align="middle">
                            <label>{__('端口：')}</label>
                        </Form.Label>
                        <Form.Field>
                            <div className={styles['form-data']}>
                                <ValidateBox
                                    width={'420px'}
                                    align="right"
                                    className={styles['validate-box']}
                                    validateState={defaultPortValidateState}
                                    value={externalDBInfo ? externalDBInfo.db_port : ''}
                                    disabled={externalDBInfo.db_port}
                                />
                            </div>
                        </Form.Field>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label align="middle">
                            <label>{__('帐号：')}</label>
                        </Form.Label>
                        <Form.Field>
                            <div className={styles['form-data']}>
                                <ValidateBox
                                    width={'420px'}
                                    align="right"
                                    className={styles['validate-box']}
                                    value={externalDBInfo ? externalDBInfo.db_user : ''}
                                    onChange={(value) => this.setState({ externalDBInfo: { ...externalDBInfo, db_user: value } })}
                                />
                            </div>
                        </Form.Field>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label align="middle">
                            <label>{__('密码：')}</label>
                        </Form.Label>
                        <Form.Field>
                            <div className={styles['form-data']}>
                                <ValidateBox
                                    width={'420px'}
                                    align="right"
                                    className={styles['validate-box']}
                                    value={externalDBInfo ? externalDBInfo.db_password : ''}
                                    onChange={(value) => this.setState({ externalDBInfo: { ...externalDBInfo, db_password: value } })}
                                    type={'password'}
                                />
                            </div>
                        </Form.Field>
                    </Form.Row>
                </Form>
                {
                    this.originExternalDBInfo && (externalDBInfo.db_user !== this.originExternalDBInfo.db_user || externalDBInfo.db_password !== this.originExternalDBInfo.db_password)
                        ?
                        <div className={styles['wrap']}>
                            <Panel.Button onClick={this.test.bind(this, externalDBInfo)}>
                                {__('测试')}
                            </Panel.Button>
                            <div className={styles['right']}>
                                <Panel.Button onClick={this.save.bind(this, externalDBInfo)}>
                                    {__('保存')}
                                </Panel.Button>
                                <Panel.Button onClick={this.cancel.bind(this)}>
                                    {__('取消')}
                                </Panel.Button>
                            </div>
                        </div>
                        :
                        null
                }
                {
                    isBoolean(testResult) ?
                        <ConfirmDialog
                            onConfirm={() => { this.setState({ testResult: undefined }) }}
                            onCancel={() => { this.setState({ testResult: undefined }) }}
                        >
                            {testResult ? __('连接成功') : __('连接失败，数据库配置不可用')}
                        </ConfirmDialog>
                        :
                        null
                }
                {
                    isBoolean(saveResult) ?
                        <ConfirmDialog
                            onConfirm={() => { this.setState({ saveResult: undefined }) }}
                            onCancel={() => { this.setState({ saveResult: undefined }) }}
                        >
                            {saveResult ? __('保存成功') : __('保存失败，数据库配置不可用')}
                        </ConfirmDialog>
                        :
                        null
                }
            </div>
        )
    }

}