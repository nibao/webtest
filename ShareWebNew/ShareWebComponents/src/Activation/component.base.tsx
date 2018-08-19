import * as React from 'react'
import { isSuffix, mailAndLenth, cellphone } from '../../util/validators/validators';
import { timer } from '../../util/timer/timer';
import { sendsMS, smsActivate } from '../../core/apis/eachttp/auth1/auth1'
import { eachttp } from '../../core/openapi/openapi';
import { ErrorCode } from '../../core/apis/openapi/errorcode';
import WebComponent from '../webcomponent';


export enum ValidateState {
    /**
     * 格式正确
     */
    OK,

    /**
     * 空值
     */
    Empty,

    /**
     * 格式不正确
     */
    Correct,

    /**
     * 已经存在
     */
    Exist
}

export default class ActivationBase extends WebComponent<Components.Activation.Props, Components.Activation.State> {

    state = {
        account: '',
        value: {
            password: '',
            email: '',
            phone: '',
            CATCHA: ''
        },
        validate: {
            password: ValidateState.OK,
            email: ValidateState.OK,
            phone: ValidateState.OK,
            CATCHA: ValidateState.OK
        },
        statusCode: 0,
        canSubmit: false,
        time: -1
    }

    async componentWillMount() {
        this.setState({
            account: this.props.account
        })
    }

    /**
     * 输入值改变时触发
     * @param checkType:  改变的类型
     * @param value:  改变的值
     */
    protected changeHandler(checkType, value) {
        this.setState({
            value: {
                ...this.state.value,
                [checkType]: value.trim()
            }
        })
    }

    /**
     * 点击激活时触发
     */
    protected async submitHandler() {
        const { password, email, phone, CATCHA } = this.state.value
        const { account } = this.state
        const passwordValidate = this.checkPassword(password)
        const emailValidate = this.checkEmail(email)
        const phoneValidate = this.checkPhone(phone)
        const caprchaValidate = this.checkCaprcha(CATCHA)
        this.setValidateStatus(passwordValidate, emailValidate, phoneValidate, caprchaValidate);
        const actionInfo = {
            account: account,
            password: password,
            tel_number: phone,
            mail_address: email,
            verify_code: CATCHA,
        }
        if ((passwordValidate === ValidateState.OK) && (emailValidate === ValidateState.OK) && (phoneValidate === ValidateState.OK) && (caprchaValidate === ValidateState.OK)) {
            try {
                const logInfo = await smsActivate(actionInfo)
                await eachttp('user', 'agreedtotermsofuse', null, { userid: logInfo.userid, tokenid: logInfo.tokenid });
                setTimeout(() => {
                    this.props.onActivatedSuccess(logInfo.userid, logInfo.tokenid)
                }, 3000);
            } catch (err) {
                this.setValidateStatusCode(err.errcode)
            }
        }
    }

    protected closeDialogHandler() {
        this.setState({
            statusCode: 0
        })
    }

    /**
     * 激活操作
     * @param passwordValidate:  密码的Validate
     * @param emailValidate:  email的Validate
     * @param phoneValidate:  手机号码的Validate
     * @param caprchaValidate:  验证码的Validate
     */
    private setValidateStatus(passwordValidate, emailValidate, phoneValidate, caprchaValidate) {
        this.setState({
            validate: {
                ...this.state.validate,
                password: passwordValidate,
                email: emailValidate,
                phone: phoneValidate,
                CATCHA: caprchaValidate
            }
        })
    }

    /**
     * 发送验证码时触发
     */
    protected async caprchaHandler() {
        const { password, phone } = this.state.value
        const { account } = this.state
        const passwordValidate = this.checkPassword(password)
        const phoneValidate = this.checkPhone(phone)
        const testInfo = {
            account: account,
            password: password,
            tel_number: phone
        }
        this.setState({
            validate: {
                ...this.state.validate,
                password: passwordValidate,
                phone: phoneValidate,
            }
        })
        if ((passwordValidate === ValidateState.OK) && (phoneValidate === ValidateState.OK)) {
            try {
                await sendsMS(testInfo)
                this.clocking()
            } catch (err) {
                this.setValidateStatusCode(err.errcode)
            }
        }
    }

    /**
     * 当errcode是指定值时实现跳转
     */
    protected transDialogHandler() {
        setTimeout(() => {
            this.props.onActivitedDetected();
        }, 3000);
    }

    /**
     * 倒计时
     */
    private clocking() {
        const stopTimer = timer(() => {
            this.setState({ time: this.state.time === -1 ? 59 : this.state.time - 1 });
            if (this.state.time === 0) {
                stopTimer();
                this.setState({ time: -1 })
            }
        }, 1000)
    }

    /**
     * 检查密码
     * @param value:  密码的值
     */
    private checkPassword(value) {
        if (value.trim() === '') {
            return ValidateState.Empty
        }
        return ValidateState.OK
    }

    /**
     * 检查email
     * @param value:  email的值
     */
    private checkEmail(value) {
        if (value.trim() === '') {
            return ValidateState.Empty
        }
        if (!mailAndLenth(value, 3, 300)) {
            return ValidateState.Correct
        }
        return ValidateState.OK
    }

    /**
     * 检查手机号码
     * @param value:  手机号码的值
     */
    private checkPhone(value) {
        if (value.trim() === '') {
            return ValidateState.Empty
        }
        if (!cellphone(value)) {
            return ValidateState.Correct
        }
        return ValidateState.OK
    }

    /**
     * 检查验证码
     * @param value:  验证码的值
     */
    private checkCaprcha(value) {
        if (value.trim() === '') {
            return ValidateState.Empty
        }
        if (isSuffix(value)) {
            return ValidateState.Correct
        }
        return ValidateState.OK
    }

    /**
     * 检查验证码
     * @param value:  验证码的值
     */
    private setValidateStatusCode(status) {
        switch (status) {
            case ErrorCode.PhoneCorrectFormat:
                this.setState({
                    validate: {
                        ...this.state.validate,
                        phone: ValidateState.Correct
                    }
                });
                break;
            case ErrorCode.PhoneExist:
                this.setState({
                    validate: {
                        ...this.state.validate,
                        phone: ValidateState.Exist,
                    }
                });
                break;
            case ErrorCode.CaprchaWrong:
                this.setState({
                    validate: {
                        ...this.state.validate,
                        CATCHA: ValidateState.Correct,
                    }
                });
                break;
            case ErrorCode.CaprchaOverstayed:
                this.setState({
                    validate: {
                        ...this.state.validate,
                        CATCHA: ValidateState.Exist,
                    }
                });
                break;
            case ErrorCode.EmailCorrectFormat:
                this.setState({
                    validate: {
                        ...this.state.validate,
                        email: ValidateState.Correct,
                    }
                });
                break;
            case ErrorCode.EmailExist:
                this.setState({
                    validate: {
                        ...this.state.validate,
                        email: ValidateState.Exist,
                    }
                });
            default:
                this.setState({
                    statusCode: status,
                });
                break;
        }
    }
}
