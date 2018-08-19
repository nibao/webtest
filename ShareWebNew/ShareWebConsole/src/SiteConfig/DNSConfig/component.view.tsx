import * as React from 'react';
import FlexBox from '../../../ui/FlexBox/ui.desktop';
import Form from '../../../ui/Form/ui.desktop';
import ValidateBox from '../../../ui/ValidateBox/ui.desktop';
import Button from '../../../ui/Button/ui.desktop';
import ErrorDialog from '../../../ui/ErrorDialog/ui.desktop';
import DNSConfigBase from './component.base';
import { ErrorDialogStatus, PreferredAddressStatus, FirstBackupAddressStatus, SecondBackupAddressStatus } from './component.base';
import * as styles from './styles.view.css';
import __ from './locale';

export default class DNSConfig extends DNSConfigBase {
    render() {
        return (
            <div className={styles['container']}>
                <FlexBox>
                    <FlexBox.Item>
                        <div className={styles['DNS-server-address']} >
                            <div className={styles['DNS-server-address-title']}>
                                {__('DNS服务器地址')}
                            </div>
                            <Form>
                                <Form.Row>
                                    <Form.Label>
                                        <span className={styles['label-common']}>{__('首选地址：')}</span>
                                    </Form.Label>
                                    <Form.Field>
                                        <ValidateBox
                                            value={this.state.preferredAddress}
                                            onChange={(value) => { this.changeAddress('preferredAddress', 'preferredAddressStatus', value) }}
                                            validateState={this.state.validateBoxStatus.preferredAddressStatus}
                                            validateMessages={{
                                                [PreferredAddressStatus.PreferredAddressIllagel]: __('DNS地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数，请重新输入')
                                            }}
                                        />
                                    </Form.Field>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Label>
                                        <span className={styles['label-common']}>{__('备选地址1：')}</span>
                                    </Form.Label>
                                    <Form.Field>
                                        <ValidateBox
                                            value={this.state.firstBackupAddress}
                                            onChange={(value) => { this.changeAddress('firstBackupAddress', 'firstBackupAddressStatus', value) }}
                                            validateState={this.state.validateBoxStatus.firstBackupAddressStatus}
                                            validateMessages={{
                                                [FirstBackupAddressStatus.FirstBackupAddressIllagel]: __('DNS地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数，请重新输入')
                                            }}
                                        />
                                    </Form.Field>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Label>
                                        <span className={styles['label-common']}>{__('备选地址2：')}</span>
                                    </Form.Label>
                                    <Form.Field>
                                        <ValidateBox
                                            value={this.state.secondBackupAddress}
                                            onChange={(value) => { this.changeAddress('secondBackupAddress', 'secondBackupAddressStatus', value) }}
                                            validateState={this.state.validateBoxStatus.secondBackupAddressStatus}
                                            validateMessages={{
                                                [SecondBackupAddressStatus.SecondBackupAddressIllagel]: ('DNS地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数，请重新输入')
                                            }}
                                        />
                                    </Form.Field>
                                </Form.Row>
                            </Form>
                        </div>
                    </FlexBox.Item>
                </FlexBox>

                {
                    this.state.isDnsServerAddressChange ?
                        <div className={styles['button']} >
                            <Button
                                className={styles['save-button']}
                                onClick={this.completeDNSServerAddress.bind(this)}
                            >
                                {__('保存')}
                            </Button>
                            <Button
                                onClick={this.cancelDNSServerAddress.bind(this)}
                            >
                                {__('取消')}
                            </Button>
                        </div>
                        : null
                }

                {
                    this.state.errorDialogStatus === ErrorDialogStatus.ErrorDialog ?
                        <ErrorDialog onConfirm={this.closeDialog.bind(this)}>
                            <ErrorDialog.Title>
                                {__('保存失败。错误信息如下：')}
                            </ErrorDialog.Title>
                            <ErrorDialog.Detail>
                                {this.state.errorMsg}
                            </ErrorDialog.Detail>
                        </ErrorDialog>
                        : null
                }
            </div>
        )
    }
}
