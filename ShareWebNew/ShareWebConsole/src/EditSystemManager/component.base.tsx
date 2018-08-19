import * as React from 'react';
import { noop } from 'lodash';
import { isUserName, mailAndLenth } from '../../util/validators/validators';
import { manageLog, Level, ManagementOps } from '../../core/log/log';
import { manageLog as newManageLog } from '../../core/log2/log2';
import { appStatusReady } from '../../core/cluster/cluster';
import WebComponent from '../webcomponent';
import { SystemType } from '../helper';
import { SMTPGetAdminMails, SMTPReceiverTests, auth, editAccount, setAdminMailsList } from './thrift.api';
import __ from './locale';

/**
 * 账户名认证状态
 */
enum ValidateType {

    /**
     * 正常状态
     */
    OK,

    /**
     * 验证不通过
     */
    AccountValidateResult,

}

/**
 * 面板状态
 */
enum PanelStatus {
    /**
     * 账户更改面板
     */
    UserEditedPanel,

    /**
     * 输入密码面板
     */
    PasswordPanel,

    /**
     * 错误面板
     */
    ErrorPanel,

    /**
     * 测试邮箱成功
     */
    TestMailSuccess
}

export default class EditSystemManagerBase extends WebComponent<Console.EditSystemManager.Props, Console.EditSystemManager.State> {
    static defaultProps = {
        adminId: '',
        account: '',
        systemType: SystemType.Console,
        displayName: '',
        onEditSuccess: noop,
        onEditCancel: noop
    }

    static ValidateType = ValidateType;

    static PanelStatus = PanelStatus;

    state = {
        account: this.props.account,
        mails: [],
        password: '',
        accountValidate: ValidateType.OK,
        panelStatus: PanelStatus.UserEditedPanel,
        authError: null,
        errorInfo: null
    }

    appIp = null;


    async componentWillMount() {
        if (this.props.systemType === SystemType.Cluster) {
            this.appIp = await appStatusReady();
            if (!this.appIp) {
                this.props.onEditCancel();
            }
        }
        this.setState({
            mails: await SMTPGetAdminMails(this.props.systemType, this.props.adminId, this.appIp)
        })
    }

    /**
     * 更改文本框输入
     * @param value 
     */
    protected changeAccount(value: string) {
        if (isUserName(value) || value === '') {
            this.setState({
                accountValidate: ValidateType.OK
            })
        } else {
            this.setState({
                accountValidate: ValidateType.AccountValidateResult
            })
        }
        this.setState({
            account: value
        })
    }

    /**
     * 更改邮箱地址
     */
    protected changeMails(mails: Array<string>) {
        this.setState({
            mails
        })
    }

    /**
     * 输入密码
     */
    protected changePassword(password: string) {
        this.setState({
            password,
            authError: null
        })
    }

    /**
     * 点击保存用户名和邮箱修改表单
     */
    protected confirmAccount() {
        if (!isUserName(this.state.account)) {
            this.setState({
                accountValidate: ValidateType.AccountValidateResult
            })
        } else {
            this.setState({
                panelStatus: PanelStatus.PasswordPanel
            })
        }
    }

    /**
     * 测试邮箱
     */
    protected async testMail() {
        try {
            await SMTPReceiverTests(this.props.systemType, this.state.mails, this.appIp)
            this.setState({
                panelStatus: PanelStatus.TestMailSuccess
            })
        } catch (ex) {
            this.setState({
                errorInfo: ex && ex.error ? ex.error : ex,
                panelStatus: PanelStatus.ErrorPanel
            })
        }
    }

    /**
     * 取消编辑用户名
     */
    protected cancelAuth() {
        if (this.state.authError && (this.state.authError.errID === 20135 || this.state.authError.errID === 20130)) {
            this.props.doRedirect()
        }
        this.setState({
            panelStatus: PanelStatus.UserEditedPanel,
            password: '',
            authError: null
        })
    }




    /**
     * 保存所有数据
     */
    protected async saveManagerInfo() {
        if (this.state.authError && (this.state.authError.errID === 20135 || this.state.authError.errID === 20130)) {
            this.props.doRedirect()
        }

        try {
            await auth(this.props.systemType, this.props.account, this.state.password, this.appIp, {})
        } catch (ex) {
            this.setState({
                authError: ex && ex.error ? ex.error : ex
            })
            return ex;
        }

        try {

            await editAccount(this.props.systemType, this.props.adminId, this.state.account, this.appIp);
            await setAdminMailsList(this.props.systemType, this.props.adminId, this.state.mails, this.appIp);
            if (this.props.systemType === SystemType.Console) {
                manageLog(
                    ManagementOps.SET,
                    __('修改 ${name}的用户名${account}为${newAccount} 成功', {
                        name: this.props.displayName,
                        account: this.props.account,
                        newAccount: this.state.account
                    }),
                    null,
                    Level.INFO
                );
                manageLog(
                    ManagementOps.SET,
                    __('设置 邮箱 成功'),
                    this.state.mails.join(','),
                    Level.INFO
                )
            } else {
                newManageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_SET'],
                    msg: __('修改 ${name}的用户名${account}为${newAccount} 成功', {
                        name: this.props.displayName,
                        account: this.props.account,
                        newAccount: this.state.account
                    }),
                    exMsg: ''
                })
                newManageLog({
                    level: ncTLogLevel['NCT_LL_INFO'],
                    opType: ncTManagementType['NCT_MNT_SET'],
                    msg: __('设置 邮箱 成功'),
                    exMsg: this.state.mails.join(',')
                })
            }
            this.props.onEditSuccess();
        } catch (ex) {
            this.setState({
                errorInfo: ex && ex.error ? ex.error : ex,
                panelStatus: PanelStatus.ErrorPanel,
                authError: null,
                password: ''
            })
        }
    }

    /**
     * 确定错误信息
     */
    protected confirmError() {
        this.setState({
            panelStatus: PanelStatus.UserEditedPanel,
            password: '',
            authError: null
        })
    }

    isMail(value) {
        return mailAndLenth(value, 2, 100);
    }

}