import * as React from 'react';
import FlexBox from '../../../ui/FlexBox/ui.desktop';
import ValidateBox from '../../../ui/ValidateBox/ui.desktop';
import Form from '../../../ui/Form/ui.desktop';
import Button from '../../../ui/Button/ui.desktop';
import ErrorDialog from '../../../ui/ErrorDialog/ui.desktop';
import ProgressCircle from '../../../ui/ProgressCircle/ui.desktop';
import { AppServiceAccessingAddressStatus, ObjectStorageAccessingAddressStatus, WebHttpsValidateState, WebHttpValidateState, ObjHttpValidateState, ObjHttpsValidateState, DialogStatus } from './component.base';
import AppConfigBase from './component.base';
import * as styles from './styles.view.css';
import __ from './locale';

export default class AppConfig extends AppConfigBase {
    render() {
        return (
            <div className={styles['accessing-tabs']}>
                <div className={styles['flexBox-container']}>
                    <FlexBox>
                        <FlexBox.Item align={'left top'}>
                            <div className={styles['accessing-tabs-common']}>
                                <div className={styles['address-vertical']}>
                                    <div className={styles['title-common']}>
                                        {__('应用服务')}
                                    </div>
                                    <Form>
                                        <Form.Row>
                                            <Form.Label>
                                                <span className={styles['label-common']}>{__('访问地址：')}</span>
                                            </Form.Label>
                                            <Form.Field>
                                                <ValidateBox
                                                    className={styles['validateBox-style']}
                                                    validateState={this.state.appServiceAccessingAddressStatus}
                                                    validateMessages={{
                                                        [AppServiceAccessingAddressStatus.AppNodeEmpty]: __('请设置应用节点'),
                                                        [AppServiceAccessingAddressStatus.Empty]: __('此输入项不允许为空'),
                                                        [AppServiceAccessingAddressStatus.ErrorEnglishLetter]: __('域名只能包含 英文、数字 及 -. 字符，长度范围 3~20 个字符，请重新输入'),
                                                        [AppServiceAccessingAddressStatus.ErrorNoEnglish]: __('IP地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数，请重新输入')
                                                    }}
                                                    value={this.state.appServiceAccessingAddress}
                                                    onChange={(value) => this.changeAppServiceAccessingAddress(value)}
                                                />
                                                <span className={styles['must-mark']}>*</span>
                                            </Form.Field>
                                        </Form.Row>

                                        <Form.Row>
                                            <Form.Label>
                                                <span className={styles['label-common']}>{__('Web客户端https端口：')}</span>
                                            </Form.Label>
                                            <Form.Field>
                                                <ValidateBox
                                                    className={styles['validateBox-style']}
                                                    validateState={this.state.webClientHttpsStatus}
                                                    validateMessages={{
                                                        [WebHttpsValidateState.AppNodeEmpty]: __('请设置应用节点'),
                                                        [WebHttpsValidateState.Empty]: __('此输入项不允许为空'),
                                                        [WebHttpsValidateState.InputError]: __('端口号必须是 1~65535 之间的整数，请重新输入'),
                                                    }}
                                                    value={this.state.webClientPort.https}
                                                    onChange={(value) => this.changeWebHttps(value)}
                                                />
                                                <span className={styles['must-mark']}>*</span>
                                            </Form.Field>
                                        </Form.Row>

                                        <Form.Row>
                                            <Form.Label>
                                                <span className={styles['label-common']}>{__('Web客户端http端口：')}</span>
                                            </Form.Label>
                                            <Form.Field>
                                                <ValidateBox
                                                    className={styles['validateBox-style']}
                                                    validateState={this.state.webClientHttpStatus}
                                                    validateMessages={{
                                                        [WebHttpValidateState.AppNodeEmpty]: __('请设置应用节点'),
                                                        [WebHttpValidateState.Empty]: __('此输入项不允许为空'),
                                                        [WebHttpValidateState.InputError]: __('端口号必须是 1~65535 之间的整数，请重新输入'),
                                                    }}
                                                    value={this.state.webClientPort.http}
                                                    onChange={(value) => this.changeWebHttp(value)}
                                                />
                                                <span className={styles['must-mark']}>*</span>
                                            </Form.Field>
                                        </Form.Row>
                                    </Form>
                                </div>
                                {
                                    this.state.isAppServiceChanged === true ?
                                        <div className={styles['button-position']}>
                                            <Button
                                                className={styles['button-common']}
                                                onClick={this.completeAppService.bind(this)}>{__('保存')}
                                            </Button>
                                            <Button
                                                className={styles['button-common']}
                                                onClick={this.cancelAppService.bind(this)}
                                            >{__('取消')}</Button>
                                        </div>
                                        : null
                                }
                            </div>
                        </FlexBox.Item>

                        {
                            this.state.thirdPartyOSSInfo && this.state.thirdPartyOSSInfo.provider === '' ?
                                <FlexBox.Item align={'left top'}>
                                    <div className={styles['accessing-tabs-common']}>
                                        <div className={styles['title-common']}>
                                            {__('对象存储')}
                                        </div>
                                        <Form>
                                            <Form.Row>
                                                <Form.Label>
                                                    <span className={styles['label-common']}>{__('访问地址：')}</span>
                                                </Form.Label>
                                                <Form.Field>
                                                    <ValidateBox
                                                        className={styles['validateBox-style']}
                                                        validateState={this.state.objectStorageAccessingAddressStatus}
                                                        validateMessages={{
                                                            [ObjectStorageAccessingAddressStatus.AppNodeEmpty]: __('请设置应用节点'),
                                                            [ObjectStorageAccessingAddressStatus.Empty]: __('此输入项不允许为空'),
                                                            [ObjectStorageAccessingAddressStatus.ErrorEnglishLetter]: __('域名只能包含 英文、数字 及 -. 字符，长度范围 3~20 个字符，请重新输入'),
                                                            [ObjectStorageAccessingAddressStatus.ErrorNoEnglish]: __('IP地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数，请重新输入')
                                                        }}
                                                        value={this.state.objectStorageAccessingAddress}
                                                        onChange={(value) => this.changeObjStorageAccessingAddress(value)}
                                                    />
                                                    <span className={styles['must-mark']}>*</span>
                                                </Form.Field>
                                            </Form.Row>

                                            <Form.Row>
                                                <Form.Label>
                                                    <span className={styles['label-common']}>{__('https端口：')}</span>
                                                </Form.Label>
                                                <Form.Field>
                                                    <ValidateBox
                                                        className={styles['validateBox-style']}
                                                        validateState={this.state.objStorageHttpsStatus}
                                                        validateMessages={{
                                                            [ObjHttpsValidateState.AppNodeEmpty]: __('请设置应用节点'),
                                                            [ObjHttpsValidateState.Empty]: __('此输入项不允许为空'),
                                                            [ObjHttpsValidateState.InputError]: __('端口号必须是 1~65535 之间的整数，请重新输入'),
                                                        }}
                                                        value={this.state.objStorePort.https}
                                                        onChange={(value) => this.changeObjHttps(value)}
                                                    />
                                                    <span className={styles['must-mark']}>*</span>
                                                </Form.Field>
                                            </Form.Row>
                                            <Form.Row>
                                                <Form.Label>
                                                    <span className={styles['label-common']}>{__('http端口：')}</span>
                                                </Form.Label>
                                                <Form.Field>
                                                    <ValidateBox
                                                        className={styles['validateBox-style']}
                                                        validateState={this.state.objStorageHttpStatus}
                                                        validateMessages={{
                                                            [ObjHttpValidateState.AppNodeEmpty]: __('请设置应用节点'),
                                                            [ObjHttpValidateState.Empty]: __('此输入项不允许为空'),
                                                            [ObjHttpValidateState.InputError]: __('端口号必须是 1~65535 之间的整数，请重新输入'),
                                                        }}
                                                        value={this.state.objStorePort.http}
                                                        onChange={(value) => this.changeObjHttp(value)}
                                                    />
                                                    <span className={styles['must-mark']}>*</span>
                                                </Form.Field>
                                            </Form.Row>
                                        </Form>
                                        {
                                            this.state.isObjectStorageChanged === true ?
                                                <div className={styles['button-position']}>
                                                    <Button
                                                        className={styles['button-common']}
                                                        onClick={this.completeObjectStorage.bind(this)}
                                                    >{__('保存')}</Button>
                                                    <Button
                                                        className={styles['button-common']}
                                                        onClick={this.cancelObjectStorage.bind(this)
                                                        }>{__('取消')}</Button>
                                                </div>
                                                : null
                                        }
                                    </div>
                                </FlexBox.Item>
                                : null
                        }
                    </FlexBox>
                </div>

                {
                    this.state.dialogStatus === DialogStatus.ErrorDialogAppear ?
                        <ErrorDialog onConfirm={this.closeDialog.bind(this)}>
                            <ErrorDialog.Title>
                                {__('保存失败。错误信息如下：')}
                            </ErrorDialog.Title>
                            <ErrorDialog.Detail>
                                {this.state.errorMessage}
                            </ErrorDialog.Detail>
                        </ErrorDialog>
                        : null
                }

                {
                    this.state.loadingStatus === true ?
                        <div className={styles['loading']}>
                            <ProgressCircle detail={__('正在保存......')} />
                        </div>
                        : null
                }

            </div>
        )
    }
}
