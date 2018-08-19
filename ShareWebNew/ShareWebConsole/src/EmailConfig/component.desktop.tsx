import * as React from 'react';
import * as classnames from 'classnames';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import ComboArea from '../../ui/ComboArea/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import SuccessDialog from '../../ui/SuccessDialog/ui.desktop';
import SwitchButton from '../../ui/SwitchButton/ui.desktop';
import Locator from '../../ui/Locator/ui.desktop';
import ValidateTip from '../../ui/ValidateTip/ui.desktop';
import { getErrorMessage } from '../../core/exception/exception';
import EmailConfigBase from './component.base';
import { ErrorType } from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';

export default class EmailConfig extends EmailConfigBase {

    render() {
        return (
            <div className={styles['container']}>
                <Dialog
                    title={__('设置邮箱')}
                    onClose={this.cancelSetEmail.bind(this)}
                    >
                    <Panel>
                        <Panel.Main>
                            <div >
                                <div>
                                    <div className={styles['left-label']}>
                                        {__('邮箱地址：')}
                                    </div>
                                    <div className={styles['combo-area']}>
                                        <ComboArea
                                            minHeight={50}
                                            width={'100%'}
                                            value={this.state.data}
                                            onChange={value => { this.onEmailChange(value) } }
                                            placeholder={__('请输入邮箱地址，允许输入多个，用空格隔开')}
                                            spliter={[';', ',', ' ']}
                                            />
                                        {
                                            !this.state.validEmailFormat ?
                                                <div className={styles['validate-message']}>
                                                    <ValidateTip>
                                                        {
                                                            __('邮箱地址只能包含 英文、数字 及 @-_. 字符，格式形如 XXX@XXX，长度范围 3~100 个字符，请重新输入。')
                                                        }
                                                    </ValidateTip>
                                                </div>
                                                :
                                                null
                                        }
                                    </div>

                                </div>
                                <div className={styles['button-container']}>
                                    <div className={styles['left-label']}>
                                    </div>

                                    <Button disabled={this.state.data.length === 0} onClick={this.testMail.bind(this)}>
                                        {__('测试')}
                                    </Button>

                                </div>
                                {
                                    this.props.username === 'audit' ?
                                        <div className={styles['button-container']}>
                                            <div className={styles['form-data']}>
                                                {__('接收securit修改下载次数阈值通知：')}
                                            </div>
                                            <div className={styles['form-data']}>
                                                <SwitchButton onChange={this.onSwitchChange.bind(this)} active={this.state.active} />
                                            </div>
                                        </div>
                                        :
                                        null
                                }

                            </div>
                        </Panel.Main>
                        <Panel.Footer>
                            <Panel.Button type="submit" onClick={this.setEmails.bind(this)}>
                                {__('确定')}
                            </Panel.Button>
                            <Panel.Button type="submit" onClick={this.cancelSetEmail.bind(this)}>
                                {__('取消')}
                            </Panel.Button>
                        </Panel.Footer>
                    </Panel>
                </Dialog>
                {
                    this.state.errorType === ErrorType.NORMAL ? null : this.showErrorMsg(this.state.errorType)
                }
                {
                    this.state.success ? this.showSuccessMsg() : null
                }
            </div>
        )
    }


    showErrorMsg(error) {
        return (
            <MessageDialog onConfirm={this.closeErrorDialog.bind(this)}>
                <p>
                    {
                        getErrorMessage(error)
                    }
                </p>
            </MessageDialog>
        )
    }

    // 邮件发送成功的提示
    showSuccessMsg() {
        return (
            <SuccessDialog onConfirm={this.closeSuccessDialog.bind(this)}>
                {__('测试邮件已成功发送，请您登录指定的邮箱地址查看')}
            </SuccessDialog>
        )
    }

}