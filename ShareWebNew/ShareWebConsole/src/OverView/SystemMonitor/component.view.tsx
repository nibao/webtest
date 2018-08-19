import * as React from 'react';
import { mail } from '../../../util/validators/validators';
import { Card, UIIcon, FlexBox, Form, Dialog2 as Dialog, Panel, TextArea, Button, SwitchButton2 as SwitchButton, ComboArea, HeadBar, LinkChip, MessageDialog, ErrorDialog } from '../../../ui/ui.desktop';
import SystemMonitorBase from './component.base';
import __ from './locale';
import * as styles from './styles.view.css';

export default class SystemMonitor extends SystemMonitorBase {
    render() {
        return (
            <div className={styles['contain']}>
                <Card>
                    <HeadBar>
                        {
                            __('系统监控')
                        }
                    </HeadBar>
                    {
                        this.state.zabbixStatus ?
                            (
                                <div className={styles['form']}>
                                    <div className={styles['alert-status']}>
                                        <div className={styles['alert-status-item']}>
                                            {
                                                __('系统告警：')
                                            }
                                        </div>
                                        <div className={styles['alert-status-item']}>
                                            <div className={styles['switch']}>
                                                <SwitchButton
                                                    active={this.state.alertStatus}
                                                    onChange={this.switchStatus.bind(this)}
                                                />
                                            </div>
                                            <div className={styles['switch']}>
                                                <span>
                                                    {
                                                        __('请及时')
                                                    }
                                                </span>
                                                <LinkChip className={styles['mail-btn']} onClick={this.setAlertMail.bind(this)}>
                                                    {
                                                        __('设置邮箱')
                                                    }
                                                </LinkChip>
                                                <span>
                                                    {
                                                        __('，否则无法收到告警邮件。')
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <FlexBox>
                                        <FlexBox.Item align="top">
                                            <Form>
                                                <Form.Row>
                                                    <Form.Label>
                                                        {
                                                            __('系统服务状态：')
                                                        }
                                                    </Form.Label>
                                                    <Form.Field>
                                                        {
                                                            this.state.alertInfo.System_service_status === -1 ?
                                                                '---' :
                                                                this.state.alertInfo.System_service_status ?
                                                                    (
                                                                        <span className={styles['warn-normal']}>
                                                                            {
                                                                                __('正常')
                                                                            }
                                                                        </span>
                                                                    ) :
                                                                    (
                                                                        <span className={styles['warn-error']}>
                                                                            {
                                                                                __('异常')
                                                                            }
                                                                        </span>
                                                                    )
                                                        }
                                                    </Form.Field>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Label>
                                                        {
                                                            __('服务器状态：')
                                                        }
                                                    </Form.Label>
                                                    <Form.Field>
                                                        {
                                                            this.state.alertInfo.Server_status === -1 ?
                                                                '---' :
                                                                this.state.alertInfo.Server_status ?
                                                                    (
                                                                        <span className={styles['warn-normal']}>
                                                                            {
                                                                                __('正常')
                                                                            }
                                                                        </span>
                                                                    ) :
                                                                    (
                                                                        <span className={styles['warn-error']}>
                                                                            {
                                                                                __('异常')
                                                                            }
                                                                        </span>
                                                                    )
                                                        }
                                                    </Form.Field>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Label>
                                                        {
                                                            __('数据库状态：')
                                                        }
                                                    </Form.Label>
                                                    <Form.Field>
                                                        {
                                                            this.state.alertInfo.Database_sync_status === -1 ?
                                                                '---' :
                                                                this.state.alertInfo.Database_sync_status ?
                                                                    (
                                                                        <span className={styles['warn-normal']}>
                                                                            {
                                                                                __('正常')
                                                                            }
                                                                        </span>
                                                                    ) :
                                                                    (
                                                                        <span className={styles['warn-error']}>
                                                                            {
                                                                                __('异常')
                                                                            }
                                                                        </span>
                                                                    )
                                                        }
                                                    </Form.Field>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Label>
                                                        {
                                                            __('存储池设备状态：')
                                                        }
                                                    </Form.Label>
                                                    <Form.Field>
                                                        {
                                                            this.state.alertInfo.Storage_pool_available_space === -1 ?
                                                                '---' :
                                                                this.state.alertInfo.Storage_pool_available_space ?
                                                                    (
                                                                        <span className={styles['warn-normal']}>
                                                                            {
                                                                                __('正常')
                                                                            }
                                                                        </span>
                                                                    ) :
                                                                    (
                                                                        <span className={styles['warn-error']}>
                                                                            {
                                                                                __('异常')
                                                                            }
                                                                        </span>
                                                                    )
                                                        }
                                                    </Form.Field>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Label>
                                                        {
                                                            __('RAID设备状态：')
                                                        }
                                                    </Form.Label>
                                                    <Form.Field>
                                                        {
                                                            this.state.alertInfo.RAID_device_status === -1 ?
                                                                '---' :
                                                                this.state.alertInfo.RAID_device_status ?
                                                                    (
                                                                        <span className={styles['warn-normal']}>
                                                                            {
                                                                                __('正常')
                                                                            }
                                                                        </span>
                                                                    ) :
                                                                    (
                                                                        <span className={styles['warn-error']}>
                                                                            {
                                                                                __('异常')
                                                                            }
                                                                        </span>
                                                                    )
                                                        }
                                                    </Form.Field>
                                                </Form.Row>
                                            </Form>
                                        </FlexBox.Item>
                                        <FlexBox.Item align="top">
                                            <div className={styles['line']}>
                                            </div>
                                        </FlexBox.Item>
                                        <FlexBox.Item align="top">
                                            <Form>
                                                <Form.Row>
                                                    <Form.Label>
                                                        {
                                                            __('SSD硬盘状态：')
                                                        }
                                                    </Form.Label>
                                                    <Form.Field>
                                                        {
                                                            this.state.alertInfo.SSD_device_status === -1 ?
                                                                '---' :
                                                                this.state.alertInfo.SSD_device_status ?
                                                                    (
                                                                        <span className={styles['warn-normal']}>
                                                                            {
                                                                                __('正常')
                                                                            }
                                                                        </span>
                                                                    ) :
                                                                    (
                                                                        <span className={styles['warn-error']}>
                                                                            {
                                                                                __('异常')
                                                                            }
                                                                        </span>
                                                                    )
                                                        }
                                                    </Form.Field>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Label>
                                                        {
                                                            __('系统卷状态：')
                                                        }
                                                    </Form.Label>
                                                    <Form.Field>
                                                        {
                                                            this.state.alertInfo.System_volume_status === -1 ?
                                                                '---' :
                                                                this.state.alertInfo.System_volume_status ?
                                                                    (
                                                                        <span className={styles['warn-normal']}>
                                                                            {
                                                                                __('正常')
                                                                            }
                                                                        </span>
                                                                    ) :
                                                                    (
                                                                        <span className={styles['warn-error']}>
                                                                            {
                                                                                __('异常')
                                                                            }
                                                                        </span>
                                                                    )
                                                        }
                                                    </Form.Field>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Label>
                                                        {
                                                            __('缓存卷状态：')
                                                        }
                                                    </Form.Label>
                                                    <Form.Field>
                                                        {
                                                            this.state.alertInfo.Cache_volume_status === -1 ?
                                                                '---' :
                                                                this.state.alertInfo.Cache_volume_status ?
                                                                    (
                                                                        <span className={styles['warn-normal']}>
                                                                            {
                                                                                __('正常')
                                                                            }
                                                                        </span>
                                                                    ) :
                                                                    (
                                                                        <span className={styles['warn-error']}>
                                                                            {
                                                                                __('异常')
                                                                            }
                                                                        </span>
                                                                    )
                                                        }
                                                    </Form.Field>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Label>
                                                        {
                                                            __('存储池剩余空间：')
                                                        }
                                                    </Form.Label>
                                                    <Form.Field>
                                                        {
                                                            this.state.alertInfo.Storage_pool_available_space === -1 ?
                                                                '---' :
                                                                this.state.alertInfo.Storage_pool_available_space ?
                                                                    (
                                                                        <span className={styles['warn-normal']}>
                                                                            {
                                                                                __('正常')
                                                                            }
                                                                        </span>
                                                                    ) :
                                                                    (
                                                                        <span className={styles['warn-error']}>
                                                                            {
                                                                                __('异常')
                                                                            }
                                                                        </span>
                                                                    )
                                                        }
                                                    </Form.Field>
                                                </Form.Row>
                                                <Form.Row>
                                                </Form.Row>
                                            </Form>

                                        </FlexBox.Item>
                                    </FlexBox>
                                    <div className={styles['view-listen']}>
                                        <LinkChip
                                            onClick={this.props.doSystemDetailRedirect}
                                            className={styles['link-btn']}
                                        >
                                            {
                                                __('查看监控详情')
                                            }
                                        </LinkChip>
                                    </div>
                                </div>
                            )
                            :
                            (
                                <div className={styles['warn']}>

                                    <FlexBox>
                                        <FlexBox.Item align={'center middle'}>
                                            <div className={styles['icon-warn']}>
                                                <UIIcon code="\uf021" size={64} />
                                            </div>
                                            <span>
                                                {
                                                    __('当前系统未启用监控服务，无法获取系统状态。')
                                                }
                                            </span>
                                        </FlexBox.Item>
                                    </FlexBox>
                                </div>

                            )
                    }

                </Card>

                {
                    this.state.mails ?
                        (
                            <Dialog
                                title={__('设置邮箱')}
                                onClose={this.cancelMails.bind(this)}
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
                                                        value={this.state.mails}
                                                        onChange={value => { this.changeMails(value) }}
                                                        placeholder={__('请输入邮箱地址，允许输入多个，用空格隔开')}
                                                        validator={mail}
                                                        spliter={[';', ',', ' ']}
                                                    />
                                                </div>
                                                <div className={styles['test-btn-site']}>
                                                    <Button
                                                        disabled={this.state.mails.length === 0}
                                                        onClick={this.testMails.bind(this)}
                                                        className={styles['test-btn-size']}
                                                    >
                                                        {__('测试')}
                                                    </Button>
                                                </div>

                                            </div>
                                        </div>
                                    </Panel.Main>
                                    <Panel.Footer>
                                        <Panel.Button
                                            disabled={!this.state.mails}
                                            onClick={this.confirmMails.bind(this)}
                                        >
                                            {
                                                __('确定')
                                            }
                                        </Panel.Button>
                                        <Panel.Button
                                            onClick={this.cancelMails.bind(this)}
                                        >
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
                    this.state.testMailSuccess ?
                        (<MessageDialog onConfirm={this.closeTestSuccess.bind(this)}>
                            {
                                __('测试邮件已成功发送，请您登录指定的邮箱地址查看')
                            }
                        </MessageDialog>) :
                        null
                }

                {
                    this.state.error ?
                        this.getErrorTemplate(this.state.error) :
                        null
                }
            </div >
        )
    }

    getErrorTemplate(error) {
        const errorMessages = {
            [SystemMonitorBase.ErrorReason.GetAlertStatusFail]: __('获取告警开关状态失败，错误信息如下：'),
            [SystemMonitorBase.ErrorReason.GetAlertTriggerStatusFail]: __('获取系统状态失败，错误信息如下：'),
            [SystemMonitorBase.ErrorReason.GetMailsFail]: __('获取邮箱失败，错误信息如下：'),
            [SystemMonitorBase.ErrorReason.TestMailFail]: __('测试邮箱失败，错误信息如下：'),
            [SystemMonitorBase.ErrorReason.SetMailsFail]: __('设置邮箱失败，错误信息如下：'),
            [SystemMonitorBase.ErrorReason.OpenAlertFail]: __('开启系统告警失败，错误信息如下：'),
            [SystemMonitorBase.ErrorReason.CloseAlertFail]: __('关闭系统告警失败，错误信息如下：')
        }

        return (
            <ErrorDialog onConfirm={this.closeErrorDialog.bind(this)} >
                <ErrorDialog.Title>
                    {
                        errorMessages[error.errorReason]
                    }
                </ErrorDialog.Title>
                <ErrorDialog.Detail>
                    {
                        error.errorInfo.expMsg ?
                            error.errorInfo.expMsg :
                            error.errorInfo
                    }
                </ErrorDialog.Detail>
            </ErrorDialog>
        )

    }

}