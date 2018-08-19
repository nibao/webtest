import * as React from 'react';
import { mailAndLenth } from '../../util/validators/validators';
import { ShareMgnt } from '../../core/thrift/thrift'
import session from '../../util/session/session';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { noop } from 'lodash';
import WebComponent from '../webcomponent';
import __ from './locale';

export enum ErrorType {
    // 正常状态
    NORMAL
}


export default class EmailConfigBase extends WebComponent<any, any> {

    static defaultProps = {
        username: '',
        onSuccess: noop,
        onCancel: noop
    }

    state = {
        //邮箱
        data: [],
        //显示弹出框
        showEmailConfig: true,
        //错误码
        errorType: ErrorType.NORMAL,
        //发送成功
        success: false,
        //按钮开关状态
        active: true,
        //邮箱格式是否正确
        validEmailFormat: true
    }

    componentWillMount() {
        this.initData()
    }

    private initData() {
        if (this.props.username === 'audit') {
            Promise.all([ShareMgnt('SMTP_GetAdminMailList', [session.get('userid')]), ShareMgnt('Usrm_GetDDLEmailNotifyStatus')]).then(([data, active]) => {
                this.setState({
                    data,
                    active
                })
            })
        } else {
            ShareMgnt('SMTP_GetAdminMailList', [session.get('userid')]).then(
                data => {
                    this.setState({
                        data
                    })
                }
            )
        }
    }

    onEmailChange(value) {
        this.setState({
            data: value,
            validEmailFormat: true
        })
    }

    cancelSetEmail() {
        this.props.onCancel();
    }


    testMail() {
        if (this.state.data.length && this.state.data.length > 0) {
            let unValid = this.state.data.some((email, index) => {
                if (!mailAndLenth(email, 3, 100)) {
                    return true
                }
            });
            if (!unValid) {
                this.setState({
                    validEmailFormat: true
                })
                ShareMgnt('SMTP_ReceiverTest', [this.state.data]).then(res => {
                    this.setState({
                        success: true
                    })
                }, xhr => {
                    this.setState({
                        errorType: xhr.error.errID
                    })
                }
                )
            } else {
                this.setState({
                    validEmailFormat: false
                })
            }
        }

    }

    setEmails() {
        if (this.state.data.length && this.state.data.length > 0) {
            let unValid = this.state.data.some((email, index) => {
                if (!mailAndLenth(email, 3, 100)) {
                    return true
                }
            })
            if (!unValid) {
                this.setState({
                    validEmailFormat: true
                })
                ShareMgnt('SMTP_SetAdminMailList', [session.get('userid'), this.state.data]).then(
                    res => {
                        this.props.onSuccess();
                        this.logSetMail(this.state.data);
                    }, xhr => {
                        this.setState({
                            errorType: xhr.error.errID
                        })
                    }

                )
            } else {
                this.setState({
                    validEmailFormat: false
                })
            }
        } else {
            ShareMgnt('SMTP_SetAdminMailList', [session.get('userid'), this.state.data]).then(
                res => {
                    this.props.onSuccess();
                    this.logSetMail(this.state.data);
                }, xhr => {
                    this.setState({
                        errorType: xhr.error.errID
                    })
                }
            )
        }

    }

    closeErrorDialog() {
        this.setState({
            errorType: ErrorType.NORMAL
        })
    }

    closeSuccessDialog() {
        this.setState({
            success: false
        })
    }

    onSwitchChange(active, value) {
        CoverLayer(1, __('正在设置......'))
        ShareMgnt('Usrm_SetDDLEmailNotifyStatus', [active]).then(res => {
            CoverLayer(0)
            this.setState({
                active
            })
            this.logSwitch(active);
        }, xhr => {
            CoverLayer(0)
        }
        )
    }

    setLoadingStatus() {
        CoverLayer(1, __('正在设置......'))
    }

    private logSwitch(active) {
        manageLog(ManagementOps.SET, active ? __('开启 接收securit修改下载次数阈值通知 成功') : __('关闭 接收securit修改下载次数阈值通知 成功'), '', Level.INFO);
    }

    private logSetMail(emails) {
        manageLog(ManagementOps.SET, __('设置 邮箱 成功'), emails, Level.INFO);
    }
} 