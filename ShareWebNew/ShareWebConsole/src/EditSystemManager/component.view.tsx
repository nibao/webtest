import * as React from 'react';
import * as classnames from 'classnames';
import { getErrorMessage } from '../../core/exception/exception'
import { Dialog2 as Dialog, Panel, TextBox, ComboArea, ValidateBox, Button, Form, MessageDialog } from '../../ui/ui.desktop';
import EditSystemManagerBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

export default class EditSystemManager extends EditSystemManagerBase {

    render() {
        return (
            <div>
                {
                    this.state.panelStatus === EditSystemManagerBase.PanelStatus.UserEditedPanel ?
                        (
                            <Dialog title={__('账号设置')} onClose={this.props.onEditCancel}>
                                <Panel>
                                    <Panel.Main>
                                        <Form>
                                            <Form.Row>
                                                <Form.Label>
                                                    {
                                                        __('用户名：')
                                                    }
                                                </Form.Label>
                                                <Form.Field>
                                                    <ValidateBox
                                                        value={this.state.account}
                                                        onChange={this.changeAccount.bind(this)}
                                                        validateMessages={{
                                                            [EditSystemManagerBase.ValidateType.AccountValidateResult]: __('用户名不能包含 空格 或 \ / : * ? " < > | 特殊字符，请重新输入。')
                                                        }}
                                                        width={300}
                                                        validateState={this.state.accountValidate}
                                                    />
                                                    <span className={styles['username-tip']}>*</span>
                                                </Form.Field>

                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Label>
                                                    {
                                                        __('显示名：')
                                                    }
                                                </Form.Label>
                                                <Form.Field>
                                                    <TextBox width={300} value={this.props.displayName} disabled={true} />
                                                </Form.Field>

                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Label>
                                                    {
                                                        __('邮箱地址：')
                                                    }
                                                </Form.Label>
                                                <Form.Field>
                                                    <div className={styles['mail']}>
                                                        <div className={styles['mail-input']}>
                                                            <div className={styles['mail-size']}>
                                                                <ComboArea
                                                                    minHeight={50}
                                                                    width={'100%'}
                                                                    value={this.state.mails}
                                                                    onChange={value => { this.changeMails(value) }}
                                                                    placeholder={__('允许输入多个，用空格隔开')}
                                                                    validator={this.isMail}
                                                                    spliter={[';', ',', ' ']}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className={styles['mail-test']}>
                                                            <Button disabled={!this.state.mails.length} onClick={this.testMail.bind(this)}>
                                                                {
                                                                    __('测试')
                                                                }
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Form.Field>

                                            </Form.Row>
                                        </Form>
                                    </Panel.Main>
                                    <Panel.Footer>
                                        <Panel.Button disabled={!this.state.account} onClick={this.confirmAccount.bind(this)}>
                                            {
                                                __('确定')
                                            }
                                        </Panel.Button>
                                        <Panel.Button onClick={this.props.onEditCancel}>
                                            {
                                                __('取消')
                                            }
                                        </Panel.Button>
                                    </Panel.Footer>
                                </Panel>
                            </Dialog>
                        ) :
                        null
                }

                {
                    this.state.panelStatus === EditSystemManagerBase.PanelStatus.PasswordPanel ?
                        (
                            <Dialog title={__('安全验证')} onClose={this.cancelAuth.bind(this)}>
                                <Panel>
                                    <Panel.Main>
                                        <Form>
                                            <Form.Row>
                                                <Form.Label>
                                                    {
                                                        __('请输入您的登录密码：')
                                                    }
                                                </Form.Label>
                                                <Form.Field>
                                                    <div>
                                                        <TextBox type="password" value={this.state.password} onChange={this.changePassword.bind(this)} />
                                                    </div>

                                                </Form.Field>
                                            </Form.Row>
                                        </Form>
                                        <div className={styles['auth-error']}>
                                            {
                                                this.state.authError && this.state.authError.errID ?
                                                    this.getErrorMessage(this.state.authError.errID) :
                                                    null
                                            }
                                        </div>
                                    </Panel.Main>
                                    <Panel.Footer>
                                        <Panel.Button disabled={!this.state.password} onClick={this.saveManagerInfo.bind(this)}>
                                            {
                                                __('确定')
                                            }
                                        </Panel.Button>
                                        <Panel.Button onClick={this.cancelAuth.bind(this)}>
                                            {
                                                __('取消')
                                            }
                                        </Panel.Button>
                                    </Panel.Footer>
                                </Panel>
                            </Dialog>
                        ) :
                        null
                }

                {
                    this.state.panelStatus === EditSystemManagerBase.PanelStatus.ErrorPanel ?
                        (
                            <MessageDialog onConfirm={this.confirmError.bind(this)}>
                                {
                                    getErrorMessage(this.state.errorInfo.errID)
                                }
                            </MessageDialog>
                        ) :
                        null
                }
                {
                    this.state.panelStatus === EditSystemManagerBase.PanelStatus.TestMailSuccess ?
                        (
                            <MessageDialog onConfirm={this.confirmError.bind(this)}>
                                {
                                    __('测试邮件已成功发送，请您登录指定的邮箱地址查看')
                                }
                            </MessageDialog>
                        ) :
                        null
                }
            </div>

        )
    }

    getErrorMessage(errorcode) {
        switch (errorcode) {
            case 20108:
                return __('密码不正确');
            case 20130:
                return __('您输入错误次数超过限制，账号已被锁定，${time}分钟内无法登录，请稍后重试。', {
                    time: JSON.parse(this.state.authError.errDetail).remainlockTime
                });
            case 20135:
                return __('您输入错误次数超过限制，账号已被锁定，${time}分钟内无法登录，请稍后重试。', {
                    time: JSON.parse(this.state.authError.errDetail).remainlockTime
                });
            default:
                return getErrorMessage(errorcode);

        }
    }
}