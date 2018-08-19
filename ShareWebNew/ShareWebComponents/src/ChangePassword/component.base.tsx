import * as React from 'react';
import { noop } from 'lodash';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import { modifyPassword } from '../../core/apis/eachttp/auth1/auth1';
import { getConfig } from '../../core/config/config';
import { encrypt } from '../../core/auth/auth';
import WebComponent from '../webcomponent';

/**
 * 错误状态
 */
enum ErrorStatus {
    /**
     * 正常
     */
    Normal,

    /**
     * 密码为空
     */
    PasswordMissing,

    /**
     * 新密码为空
     */
    NewPasswordMissing,

    /**
     * 确认密码为空
     */
    ReenterPasswordMissing,

    /**
     * 两次密码密码不一致
     */
    PasswordInconsitent,

    /**
     * 新密码等于初始密码
     */
    NewPasswordIsInit,

    /**
     * 新密码等于旧密码
     */
    PasswordIdentical
}

export default class ChangePasswordBase extends WebComponent<Components.ChangePassword.Props, Components.ChangePassword.State> {
    static defaultProps = {
        name: null,
        pwdControl: 0,
        onChangePwdSuccess: noop,
        onChangePwdCancel: noop,
        onUserLocked: noop
    }

    static ErrorStatus = ErrorStatus;

    state = {
        password: '',
        newPassword: '',
        reenterPassword: '',
        errorStatus: ErrorStatus.Normal,
        strongPasswordStatus: false,
        errorDetail: null
    }

    async componentWillMount() {
        this.setState({
            strongPasswordStatus: await getConfig('enable_strong_pwd'),
            errorStatus: this.props.pwdControl === 1 ? ErrorCode.PasswordRestricted : ErrorStatus.Normal
        })
    }

    /**
     * 输入密码
     * @param value 密码
     */
    protected changePassword(value) {
        if (this.state.errorStatus === ErrorStatus.NewPasswordMissing || this.state.errorStatus === ErrorStatus.ReenterPasswordMissing || this.state.errorStatus === ErrorStatus.PasswordInconsitent) {
            this.setState({
                password: value
            })
        } else {
            this.setState({
                password: value,
                errorStatus: ErrorStatus.Normal
            })
        }

    }

    /**
     * 输入新密码
     */
    protected changeNewPassword(value) {
        if (this.state.errorStatus === ErrorStatus.ReenterPasswordMissing || this.state.errorStatus === ErrorStatus.PasswordMissing) {
            this.setState({
                newPassword: value
            })
        } else {
            this.setState({
                newPassword: value,
                errorStatus: ErrorStatus.Normal
            })
        }

    }

    /**
     * 输入确认密码
     */
    protected changeReNewPassword(value) {
        if (this.state.errorStatus === ErrorStatus.NewPasswordMissing || this.state.errorStatus === ErrorStatus.PasswordMissing) {
            this.setState({
                reenterPassword: value
            })
        } else {
            this.setState({
                reenterPassword: value,
                errorStatus: ErrorStatus.Normal
            })
        }

    }

    /**
     * 保存修改密码
     */
    protected async confirmChangePassword() {
        if (this.checkPassword()) {
            try {
                await modifyPassword({
                    account: this.props.account,
                    oldpwd: encrypt(this.state.password),
                    newpwd: encrypt(this.state.newPassword)
                })
                this.props.onChangePwdSuccess(this.state.newPassword)
            } catch (ex) {
                if (ex.errcode === 401020) {
                    this.setState({
                        errorDetail: ex.detail
                    })
                }
                this.setState({
                    errorStatus: ex.errcode
                })
            }
        }
    }

    /**
    * 取消修改密码
    */
    cancelChangePassword() {
        this.props.onChangePwdCancel()
    }


    /**
     * 检查表单合法性
     */
    private checkPassword() {
        switch (true) {

            case this.state.password === '':
                this.setState({
                    errorStatus: ErrorStatus.PasswordMissing
                })
                return false

            case this.state.newPassword === '':

                this.setState({
                    errorStatus: ErrorStatus.NewPasswordMissing
                })
                return false

            case this.state.reenterPassword === '':

                this.setState({
                    errorStatus: ErrorStatus.ReenterPasswordMissing
                })
                return false

            case this.state.newPassword === '123456':

                this.setState({
                    errorStatus: ErrorStatus.NewPasswordIsInit
                })
                return false

            case this.state.newPassword === this.state.password:

                this.setState({
                    errorStatus: ErrorStatus.PasswordIdentical
                })
                return false

            case this.state.reenterPassword !== this.state.newPassword:
                this.setState({
                    errorStatus: ErrorStatus.PasswordInconsitent
                })
                return false
            default:
                return true
        }
    }





}