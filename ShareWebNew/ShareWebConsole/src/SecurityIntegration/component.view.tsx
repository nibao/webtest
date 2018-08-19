import * as React from 'react';
import * as classnames from 'classnames';
import { map } from 'lodash';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import Button from '../../ui/Button/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop';
import TextBox from '../../ui/TextBox/ui.desktop';
import ConfirmDialog from '../../ui/ConfirmDialog/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import SecurityIntegrationBase from './component.base';
import { Status } from './helper';
import __ from './locale';
import * as styles from './styles.css';
import * as deletee from './assets/deletee.png';

export default class SecurityIntegration extends SecurityIntegrationBase {

    render() {
        return (
            <div className={styles.container}>
                {
                    this.state.init ?
                        <Dialog
                            width="850"
                            title={__('初始化配置')}
                            buttons={[]}
                        >
                            {
                                this.state.openCustomSecurity ?
                                    this.CustomSecurityClassification()
                                    : null
                            }
                            {
                                this.state.isConfirmSecuInit ?
                                    this.ConfirmSecuInit()
                                    : null
                            }
                            {
                                this.state.isConfirmCustSecu ?
                                    this.ConfirmCustomSecu()
                                    : null
                            }
                            <Panel>
                                <Panel.Main>
                                    <div className={styles['info-content-header']}>
                                        <UIIcon
                                            size="16"
                                            code={'\uf016'}
                                        />
                                        <label className={styles['info-header-title']}>{__('系统密级策略')}</label>
                                    </div>
                                    <Form>
                                        <Form.Row>
                                            <Form.Label>
                                                <div className={styles['security-label']}>{__('系统密级：')}</div>
                                            </Form.Label>
                                            <Form.Field>
                                                <div className={styles['dropbox-first']}>
                                                    {
                                                        <Select
                                                            onChange={this.selectSecurity.bind(this)}
                                                            value={this.state.csfLevel}
                                                        >
                                                            {
                                                                map(this.state.customedSecurity, (security, index) => {
                                                                    return <Select.Option
                                                                        value={index + this.sysLevel}
                                                                        selected={index + this.sysLevel === this.state.csfLevel}
                                                                    >
                                                                        {security}
                                                                    </Select.Option>
                                                                })
                                                            }
                                                        </Select>
                                                    }
                                                </div>
                                            </Form.Field>
                                            <Form.Field>
                                                {
                                                    this.state.isCustomed ?
                                                        null :
                                                        <Button
                                                            className={styles['security-classification']}
                                                            onClick={this.customSecurityClassification.bind(this)}
                                                        >
                                                            {__('自定义密级')}
                                                        </Button>
                                                }
                                            </Form.Field>
                                        </Form.Row>
                                    </Form>
                                    <div className={styles['security-comment']}>{__('系统密级是指服务器的最高密级等级，系统中任何用户和文件的密级都不能高于此密级上限')}</div>

                                    <div className={styles['info-content-header']}>
                                        <UIIcon
                                            size="16"
                                            code={'\uf016'}
                                        />
                                        <label className={styles['info-header-title']}>{__('密码策略')}</label>
                                    </div>
                                    <Form>
                                        <Form.Row>
                                            <Form.Label>
                                                <div className={styles['security-label']}>{__('密码有效期：')}</div>
                                            </Form.Label>
                                            <Form.Field>
                                                <div className={styles['dropbox-second']}>
                                                    {
                                                        this.state.isSecretMode ?
                                                            <Select
                                                                onChange={this.selectPasswordExpiration.bind(this)}
                                                                value={this.state.expireTime}
                                                            >
                                                                <Select.Option value={1} selected={this.state.expireTime === 1}>{__('1天')}</Select.Option>
                                                                <Select.Option value={3} selected={this.state.expireTime === 3}>{__('3天')}</Select.Option>
                                                                <Select.Option value={7} selected={this.state.expireTime === 7}>{__('7天')}</Select.Option>
                                                            </Select>
                                                            :
                                                            <Select
                                                                onChange={this.selectPasswordExpiration.bind(this)}
                                                                value={this.state.expireTime}
                                                            >
                                                                <Select.Option value={1} selected={this.state.expireTime === 1}>{__('1天')}</Select.Option>
                                                                <Select.Option value={3} selected={this.state.expireTime === 3}>{__('3天')}</Select.Option>
                                                                <Select.Option value={7} selected={this.state.expireTime === 7}>{__('7天')}</Select.Option>
                                                                <Select.Option value={30} selected={this.state.expireTime === 30}>{__('1个月')}</Select.Option>
                                                                <Select.Option value={90} selected={this.state.expireTime === 90}>{__('3个月')}</Select.Option>
                                                                <Select.Option value={180} selected={this.state.expireTime === 180}>{__('6个月')}</Select.Option>
                                                                <Select.Option value={365} selected={this.state.expireTime === 365}>{__('12个月')}</Select.Option>
                                                                <Select.Option value={-1} selected={this.state.expireTime === -1}>{__('永久有效')}</Select.Option>
                                                            </Select>
                                                    }
                                                </div>
                                            </Form.Field>
                                        </Form.Row>
                                    </Form>
                                    <div className={styles['password-comment']}>{__('密码仅在指定时间段内有效，若超过该有效期，则需要修改密码，否则无法登录')}</div>
                                    <Form>
                                        <Form.Row>
                                            <Form.Label>
                                                <div className={styles['security-label']}>{__('密码强度：')}</div>
                                            </Form.Label>
                                            <Form.Field>
                                                <Select
                                                    value={this.state.strongPassword ? 1 : 0}
                                                    onChange={this.selectPasswordStrength.bind(this)}
                                                    disabled={this.state.isSecretMode}
                                                >
                                                    <Select.Option value={1} selected={this.state.isSecretMode}>{__('强密码')}</Select.Option>
                                                    <Select.Option value={0} selected={!this.state.isSecretMode}>{__('弱密码')}</Select.Option>
                                                </Select>
                                            </Form.Field>
                                        </Form.Row>
                                    </Form>
                                    {

                                        this.state.strongPassword ?
                                            <div className={styles['password-comment']}>{__('强密码格式：密码长度至少为8个字符，需同时包含大小写字母及数字')}</div>
                                            :
                                            <div className={styles['password-comment']}>{__('弱密码格式：密码长度至少为6个字符')}</div>
                                    }
                                    <div className={styles['pass-lock']}>
                                        <CheckBoxOption
                                            onChange={this.setPasswordLock.bind(this)}
                                            checked={this.state.lockStatus}
                                            disabled={this.state.isSecretMode}
                                        >
                                            {__('启用密码错误锁定：')}
                                        </CheckBoxOption>
                                    </div>
                                    <div>
                                        <div className={styles['comment-start']}>{__('用户登录时，若连续输错密码')}</div>
                                        <div className={styles['inline-layout']}>
                                            <TextBox
                                                width={50}
                                                value={this.state.passwdErrCnt}
                                                onChange={cnt => this.handleErrCntChange(cnt)}
                                                disabled={!this.state.lockStatus}
                                            />
                                            <UIIcon
                                                className={styles['triangle-up']}
                                                size={16}
                                                code={'\uf019'}
                                                onClick={this.errCntAdd.bind(this)}
                                            />
                                            <UIIcon
                                                className={styles['triangle-down']}
                                                size={16}
                                                code={'\uf01A'}
                                                onClick={this.errCntSub.bind(this)}
                                            />
                                        </div>
                                        <label className={styles['comment-after']}>{__('次，则账号将被锁定，1小时后自动解锁或由管理员手动解锁（涉密模式下不自动解锁）')}</label>
                                    </div>
                                    {
                                        this.renderValidateError(this.state.validatePwdStatus)
                                    }
                                </Panel.Main>
                                <Panel.Footer>
                                    <Panel.Button
                                        onClick={this.triggerConfirmInit.bind(this)}
                                        disabled={this.state.validatePwdStatus === Status.COUNT_RANGE_ERROR}
                                    >
                                        {__('确定')}
                                    </Panel.Button>
                                </Panel.Footer>
                            </Panel>
                        </Dialog>
                        : null
                }
            </div>
        )
    }

