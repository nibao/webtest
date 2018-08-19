import * as React from 'react';
import SwitchButton2 from '../../../ui/SwitchButton2/ui.desktop';
import Button from '../../../ui/Button/ui.desktop';
import DataGrid from '../../../ui/DataGrid/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Select from '../../../ui/Select/ui.desktop'
import Dialog from '../../../ui/Dialog2/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';
import Form from '../../../ui/Form/ui.desktop';
import ValidateBox from '../../../ui/ValidateBox/ui.desktop';
import ConfirmDialog from '../../../ui/ConfirmDialog/ui.desktop';
import ErrorDialog from '../../../ui/ErrorDialog/ui.desktop';
import ProgressCircle from '../../../ui/ProgressCircle/ui.desktop';
import { Title } from '../../../ui/ui.desktop';
import { ServicePortInfoValidateState, PortDescInfoValidate, SourceIpInfoValidate, SubnetMaskInfoValidate, ShowAccessingRuleDialogStatus, ErrorMsgType, ProgressType } from './component.base';
import FireWallConfigBase from './component.base';
import { transformDataGridRoleSys, transformDataGridSourceNet, transformServicePortInfo } from './helper';
import * as styles from './styles.view.css';
import __ from './locale';

export default class FireWallConfig extends FireWallConfigBase {
    render() {
        const missingInfo = this.getPortsMissingInfo(this.state.missingAppPorts)
        return (
            <div className={styles['firewall']}>
                <div className={styles['firewall-info']}>
                    <span className={styles['firewall-font']}> {__('内置防火墙开关：')} </span>
                    <div className={styles['firewall-switchButton']}>
                        <SwitchButton2 active={this.state.fireWallStatus}
                            onChange={() => this.switchFirewall()}
                        />
                    </div>
                    <span className={styles['firewall-tips']}>{__('开启时，仅允许在以下规则范围内进行访问；关闭时，任何访问不受限制。')}</span>
                </div>
                <div className={styles['accessing-rule-info']}>
                    <Button
                        disabled={!this.state.fireWallStatus}
                        theme="dark"
                        icon={'\uf089'}
                        onClick={this.initAddRule.bind(this)}
                    >
                        {__('添加访问规则')}
                    </Button>
                    {
                        this.state.fireWallStatus && this.state.missingAppPorts.length !== 0 && missingInfo.length ?
                            <div className={styles['port-tips']} >
                                {
                                    __('访问规则列表内未识别到以下端口：')
                                }
                                {
                                    missingInfo
                                }
                                {
                                    __('请尽快添加！')
                                }
                            </div>
                            : null
                    }
                </div>

                <div className={styles['dataGrid-list-container']}>
                    <div className={styles['dataGrid-list']}>
                        <DataGrid
                            className={styles['dataGrid']}
                            data={this.state.fireWallAccessingRules}
                            strap={true}
                            headHeight={31}
                            disabled={!this.state.fireWallStatus}
                        >
                            <DataGrid.Field
                                width={'100'}
                                className={styles['dataGrid-field']}
                                label={__('所属子系统')}
                                field="role_sys"
                                width={70}
                                formatter={(role_sys) => (
                                    <div>
                                        {transformDataGridRoleSys(role_sys)}
                                    </div>
                                )}
                            />
                            <DataGrid.Field
                                width={'100'}
                                className={styles['dataGrid-field']}
                                label={__('服务端口')}
                                field="port"
                                formatter={(port) => (
                                    <div>
                                        {transformServicePortInfo(port)}
                                    </div>
                                )}
                            />
                            <DataGrid.Field
                                width={'200'}
                                className={styles['dataGrid-field']}
                                label={__('端口描述')}
                                field="service_desc"
                                formatter={(service_desc) => (
                                    <div>
                                        {service_desc}
                                    </div>
                                )}
                            />
                            <DataGrid.Field
                                width={'100'}
                                className={styles['dataGrid-field']}
                                label={__('协议')}
                                field="protocol"
                                formatter={(protocol) => (
                                    <div>
                                        {protocol}
                                    </div>
                                )}
                            />
                            <DataGrid.Field
                                width={'100'}
                                className={styles['dataGrid-field']}
                                label={__('源IP/掩码')}
                                field="source_net"
                                formatter={(source_net) => (
                                    <div>
                                        {transformDataGridSourceNet(source_net)}
                                    </div>
                                )}
                            />
                            <DataGrid.Field
                                width={'100'}
                                className={styles['dataGrid-field']}
                                label={__('操作')}
                                field="_operation"
                                formatter={(_operation, record) => (
                                    <div>
                                        {
                                            this.isDataGridOperationUIIconDisplay(record) ?
                                                <div>
                                                    <Title
                                                        content={__('编辑')}
                                                    >
                                                        <UIIcon
                                                            className={styles['dataGrid-operation-edit']}
                                                            code={'\uf085'}
                                                            size="13px"
                                                            onClick={
                                                                () => { this.initEditRule(record) }
                                                            }
                                                        />
                                                    </Title>
                                                    <Title
                                                        content={__('删除')}
                                                    >
                                                        <UIIcon
                                                            className={styles['dataGrid-operation-delete']}
                                                            code={'\uf075'}
                                                            size="13px"
                                                            onClick={
                                                                () => {
                                                                    this.initDeleteDialog(record)
                                                                }
                                                            }
                                                        />
                                                    </Title>
                                                </div>
                                                : null
                                        }
                                    </div>
                                )}
                            />
                        </DataGrid>
                    </div>
                    {
                        !this.state.fireWallStatus ?
                            <div className={styles['dataGrid-list-mask']}></div>
                            : null
                    }
                </div>

                {
                    (this.state.showAccessingRuleDialog === ShowAccessingRuleDialogStatus.EditAccessingDialogAppear || this.state.showAccessingRuleDialog === ShowAccessingRuleDialogStatus.AddAccessingDialogAppear) ?
                        <Dialog
                            title={this.state.showAccessingRuleDialog === ShowAccessingRuleDialogStatus.AddAccessingDialogAppear ?
                                __('添加访问规则')
                                : __('编辑访问规则')
                            }
                            onClose={this.dialogDisappear.bind(this)}
                        >
                            <Panel.Main>
                                <Form>
                                    <Form.Row>
                                        <Form.Label>
                                            {__('所属子系统：')}
                                        </Form.Label>
                                        <Form.Field>
                                            <Select
                                                value={this.state.record.role_sys}
                                                onChange={(value) => { this.updateRoleSys(value) }}
                                            >
                                                <Select.Option value={'basic'} selected>{__('公共')}</Select.Option>
                                                <Select.Option value={'ecms'} >{__('集群管理')}</Select.Option>
                                                <Select.Option value={'app'}>{__('应用')}</Select.Option>
                                                <Select.Option value={'storage'}>{__('存储')}</Select.Option>
                                                <Select.Option value={'db'}>{__('数据库')}</Select.Option>
                                            </Select>
                                        </Form.Field>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Label>
                                            {__('服务端口：')}
                                        </Form.Label>
                                        <Form.Field>
                                            <ValidateBox
                                                validateState={this.state.validateState.servicePortInfo}
                                                validateMessages={{
                                                    [ServicePortInfoValidateState.Error]: __('端口号必须是 1~65535 之间的整数，请重新输入')
                                                }}
                                                placeholder={__('输入为空即为All')}
                                                value={this.state.record.port}
                                                onChange={(value) => { this.updatePort(value) }}
                                            />
                                        </Form.Field>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Label>
                                            {__('协议：')}
                                        </Form.Label>
                                        <Form.Field>
                                            <Select
                                                disabled={Number(this.state.record.port) === 0}
                                                value={this.state.record.protocol}
                                                onChange={(value) => {
                                                    this.updateProtocol(value)
                                                }}
                                            >
                                                <Select.Option value={'tcp'} selected>{('TCP')}</Select.Option>
                                                <Select.Option value={'udp'}>{('UDP')}</Select.Option>
                                            </Select>
                                        </Form.Field>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Label>
                                            {__('端口描述：')}
                                        </Form.Label>
                                        <Form.Field>
                                            <ValidateBox
                                                validateState={this.state.validateState.portDescInfo}
                                                validateMessages={{
                                                    [PortDescInfoValidate.Error]: __('最多允许输入100个字符')
                                                }}
                                                disabled={!this.state.record.port}
                                                value={this.state.record.service_desc}
                                                onChange={(value => { this.updateServiceDesc(value) })}
                                            />
                                        </Form.Field>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Label>
                                            {__('源IP：')}
                                        </Form.Label>
                                        <Form.Field>
                                            <ValidateBox
                                                validateState={this.state.validateState.sourceIpInfo}
                                                validateMessages={{
                                                    [SourceIpInfoValidate.Error]: __('IP地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数，请重新输入')
                                                }}
                                                placeholder={__('输入为空即为Anywhere')}
                                                value={this.getSourceIp(this.state.record.source_net)}
                                                onChange={(value) => { this.updateSourceNetFromSourceIp(value) }}
                                            />
                                        </Form.Field>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Label>
                                            {__('子网掩码：')}
                                        </Form.Label>
                                        <Form.Field>
                                            <ValidateBox
                                                validateState={this.state.validateState.subnetMaskInfo}
                                                validateMessages={{
                                                    [SubnetMaskInfoValidate.Error]: __('IP地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数，请重新输入')
                                                }}
                                                disabled={!this.getSourceIp(this.state.record.source_net)}
                                                value={this.getSubNet(this.state.record.source_net)}
                                                onChange={(value) => { this.updateSourceNetFromSubNet(value) }}
                                            />
                                        </Form.Field>
                                    </Form.Row>

                                </Form>
                            </Panel.Main>
                            <Panel>
                                <Panel.Footer>
                                    <Panel.Button
                                        onClick={this.completeAccessingRuleDialog.bind(this)}
                                        disabled={
                                            (this.state.record.port === '' && this.getSourceIp(this.state.record.source_net) === '')
                                            || (this.getSourceIp(this.state.record.source_net) !== '' && this.getSubNet(this.state.record.source_net) === '')
                                        }
                                    >
                                        {__('确定')}
                                    </Panel.Button>
                                    <Panel.Button
                                        onClick={this.dialogDisappear.bind(this)
                                        }>
                                        {__('取消')}
                                    </Panel.Button>
                                </Panel.Footer>
                            </Panel>
                        </Dialog>
                        : null
                }

                {
                    this.state.showAccessingRuleDialog === ShowAccessingRuleDialogStatus.DeleteAccessingConfirmDialogAppear ?
                        <ConfirmDialog
                            onCancel={this.dialogDisappear.bind(this)}
                            onConfirm={this.completeConfirmDialog.bind(this)}
                        >
                            {`${__('删除端口')} ${this.oldRecord.port} ${__('将导致此端口无法对外提供服务，您确定要执行此操作吗？')}`}

                        </ConfirmDialog>
                        : null
                }

                {
                    this.state.showAccessingRuleDialog === ShowAccessingRuleDialogStatus.ErrorDialogAppear ?
                        <ErrorDialog onConfirm={() => { this.dialogDisappear() }}>
                            <ErrorDialog.Title>
                                {this.getErrorMsgTitle()}
                            </ErrorDialog.Title>
                            <ErrorDialog.Detail>
                                {this.state.errorMsg}
                            </ErrorDialog.Detail>
                        </ErrorDialog>
                        : null
                }

                {
                    this.state.progressCircleTips !== ProgressType.None ?
                        <ProgressCircle detail={this.getProgressCircleTips()} />
                        : null
                }
            </div>
        )
    }

