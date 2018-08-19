import * as React from 'react';
import * as classnames from 'classnames';
import { values } from 'lodash';
import Dialog from '../../../ui/Dialog2/ui.desktop';
import Panel from '../../../ui/Panel/ui.desktop';
import Select from '../../../ui/Select/ui.desktop';
import ValidateBox from '../../../ui/ValidateBox/ui.desktop';
import CheckBoxOption from '../../../ui/CheckBoxOption/ui.desktop';
import Expand from '../../../ui/Expand/ui.desktop';
import { Roles, ncTHaSys } from '../helper';
import WarningMessage from './WarningMessage/component.view';
import ProgressDialog from './ProgressDialog/component.view';
import NodeConfigBase from './component.base';
import { ValidateState, OperationStatus, DefaultNicText } from './helper';
import { DeployMode } from '../helper';
import __ from './locale';
import * as styles from './styles.view';

const ValidateMessages = {
    [ValidateState.InvalidHost]: __('IP地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数，请重新输入。'),
    [ValidateState.InvalidAlias]: __('节点名称不能包含 \ / : * ? " < > | 特殊字符，请重新输入。'),
    [ValidateState.DuplicateAlias]: __('该节点名称已被占用，请重新输入。'),
    [ValidateState.DuplicateHost]: __('该节点已添加至列表。'),
    [ValidateState.InvalidVip]: __('IP地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数'),
    [ValidateState.InvalidIvip]: __('IP地址格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数'),
    [ValidateState.InvalidMask]: __('子网掩码格式形如 XXX.XXX.XXX.XXX，每段必须是 0~255 之间的整数'),
    [ValidateState.ReusedIp]: __('不允许设置两个相同的IP')
}