    /**
     * 自定义密级对话框
     */
    CustomSecurityClassification() {
        return (
            <Dialog
                width={430}
                title={__('自定义密级')}
                onClose={this.closeCustomSecurity.bind(this)}
            >
                <Panel>
                    <Panel.Main>
                        <div className={styles['custom-security-comment']}>{__('请从低到高依次定义新的密级：')}</div>
                        <Button onClick={this.openSecurityTextBox.bind(this)} >{__('新增密级')}</Button>
                        <ul id="ul-scroll-list"
                            className={styles['list']}
                        >
                            {
                                map(this.state.customSecu, (item, index) =>
                                    <li
                                        className={classnames(styles['li'], { [styles['li-even']]: index % 2 !== 0 })}
                                        key={index}
                                    >
                                        <div className={styles['temp-li']}>
                                            <span className={styles['custom-secu-name']} title={item}>{item}</span>
                                            {
                                                !this.state.addSecurity
                                                    ?
                                                    <div className={styles['delete-secu']}>
                                                        <UIIcon
                                                            size={16}
                                                            fallback={deletee}
                                                            code={'\uf013'}
                                                            onClick={this.deleteSecurity.bind(this, index)}
                                                        />
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                    </li>
                                )
                            }

                            {
                                this.state.addSecurity ?
                                    <li className={styles['add-li']}>
                                        <TextBox
                                            width={200}
                                            value={this.state.addedRecord}
                                            validator={this.nameOutLength.bind(this)}
                                            onChange={record => { this.handleSecuChange(record) }}
                                        />
                                        <UIIcon
                                            className={styles['save-edit']}
                                            size={16}
                                            code={'\uf00A'}
                                            onClick={this.saveEdit.bind(this)}
                                        />
                                        <UIIcon
                                            className={styles['cancel-edit']}
                                            size={16}
                                            code={'\uf017'}
                                            onClick={this.cancelEdit.bind(this)}
                                        />
                                    </li>
                                    : null
                            }
                        </ul>
                        {
                            this.renderValidateError(this.state.validateSecuStatus)
                        }
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button
                            onClick={this.triggerConfirmCust.bind(this)}
                            disabled={this.state.customSecu.length === 0}
                        >
                            {__('确定')}
                        </Panel.Button>
                        <Panel.Button onClick={this.closeCustomSecurity.bind(this)}>
                            {__('取消')}
                        </Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog>
        )
    }

    /**
     * 确认初始化操作Dialog
     */
    ConfirmSecuInit() {
        return (
            <ConfirmDialog onConfirm={this.setSecuInit.bind(this)} onCancel={this.cancelInit.bind(this)}>
                <div className={styles['confirm-msg']}>{__('当前为涉密模式，初始化配置完成后将无法更改，请确认您的操作。')}</div>
            </ConfirmDialog>
        )
    }

    /**
     * 确认自定义密级
     */
    ConfirmCustomSecu() {
        return (
            <ConfirmDialog onConfirm={this.setCustomedSecurity.bind(this)} onCancel={this.cancelCustom.bind(this)}>
                <div className={styles['confirm-msg']}>{__('自定义密级完成后将无法更改系统中各个密级等级，请确认您的操作。')}</div>
            </ConfirmDialog>
        )
    }

    renderValidateError(status) {
        switch (status) {
            case Status.OK:
                return null

            case Status.COUNT_RANGE_ERROR:
                return <div className={styles['errcnt']}>{__('密码错误次数范围为1~${num}，请重新输入。', { num: this.state.isSecretMode ? 5 : 99 })}</div>

            case Status.FORBIDDEN_SPECIAL_CHARACTER:
                return <div className={styles['errmsg']}>{__('不能包含 / : * ? " < > | 特殊字符，请重新输入。')}</div>

            case Status.SECU_OUT_SUM:
                return <div className={styles['errmsg']}>{__('您最多只能设置11个密级。')}</div>

            case Status.DUPLICATE_NAMES_ERROR:
                return <div className={styles['errmsg']}>{__('该密级名称已存在。')}</div>

            case Status.EMPTY_NAME:
                return <div className={styles['errmsg']}>{__('密级名不能为空。')}</div>
        }
    }
}