    /**
     * 将缺少端口和端口描述信息一一对应
     * @param missingAppPorts 缺少的端口号
     */
    getPortsMissingInfo(missingAppPorts) {
        return (
            missingAppPorts.reduce((preInfos, item) => {
                return item ? [...preInfos, `${item}${this.transformPortsMissingDesc(item)}，`] : preInfos
            }, [])
        )
    }

    /**
    * 获取缺少端口的描述信息
    * @param missingAppPort 缺少的某一个端口号 
    */
    transformPortsMissingDesc(missingAppPort) {
        switch (missingAppPort) {
            case Number(this.props.portsFromAppConfig.webClientHttps):
                return __('（Web客户端访问https）')
            case Number(this.props.portsFromAppConfig.webClientHttp):
                return __('（Web客户端访问http）')
            case Number(this.props.portsFromAppConfig.objStorageHttps):
                return __('（对象存储https）')
            case Number(this.props.portsFromAppConfig.objStorageHttp):
                return __('（对象存储http）')
        }
    }

    /**
     * 根据不同的错误提示弹窗显示不同的 Title
     */
    getErrorMsgTitle() {
        if (this.state.errorMsgTitle === ErrorMsgType.AddError) {
            return __('添加访问规则失败，错误信息如下：')
        }
        if (this.state.errorMsgTitle === ErrorMsgType.EditError) {
            return __('编辑访问规则失败，错误信息如下：')
        }
        if (this.state.errorMsgTitle === ErrorMsgType.DeleteError) {
            return __('删除失败，错误信息如下：')
        }
        if (this.state.errorMsgTitle === ErrorMsgType.OpenFireWallError) {
            return __('开启防火墙失败，错误信息如下：')
        }
        if (this.state.errorMsgTitle === ErrorMsgType.CloseFireWallError) {
            return __('关闭防火墙失败，错误信息如下：')
        }
        if (this.state.errorMsgTitle === ErrorMsgType.UpdateError) {
            return __('更新防火墙失败，错误信息如下：')
        }
    }

    /**
     * 根据 添加/编辑/删除 访问规则显示不同的转圈圈提示内容
     */
    getProgressCircleTips() {
        if (this.state.progressCircleTips === ProgressType.Adding) {
            return __('正在添加，请稍候......')
        }
        if (this.state.progressCircleTips === ProgressType.Editing) {
            return __('正在编辑，请稍候......')
        }
        if (this.state.progressCircleTips === ProgressType.Deleting) {
            return __('正在删除，请稍候......')
        }
        if (this.state.progressCircleTips === ProgressType.Opening) {
            return __('正在开启防火墙......')
        }
        if (this.state.progressCircleTips === ProgressType.Closing) {
            return __('正在关闭防火墙......')
        }
        if (this.state.progressCircleTips === ProgressType.Updating) {
            return __('正在更新访问规则......')
        }
    }
}