export default class NodeConfig extends NodeConfigBase {
    render() {
        const { node, deploymentMode } = this.props;
        const { dbNodes, indexNodes } = this.props.roles;
        const {
            nodeHost,
            rolesConfig,
            vipConfig,
            ivip,
            nodeAlias,
            roles,
            selectedHaMode,
            validateState,
            disableHaCheckBox,
            disableDbCheckBox,
            operationStatus,
            warningOperation,
            requestInProgress,
            useExternalDb,
            thirdPartyOSS,
            nicOptions
        } = this.state;

        return (
            operationStatus === OperationStatus.Running ?
                <ProgressDialog
                    node={node}
                    requestInProgress={requestInProgress}
                />
                :
                <div>
                    {
                        values(warningOperation).some(op => op === true) ?
                            <WarningMessage
                                operation={warningOperation}
                                onMessageCancel={this.props.onNodeConfigCancel}
                                onMessageConfirm={this.setNode.bind(this)}
                                onUnInstallIndexChange={checked => { this.handleDeleteIndexByUninstallChange(checked) }}
                            />
                            :
                            <Dialog
                                title={node ? __('设置') : __('添加节点')}
                                onClose={this.props.onNodeConfigCancel}
                                width={550}
                            >
                                <Panel>
                                    <Panel.Main>
                                        <div>
                                            <table className={styles['addnode-table']}>
                                                <tbody>
                                                    <tr>
                                                        <td className={styles['form-label']} >
                                                            <div>{__('节点SSH IP ：')}</div>
                                                        </td>
                                                        <td className={styles['form-field']} colSpan={3}>
                                                            <ValidateBox
                                                                className={styles['validate-box']}
                                                                value={nodeHost}
                                                                onChange={host => { this.handleChange({ host }) }}
                                                                validateState={validateState.host}
                                                                validateMessages={ValidateMessages}
                                                                disabled={node}
                                                            />
                                                            {
                                                                node ?
                                                                    null :
                                                                    <span className={styles['mark']}>*</span>
                                                            }
                                                        </td>
                                                    </tr>
                                                    {
                                                        node ?
                                                            <tr>
                                                                <td className={styles['form-label']}>
                                                                    {__('节点名称 ：')}
                                                                </td>
                                                                <td className={styles['form-field']} colSpan={3}>
                                                                    <ValidateBox
                                                                        className={styles['validate-box']}
                                                                        value={nodeAlias}
                                                                        onChange={nodeAlias => { this.handleChange({ nodeAlias }) }}
                                                                        validateState={validateState.alias}
                                                                        validateMessages={ValidateMessages}
                                                                    />
                                                                </td>
                                                            </tr>
                                                            : null
                                                    }
                                                    {
                                                        node ?
                                                            <tr>
                                                                <td
                                                                    className={styles['form-label']}
                                                                    style={{ verticalAlign: 'top' }}
                                                                >
                                                                    {__('节点角色 ：')}
                                                                </td>
                                                                <td
                                                                    colSpan={3}
                                                                    rowSpan={4}
                                                                >
                                                                    <div className={styles['role-option']}>
                                                                        <div className={styles['ha-checkbox']}>
                                                                            <CheckBoxOption
                                                                                onChange={haChecked => this.handleRoleCheck({ haChecked })}
                                                                                disabled={disableHaCheckBox}
                                                                                checked={rolesConfig.haRole > 0}
                                                                            >
                                                                                {this.renderRolesName(roles.ha)}
                                                                            </CheckBoxOption>
                                                                        </div>
                                                                        {
                                                                            this.props.deploymentMode === DeployMode.BasicMode ?
                                                                                // 固化模式下：高可用下拉菜单隐藏，只能使用数据库、应用、存储共用一套高可用的模式(全局)
                                                                                null
                                                                                :
                                                                                <Select
                                                                                    className={styles['select-box']}
                                                                                    menu={{ width: 180, maxHeight: 130 }}
                                                                                    onChange={mode => this.changeMode(mode)}
                                                                                    value={this.renderHaMode(selectedHaMode)}
                                                                                    disabled={disableHaCheckBox || !rolesConfig.haRole}
                                                                                >
                                                                                    {
                                                                                        roles.haMode.map(mode => (
                                                                                            <Select.Option
                                                                                                key={mode}
                                                                                                value={mode}
                                                                                                selected={selectedHaMode === mode}
                                                                                            >
                                                                                                {this.renderHaMode(mode)}
                                                                                            </Select.Option>
                                                                                        ))
                                                                                    }
                                                                                </Select>
                                                                        }
                                                                    </div>
                                                                    <Expand
                                                                        open={
                                                                            rolesConfig.haRole === Roles.MasterBasicHa ||
                                                                            rolesConfig.haRole === Roles.MasterAppHa ||
                                                                            rolesConfig.haRole === Roles.MasterStorHa ||
                                                                            rolesConfig.haRole === Roles.MasterDbHa
                                                                        }
                                                                    >
                                                                        <div className={styles['vip-info']}>
                                                                            <span className={styles['vip-item']}>
                                                                                {__('访问IP ：')}
                                                                            </span>
                                                                            <ValidateBox
                                                                                className={styles['vip-input']}
                                                                                value={vipConfig.vip}
                                                                                onChange={vip => { this.handleChangeVip({ vip }) }}
                                                                                validateState={validateState.vip}
                                                                                validateMessages={ValidateMessages}
                                                                            />
                                                                            <span className={styles['mark']}>*</span>
                                                                        </div>
                                                                        {
                                                                            !useExternalDb && rolesConfig.haRole === Roles.MasterBasicHa ?
                                                                                <div className={styles['vip-info']}>
                                                                                    <span className={styles['vip-item']}>
                                                                                        {__('数据库访问IP ：')}
                                                                                    </span>
                                                                                    <ValidateBox
                                                                                        className={styles['vip-input']}
                                                                                        value={ivip}
                                                                                        onChange={ivip => { this.handleChangeVip({ ivip }) }}
                                                                                        validateState={validateState.ivip}
                                                                                        validateMessages={ValidateMessages}
                                                                                    />
                                                                                    <span className={styles['mark']}>*</span>
                                                                                </div>
                                                                                : null
                                                                        }
                                                                        <div className={styles['vip-info']}>
                                                                            <span className={styles['vip-item']}>
                                                                                {__('子网掩码 ：')}
                                                                            </span>
                                                                            <ValidateBox
                                                                                className={styles['vip-input']}
                                                                                value={vipConfig.mask}
                                                                                onChange={mask => { this.handleChangeVip({ mask }) }}
                                                                                validateState={validateState.mask}
                                                                                validateMessages={ValidateMessages}
                                                                            />
                                                                            <span className={styles['mark']}>*</span>
                                                                        </div>
                                                                        <div className={styles['vip-info']}>
                                                                            <span className={styles['vip-item']}>
                                                                                {__('网卡 ：')}
                                                                            </span>
                                                                            <Select
                                                                                className={styles['select-box']}
                                                                                menu={{ width: 180, maxHeight: 130 }}
                                                                                onChange={nic => this.handleChangeVip({ nic })}
                                                                                value={vipConfig.nic === '' ? DefaultNicText.selectNic : vipConfig.nic}
                                                                            >
                                                                                {
                                                                                    nicOptions.map(nic => (
                                                                                        <Select.Option
                                                                                            key={nic}
                                                                                            value={nic}
                                                                                            selected={vipConfig.nic === nic}
                                                                                            className={classnames({
                                                                                                [styles['select-placeholder']]: nic === DefaultNicText.selectNic
                                                                                            })}
                                                                                        >
                                                                                            {nic}
                                                                                        </Select.Option>
                                                                                    ))
                                                                                }
                                                                            </Select>
                                                                            <span className={styles['mark']}>*</span>
                                                                        </div>
                                                                    </Expand>
                                                                    <div className={styles['role-option']}>
                                                                        <CheckBoxOption
                                                                            onChange={dbChecked => this.handleRoleCheck({ dbChecked })}
                                                                            disabled={disableDbCheckBox}
                                                                            checked={rolesConfig.dbRole > 0}
                                                                        >
                                                                            {
                                                                                roles.db === Roles.MasterDb ?
                                                                                    __('数据库主节点')
                                                                                    : __('数据库从节点')
                                                                            }
                                                                        </CheckBoxOption>
                                                                    </div>
                                                                    <div className={styles['role-option']}>
                                                                        <CheckBoxOption
                                                                            onChange={appChecked => this.handleRoleCheck({ appChecked })}
                                                                            checked={rolesConfig.appRole > 0}
                                                                            disabled={!rolesConfig.dbRole && !dbNodes.length && !useExternalDb} // 没有勾选数据库节点 且 没有数据库节点 且 没有第三方数据库时禁用
                                                                        >
                                                                            {__('应用节点')}
                                                                        </CheckBoxOption>
                                                                        <span className={styles['index-role']}>
                                                                            <CheckBoxOption
                                                                                onChange={indexChecked => this.handleRoleCheck({ indexChecked })}
                                                                                disabled={
                                                                                    indexNodes.length && indexNodes[0].node_uuid !== node.nodeUuid ||
                                                                                    !indexNodes.length && !rolesConfig.appRole ||
                                                                                    indexNodes.length && indexNodes[0].node_uuid === node.nodeUuid && !rolesConfig.appRole
                                                                                }
                                                                                checked={rolesConfig.indexRole > 0}
                                                                            >
                                                                                {__('安装文档索引')}
                                                                            </CheckBoxOption>
                                                                        </span>
                                                                    </div>
                                                                    <div className={styles['role-option']}>
                                                                        <CheckBoxOption
                                                                            onChange={storChecked => this.handleRoleCheck({ storChecked })}
                                                                            checked={rolesConfig.storageRole > 0}
                                                                            disabled={thirdPartyOSS !== '' || deploymentMode === DeployMode.CloudMode}
                                                                        >
                                                                            {__('存储节点')}
                                                                        </CheckBoxOption>
                                                                    </div>
                                                                    <div className={styles['role-option']}>
                                                                        <CheckBoxOption
                                                                            checked={node.nodeRoles.ecmsRole === Roles.ClusterManage}
                                                                            disabled
                                                                        >
                                                                            {__('集群管理节点')}
                                                                        </CheckBoxOption>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            : null
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </Panel.Main>
                                    <Panel.Footer>
                                        <Panel.Button
                                            onClick={() => this.validateConfig()}
                                            disabled={this.disableConfigNode()}
                                        >
                                            {__('确定')}
                                        </Panel.Button>
                                        <Panel.Button onClick={() => this.props.onNodeConfigCancel()} >{__('取消')}</Panel.Button>
                                    </Panel.Footer>
                                </Panel >
                            </Dialog >
                    }
                </div>
        )
    }

    renderRolesName(role) {
        switch (role) {
            case Roles.MasterBasicHa:
            case Roles.MasterAppHa:
            case Roles.MasterStorHa:
            case Roles.MasterDbHa:
                return __('高可用主节点')

            case Roles.SlaveBasicHa:
            case Roles.SlaveAppHa:
            case Roles.SlaveStorHa:
            case Roles.SlaveDbHa:
                return __('高可用从节点')

            case Roles.MasterDb:
                return __('数据库主节点')

            case Roles.SlaveDb:
                return __('数据库从节点')

            case Roles.App:
                return __('应用节点')

            case Roles.Storage:
                return __('存储节点')

            case Roles.ClusterManage:
                return __('集群管理节点')

            case Roles.Index:
                return __('安装文档索引')

            default:
                return null
        }
    }

    renderHaMode(mode) {
        switch (mode) {
            case ncTHaSys.Basic:
                return __('全局')
            case ncTHaSys.App:
                return __('应用')
            case ncTHaSys.Storage:
                return __('存储')
            case ncTHaSys.Database:
                return __('数据库')
            default:
                return null
        }
    }
}