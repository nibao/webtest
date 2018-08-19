import * as React from 'react';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import { getErrorMessage } from '../../core/errcode/errcode';
import { Dialog2 as Dialog, Panel, Form, TextBox, MessageDialog, Text } from '../../ui/ui.desktop';
import ChangePasswordBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';

export default class ChangePassword extends ChangePasswordBase {
    render() {
        return (
            <div>
                {
                    this.getPasswordTemplate(this.state.errorStatus)
                }
            </div>
        )
    }

    getChangePassWordError(error) {
        switch (error) {
            case ChangePasswordBase.ErrorStatus.PasswordMissing:
                return (
                    <div>
                        {
                            __('旧密码不能为空。')
                        }
                    </div>
                )
            case ChangePasswordBase.ErrorStatus.NewPasswordMissing:
                return (
                    <div>
                        {
                            __('新密码不能为空。')
                        }
                    </div>
                )
            case ChangePasswordBase.ErrorStatus.ReenterPasswordMissing:
                return (
                    <div>
                        {
                            __('确认新密码不能为空。')
                        }
                    </div>
                )
            case ChangePasswordBase.ErrorStatus.NewPasswordIsInit:
                return (
                    <div>
                        {
                            __('新密码不能为初始密码。')
                        }
                    </div>
                )
            case ChangePasswordBase.ErrorStatus.PasswordIdentical:
                return (
                    <div>
                        {
                            __('新密码不能和旧密码相同。')
                        }
                    </div>
                )

            case ChangePasswordBase.ErrorStatus.PasswordInconsitent:
                return (
                    <div>
                        {
                            __('两次输入的密码不一致。')
                        }
                    </div>
                )
            case ErrorCode.PasswordInvalid:
            case ErrorCode.PasswordWeak:
                return (
                    <div>
                        {
                            __('新密码不符合要求。')
                        }
                    </div>
                )

            default:
                return (
                    <div>
                        {
                            getErrorMessage(error)
                        }
                    </div>
                )


        }
    }


    getPasswordTemplate(errorStatus) {
        switch (errorStatus) {
            case ErrorCode.PasswordInvalidLocked:
                return (
                    <MessageDialog onConfirm={this.props.onUserLocked} >
                        <div>
                            {
                                __('您输入错误次数超过限制，账号已被锁定，${time}分钟内无法登录，请稍后重试', { 'time': this.state.errorDetail.remainlockTime })
                            }
                        </div>
                    </MessageDialog>
                )
            case ErrorCode.PasswordRestricted:
                return (
                    <MessageDialog onConfirm={this.props.onChangePwdCancel} >
                        <div>
                            {
                                getErrorMessage(ErrorCode.PasswordRestricted)
                            }
                        </div>
                    </MessageDialog>
                )
            default:
                return (
                    <Dialog title={__('修改密码')} onClose={this.cancelChangePassword.bind(this)} width={400}>
                        <Panel>
                            <Panel.Main>
                                <div className={styles['message']}>
                                    {
                                        this.state.strongPasswordStatus ?
                                            __('密码为10~100 位，必须同时包含 大小写英文字母 与 数字，允许包含 ~!%#$@-_. 字符。') :
                                            __('密码为 6~100 位，只能包含 英文 或 数字 或 ~!%#$@-_. 字符。')
                                    }
                                </div>
                                <Form>
                                    <Form.Row>
                                        <Form.Label>
                                            {
                                                __('账号：')
                                            }
                                        </Form.Label>
                                        <Form.Field>
                                            <div className={styles['account']}>
                                                <Text>
                                                    {
                                                        this.props.account
                                                    }
                                                </Text>
                                            </div>
                                        </Form.Field>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Label>
                                            {
                                                __('旧密码：')
                                            }
                                        </Form.Label>
                                        <Form.Field>
                                            <TextBox value={this.state.password} onChange={this.changePassword.bind(this)} type="password" />
                                        </Form.Field>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Label>
                                            {
                                                __('新密码：')
                                            }
                                        </Form.Label>
                                        <Form.Field>
                                            <TextBox value={this.state.newPassword} onChange={this.changeNewPassword.bind(this)} type="password" />
                                        </Form.Field>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Label>
                                            {
                                                __('确认新密码：')
                                            }
                                        </Form.Label>
                                        <Form.Field>
                                            <TextBox value={this.state.reenterPassword} onChange={this.changeReNewPassword.bind(this)} type="password" />
                                        </Form.Field>
                                    </Form.Row>
                                </Form>
                                <div className={styles['error-message']}>
                                    {
                                        this.state.errorStatus === ChangePasswordBase.ErrorStatus.Normal ?
                                            null :
                                            this.getChangePassWordError(this.state.errorStatus)
                                    }
                                </div>
                            </Panel.Main>
                            <Panel.Footer>
                                <Panel.Button onClick={this.confirmChangePassword.bind(this)} >
                                    {
                                        __('确定')
                                    }
                                </Panel.Button>
                                <Panel.Button onClick={this.cancelChangePassword.bind(this)}>
                                    {
                                        __('取消')
                                    }
                                </Panel.Button>
                            </Panel.Footer>
                        </Panel>
                    </Dialog>
                )
        }
    }
}