import * as React from 'react';
import * as classnames from 'classnames';
import ValidateBox from '../../ui/ValidateBox/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import ToolBar from '../../ui/ToolBar/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import CMPConfigBase, { ValidateMessages, ValidateState, TestErrorType } from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class CMPConfig extends CMPConfigBase {
    render() {
        const { hostInfo, validateState, tested, testSuccess, changed, testErrorCode, saveErrorCode } = this.state;
        return (
            hostInfo ?
                <div className={styles['container']}>
                    <ToolBar>
                        <span className={styles['tool-bar']}>
                            <UIIcon className={styles['toolbar-icon']} size="18" code={'\uf016'}/>
                            {__('CMP服务器配置')}
                        </span>
                    </ToolBar>
                    <div style={{ marginLeft: '10px' }} >
                        <Form>
                            <div>
                                <Form.Label>
                                    <div className={styles['form-label']}>{__('云管理平台服务器（CMP）：')}</div>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateBox
                                        value={hostInfo.host}
                                        onChange={host => this.handleChange({ host })}
                                        validateMessages={ValidateMessages}
                                        validateState={validateState.host}
                                    />
                                </Form.Field>
                            </div>
                            <div>
                                <Form.Label>
                                    <div className={styles['form-label']}>{__('服务端口：')}</div>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateBox
                                        value={hostInfo.port}
                                        onChange={port => this.handleChange({ port })}
                                        validateMessages={ValidateMessages}
                                        validateState={validateState.port}
                                    />
                                </Form.Field>
                            </div>
                            <div>
                                <Form.Label>
                                    <div className={styles['form-label']}>{__('租户账号：')}</div>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateBox
                                        value={hostInfo.tenantName}
                                        onChange={tenantName => this.handleChange({ tenantName })}
                                        validateMessages={ValidateMessages}
                                        validateState={validateState.tenantName}
                                    />
                                </Form.Field>
                            </div>
                            <div>
                                <Form.Label>
                                    <div className={styles['form-label']}>{__('租户密码：')}</div>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateBox
                                        type="password"
                                        value={hostInfo.tenantPwd}
                                        onChange={tenantPwd => this.handleChange({ tenantPwd })}
                                        validateMessages={ValidateMessages}
                                        validateState={validateState.tenantPwd}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <Button onClick={this.handleTest.bind(this)} className={styles['btn-test']}>
                                        {__('测试')}
                                    </Button>
                                    {
                                        tested ?
                                            <span className={classnames(styles['test'], {
                                                [styles['test-success']]: testSuccess,
                                                [styles['test-failed']]: !testSuccess
                                            })}>
                                                {
                                                    testSuccess ?
                                                        __('测试连接成功，指定的服务器可用。') : 
                                                        testErrorCode !== 0 ?
                                                            (__('测试连接失败，') + this.renderSetConfigError(testErrorCode))
                                                            : null
                                                }
                                            </span>
                                            : null
                                    }
                                </Form.Field>
                            </div>
                        </Form>
                    </div>
                    <div className={styles['footer']}>
                        {
                            changed ?
                                <div>
                                    <span className={styles['button-wrapper']}>
                                        <Button onClick={this.handleSave.bind(this)}>{__('保存')}</Button>
                                    </span>
                                    <span className={styles['button-wrapper']}>
                                        <Button onClick={this.handleCancel.bind(this)}>{__('取消')}</Button>
                                    </span>
                                </div>
                                : null
                        }
                    </div>
                    {
                        saveErrorCode !== 0 ?
                        <MessageDialog onConfirm={this.confirmConfigError.bind(this)}>
                            {__('设置失败，') + this.renderSetConfigError(saveErrorCode)}
                        </MessageDialog >
                            : null
                    }
                </div>
                : null
        )
    }

    renderSetConfigError(testErrorCode) {
        switch (testErrorCode) {
            case TestErrorType.CmpUnauthError:
                return __('指定的服务器无法访问。')
            case TestErrorType.CmpConnectError:
                return __('指定的服务器连接失败。')
            case TestErrorType.CmpTenantError:
                return __('租户账户或租户密码错误，请重新输入。')
            case TestErrorType.CmpRepeatError:
                return __('CMP平台已有该节点，不可重复接入。')
            case TestErrorType.CmpAuthorizedError:
                return __('该节点已授权，不可用其他租户接入。')
            case TestErrorType.CmpOvertime:
                return __('请求已超时，请重新保存。')
        }
    }

}