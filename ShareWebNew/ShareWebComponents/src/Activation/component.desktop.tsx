import * as React from 'react'
import * as classnames from 'classnames';
import Form from '../../ui/Form/ui.desktop'
import TextBox from '../../ui/TextBox/ui.desktop'
import Button from '../../ui/Button/ui.desktop'
import ValidateBox from '../../ui/ValidateBox/ui.desktop'
import ErrorDialog from '../../ui/ErrorDialog/ui.desktop'
import Centered from '../../ui/Centered/ui.desktop'
import UserAgreement from '../UserAgreement/component.desktop'
import ActivationBase from './component.base'
import { ValidateState } from './component.base'
import { ErrorCode } from '../../core/apis/openapi/errorcode'
import { getErrorMessage } from '../../core/errcode/errcode';
import * as styles from './styles.desktop.css'
import __ from './locale'

export default class Activation extends ActivationBase {
    render() {
        const { password: pswVal, email: emailVal, phone: phoneVal, CATCHA: caprchaVal } = this.state.value
        const { password: pswState, email: emailState, phone: phoneState, CATCHA: caprchaState } = this.state.validate
        return (
            this.state.account ?
                <div className={styles['container']}>
                    <div className={styles['header-font']}>
                        {__('账号激活')}
                    </div>
                    <Centered>
                        <Form>
                            <Form.Row>
                                <Form.Label>
                                    <div className={styles['label-font']}>
                                        {__('用户名：')}
                                    </div>
                                </Form.Label>
                                <Form.Field>
                                    <TextBox
                                        width={310}
                                        readOnly={true}
                                        placeholder={__('请输入用户名')}
                                        value={this.state.account}
                                    />
                                    <span className={styles['form-required']}>*</span>
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <div className={styles['label-font']}>
                                        {__('密码：')}
                                    </div>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateBox
                                        width={310}
                                        type="password"
                                        placeholder={__('请输入密码')}
                                        value={pswVal}
                                        onChange={this.changeHandler.bind(this, 'password')}
                                        validateState={pswState}
                                        validateMessages={{
                                            [ValidateState.Empty]: __('此输入项不允许为空。'),
                                            [ValidateState.Correct]: __('密码不正确，请重新输入。'),
                                        }}
                                    />
                                    <span className={styles['form-required']}>*</span>
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <div className={styles['label-font']}>
                                        {__('邮箱：')}
                                    </div>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateBox
                                        width={310}
                                        placeholder={__('请输入邮箱')}
                                        value={emailVal}
                                        onChange={this.changeHandler.bind(this, 'email')}
                                        validateState={emailState}
                                        validateMessages={{
                                            [ValidateState.Empty]: __('此输入项不允许为空。'),
                                            [ValidateState.Exist]: __('邮箱已被占用，请重新输入。'),
                                            [ValidateState.Correct]: __('邮箱地址只能包含 英文、数字 及 @-_.字符，格式形如 XXX@XXX，长度范围 3~100 个字符，请重新输入。')
                                        }}
                                    />
                                    <span className={styles['form-required']}>*</span>
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <div className={styles['label-font']}>
                                        {__('手机号：')}
                                    </div>
                                </Form.Label>
                                <Form.Field>
                                    <ValidateBox
                                        width={310}
                                        placeholder={__('请输入手机号')}
                                        value={phoneVal}
                                        onChange={this.changeHandler.bind(this, 'phone')}
                                        validateState={phoneState}
                                        validateMessages={{
                                            [ValidateState.Empty]: __('此输入项不允许为空。'),
                                            [ValidateState.Exist]: __('手机号已被占用，请重新输入。'),
                                            [ValidateState.Correct]: __('手机号码只能包含 数字，长度范围 1~20 个字符，请重新输入。')
                                        }}
                                    />
                                    <span className={styles['form-required']}>*</span>
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                    <div className={styles['label-font']}>
                                        {__('手机验证码：')}
                                    </div>
                                </Form.Label>
                                <Form.Field>
                                    <div className={styles['captcha-wrap']}>
                                        <ValidateBox
                                            className={styles['captcha-input']}
                                            width={182}
                                            placeholder={__('请输入手机验证码')}
                                            value={caprchaVal}
                                            onChange={this.changeHandler.bind(this, 'CATCHA')}
                                            validateState={caprchaState}
                                            validateMessages={{
                                                [ValidateState.Empty]: __('此输入项不允许为空。'),
                                                [ValidateState.Correct]: __('验证码有误，请重新输入。'),
                                                [ValidateState.Exist]: __('您输入的验证码已过期，请重新输入。')
                                            }}
                                        />
                                        <div className={styles['captcha']}>
                                            <Button
                                                width={125}
                                                className={styles['captcha-btn']}
                                                disabled={(this.state.time !== -1)}
                                                onClick={this.caprchaHandler.bind(this)}
                                            >
                                                {
                                                    (this.state.time !== -1)
                                                        ? __('${time}S后重新发送', { 'time': this.state.time })
                                                        : __('获取验证码')
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                    <span className={styles['form-required']}>*</span>
                                </Form.Field>
                            </Form.Row>
                            <Form.Row>
                                <Form.Label>
                                </Form.Label>
                                <Form.Field>
                                    <Button
                                        className={styles['btn']}
                                        width={312}
                                        disabled={!(pswVal && emailVal && phoneVal && caprchaVal)}
                                        onClick={this.submitHandler.bind(this)}
                                    >
                                        {__('立即激活')}
                                    </Button>
                                </Form.Field>
                            </Form.Row>
                        </Form>
                    </Centered>
                    <UserAgreement activate={true} />
                    {
                        this.state.statusCode ?
                            (status => {
                                switch (status) {
                                    case ErrorCode.UserActivated:
                                        return (
                                            <ErrorDialog onConfirm={this.transDialogHandler.bind(this)}>
                                                {
                                                    getErrorMessage(this.state.statusCode)
                                                }
                                            </ErrorDialog>
                                        )
                                    default:
                                        return (
                                            <ErrorDialog onConfirm={this.closeDialogHandler.bind(this)}>
                                                {
                                                    getErrorMessage(this.state.statusCode)
                                                }
                                            </ErrorDialog>
                                        );
                                }
                            })(this.state.statusCode) :
                            null
                    }
                </div> :
                null
        )
    }
}
