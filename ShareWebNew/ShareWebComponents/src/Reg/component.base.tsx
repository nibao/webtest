import * as React from 'react';
import { assign, get, noop } from 'lodash';
import { selfRegistration } from '../../core/thrift/sharemgnt/sharemgnt';
import { manageLog, ManagementOps, Level } from '../../core/log/log';
import WebComponent from '../webcomponent';
import { ErrorStatus } from './helper';
import __ from './locale';

export default class RegBase extends WebComponent<any, any>{
    static defaultProps = {
        // 注册成功回调
        registerSuccess: noop
    }

    state = {
        // 自注册信息
        inputsVal: {
            // 注册号
            registerId: '',
            // 身份证号
            certId: '',
            // 真实姓名
            realName: '',
            // 密码
            password: '',
            // 确认密码
            passwordConfirm: ''
        },
        errorMsg: ErrorStatus.Normal,
        successDialog: false
    }

    /**
     * 设置输入框value对应的state
     * @param name 键名
     * @param value 键值
     */
    setValue(name, value) {
        this.setState({
            inputsVal: assign({}, this.state.inputsVal, { [name]: value })
        });
    }

    /**
     * 校验表单输入
     */
    validata() {
        const { registerId, certId, realName, password, passwordConfirm } = this.state.inputsVal;

        switch (true) {
            case !registerId:
                throw ErrorStatus.RegisterIdEmpty;

            case !certId:
                throw ErrorStatus.CertIdEmpty;

            case !realName:
                throw ErrorStatus.RealNameEmpty;

            case !password:
                throw ErrorStatus.PasswordEmpty;

            case !/^[a-zA-Z0-9~`!@#$%\-_,.]+$/.test(password):
                throw ErrorStatus.PasswordFormErr;

            case password.length < 6 || password.length >= 30:
                throw ErrorStatus.PasswordFormErr;

            case !passwordConfirm:
                throw ErrorStatus.PasswordConfirmEmpty;

            case !(password === passwordConfirm):
                throw ErrorStatus.PasswordDifferent;

            default:
                return true;
        }
    }

    /**
     * 注册回调
     */
    async handleReg() {
        const { registerId, certId, realName, password } = this.state.inputsVal;

        try {
            this.validata();
            const result = await selfRegistration(
                registerId,
                certId,
                realName,
                password
            );
            if (get(result, 'errmsg')) {
                manageLog(ManagementOps.CREATE, __('注册用户账号 “${display_name}” 失败',{'display_name': realName}), result.errmsg,  Level.WARN, realName);
                throw result.errmsg;
            }
            else {
                this.setState({
                    successDialog: true,
                    errorMsg: ErrorStatus.Normal,
                });
                manageLog(ManagementOps.CREATE, __('注册 用户 “${login_name}(${display_name})” 成功',{'login_name': registerId, 'display_name': realName}),'', Level.INFO, result);
            }
        } catch (e) {
            this.setState({
                errorMsg: e
            })
        }

    }
}