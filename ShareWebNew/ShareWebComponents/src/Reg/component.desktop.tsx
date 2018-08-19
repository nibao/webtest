import * as React from 'react';
import Form from '../../ui/Form/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import SuccessDialog from '../../ui/SuccessDialog/ui.desktop';
import RegBase from './component.base';
import __ from './locale';
import { ErrorStatus } from './helper';
import * as styles from './styles.desktop';

export default class Reg extends RegBase {
    renderErrorMsg() {
        switch (this.state.errorMsg) {
            case ErrorStatus.Normal:
                return null;

            case ErrorStatus.RegisterIdEmpty:
                return __('注册号不允许为空。');

            case ErrorStatus.CertIdEmpty:
                return __('身份证号不允许为空。');

            case ErrorStatus.RealNameEmpty:
                return __('真实姓名不允许为空。');

            case ErrorStatus.PasswordEmpty:
                return __('密码不允许为空。');

            case ErrorStatus.PasswordConfirmEmpty:
                return __('确认密码不允许为空。');

            case ErrorStatus.PasswordDifferent:
                return __('两次输入的密码不一致，请重新输入。');

            case ErrorStatus.PasswordFormErr:
                return __('密码只能包含英文、数字及~`!@#$%-_,.字符，长度范围为6~30个字符，请您重新输入');

            default:
                return this.state.errorMsg;
        }
    }
    render() {
        return (
            <div className={styles['container']}>
                <h1 className={styles['big-title']}>{__('请填写以下信息，注册帐号：')}</h1>
                <Form className={styles['form']}>
                    <Form.Row>
                        <Form.Label>
                            <label className={styles['label']}>{__('注册号：')}</label>
                        </Form.Label>
                        <Form.Field>
                            <TextBox
                                className={styles['text-box']}
                                placeholder={__('请输入工号或学号')}
                                onChange={val => this.setValue('registerId', val)}
                                />
                        </Form.Field>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label>
                            <label className={styles['label']}>{__('身份证号：')}</label>
                        </Form.Label>
                        <Form.Field>
                            <TextBox
                                className={styles['text-box']}
                                onChange={val => this.setValue('certId', val)}
                                />
                        </Form.Field>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label>
                            <label className={styles['label']}>{__('真实姓名：')}</label>
                        </Form.Label>
                        <Form.Field>
                            <TextBox
                                className={styles['text-box']}
                                onChange={val => this.setValue('realName', val)}
                                />
                        </Form.Field>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label>
                            <label className={styles['label']}>{__('密码：')}</label>
                        </Form.Label>
                        <Form.Field>
                            <TextBox
                                className={styles['text-box']}
                                type='password'
                                onChange={val => this.setValue('password', val)}
                                />
                        </Form.Field>
                    </Form.Row>
                    <Form.Row>
                        <Form.Label>
                            <label className={styles['label']}>{__('确认密码：')}</label>
                        </Form.Label>
                        <Form.Field>
                            <TextBox
                                className={styles['text-box']}
                                type='password'
                                onChange={val => this.setValue('passwordConfirm', val)}
                                />
                        </Form.Field>
                    </Form.Row>
                </Form>
                <div className={styles['login-submit']}>
                    <Button
                        type="submit"
                        className={styles['input-btn']}
                        onClick={this.handleReg.bind(this)}
                        >
                        {__('注册')}
                    </Button>
                </div>
                <p className={styles['error-message']}>{this.renderErrorMsg()}</p>
                {
                    this.state.successDialog ?
                        <SuccessDialog onConfirm={() => { this.props.onSuccess() } }>
                            <div className={styles['message-text']}>
                                {__('注册已成功, 您可以使用账号“${account}“进行登录。', { account: this.state.inputsVal.registerId })}
                            </div>
                        </SuccessDialog> :
                        null
                }
            </div >
        )
    }
}