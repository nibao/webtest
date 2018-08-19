import * as React from 'react';
import DeviceBindBase, { SearchField, OsType, ValidateStates } from './component.base';
import ToolBar from '../../ui/ToolBar/ui.desktop';
import SearchBox from '../../ui/SearchBox/ui.desktop';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import SwitchButton from '../../ui/SwitchButton/ui.desktop';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import Form from '../../ui/Form/ui.desktop';
import ValidateBox from '../../ui/ValidateBox/ui.desktop';
import Title from '../../ui/Title/ui.desktop';
import { formatTime } from '../../util/formatters/formatters'

import __ from './locale';
import * as classnames from 'classnames';
import * as styles from './styles.view.css';

const deviceType = {
    0: __('未知设备'),
    1: __('iOS'),
    2: __('Android'),
    3: __('Windows Phone'),
    4: __('Windows'),
    5: __('Mac OS X'),
    6: __('Web')
}

const ValidateMessages = {
    [ValidateStates.InvalidMac]: __('MAC地址格式错误')
}

export default class DeviceBind extends DeviceBindBase {
    render() {
        let { scope, searchResults, deviceInfos, total, page, addingDevice, deviceIsExist, addBox: { mac, osType }, validateState, currentSelectUser } = this.state;
        return (
            <div className={styles['container']}>
                <div>
                    <label className={styles['tip']}>{__('请将用户与设备绑定，绑定后用户在非绑定的设备上将无法登录')}</label>
                </div>
                <div>
                    <div className={classnames(styles['fl'], styles['user-container'])}>
                        <div className={styles['user-wrapper']}>
                            <div className={styles['info-header']}>
                                <ToolBar>
                                    <div className={styles['fl']}>
                                        <Select
                                            onChange={this.handleChangeSearchField.bind(this)}
                                            value={scope}
                                        >
                                            <Select.Option selected={scope === SearchField.AllUser} value={SearchField.AllUser}>{__('全部用户')}</Select.Option>
                                            <Select.Option selected={scope === SearchField.BindUser} value={SearchField.BindUser}>{__('已绑定的用户')}</Select.Option>
                                            <Select.Option selected={scope === SearchField.NoBindUser} value={SearchField.NoBindUser}>{__('未绑定的用户')}</Select.Option>
                                        </Select>
                                    </div>
                                    <div className={classnames(styles['fl'], styles['search-box'])}>
                                        <SearchBox
                                            disabled={false}
                                            width={256}
                                            placeholder={__('请输入用户名称')}
                                            onChange={this.handleSearchKeyChange.bind(this)}
                                        />
                                    </div>
                                </ToolBar>
                            </div>
                            <DataGrid
                                data={searchResults}
                                height="450"
                                select={true}
                                strap={true}
                                paginator={{ page, total, limit: 200 }}
                                locator={() => -1}
                                className={styles['data-grid']}
                                onSelectionChange={this.handleSelectUser.bind(this)}
                                onPageChange={this.handlePageChange.bind(this)}
                                getDefaultSelection={
                                    nextData => currentSelectUser ?
                                        nextData.filter(user => user.id === currentSelectUser.id)[0] :
                                        null
                                }
                            >
                                <DataGrid.Field
                                    label={__('用户')}
                                    field="displayName"
                                    width={70}
                                    formatter={(displayName) => <div className={styles['displayName']}><Title content={displayName}>{displayName}</Title></div>}
                                />
                                <DataGrid.Field
                                    label={__('绑定状态')}
                                    field="bindStatus"
                                    width={30}
                                    formatter={
                                        bindStatus => bindStatus ?
                                            <span className={styles['bind-status']}>{__('已绑定')}</span> :
                                            <span className={styles['nobind-status']}>{__('未绑定')}</span>}
                                />
                            </DataGrid>
                        </div>
                    </div>
                    <div className={classnames(styles['fr'], styles['device-container'], { [styles['opacity']]: !currentSelectUser })}>
                        <div className={styles['device-wrapper']}>
                            <div className={styles['info-header']}>
                                <ToolBar>
                                    <ToolBar.Button icon={'\uf018'} disabled={!currentSelectUser} onClick={this.handleAddDevice.bind(this)}>{__('添加绑定设备')}</ToolBar.Button>
                                </ToolBar>
                            </div>
                            <DataGrid
                                data={deviceInfos}
                                strap={true}
                                height="450"
                                className={styles['data-grid']}
                                locator={() => -1}
                            >
                                <DataGrid.Field
                                    label={__('设备识别码')}
                                    field="baseInfo"
                                    width={30}
                                    formatter={baseInfo => (
                                        baseInfo.udid
                                    )}
                                />
                                <DataGrid.Field
                                    label={__('设备类型')}
                                    width={20}
                                    field="baseInfo"
                                    formatter={baseInfo => deviceType[baseInfo.osType]}
                                />
                                <DataGrid.Field
                                    label={__('最后登录时间')}
                                    width={30}
                                    field="baseInfo"
                                    formatter={baseInfo => baseInfo.lastLoginTime === -1 ? '--' : formatTime(baseInfo.lastLoginTime / 1000, 'yyyy/MM/dd')}
                                />
                                <DataGrid.Field
                                    label={__('操作')}
                                    width={20}
                                    field="bindFlag"
                                    formatter={
                                        (bindFlag, data) =>
                                            <div>
                                                <SwitchButton disabled={!currentSelectUser} active={bindFlag ? true : false} onChange={() => this.switchDeviceBind(data)} />
                                                <UIIcon disabled={!currentSelectUser} size={15} className={styles['delete-icon']} code={'\uf013'} color={'#9a9a9a'} onClick={() => this.deleteDeviceBind(data)} />
                                            </div>
                                    }
                                />
                            </DataGrid>
                        </div>
                    </div>
                </div>
                {
                    addingDevice ?
                        <Dialog
                            title={__('添加设备')}
                            onClose={this.handleCancelAddDevice.bind(this)}
                        >
                            <Panel>
                                <Panel.Main>
                                    <Form>
                                        <Form.Row>
                                            <Form.Label>
                                                {__('设备类型')}
                                            </Form.Label>
                                            <Form.Field>
                                                <Select value={osType} onChange={osType => this.handleAddBoxChange({ osType })}>
                                                    <Select.Option selected={osType === OsType.Windows} value={OsType.Windows}>{__('Windows')}</Select.Option>
                                                    <Select.Option selected={osType === OsType.MacOS} value={OsType.MacOS}>{__('Mac OS X')}</Select.Option>
                                                    <Select.Option selected={osType === OsType.Android} value={OsType.Android}>{__('Android')}</Select.Option>
                                                    <Select.Option selected={osType === OsType.IOS} value={OsType.IOS}>{__('iOS')}</Select.Option>
                                                </Select>
                                            </Form.Field>
                                        </Form.Row>
                                        <Form.Row>
                                            <Form.Label>
                                                {__('设备识别码')}
                                            </Form.Label>
                                            <Form.Field>
                                                <ValidateBox
                                                    validateMessages={ValidateMessages}
                                                    validateState={validateState}
                                                    value={mac}
                                                    placeholder={__('MAC地址,如 00-00-00-00-00-E0')}
                                                    onChange={mac => this.handleAddBoxChange({ mac })}
                                                />
                                            </Form.Field>
                                        </Form.Row>
                                    </Form>
                                </Panel.Main>
                                <Panel.Footer>
                                    <Panel.Button onClick={this.handleSubmitAddDevice.bind(this)}>{__('确定')}</Panel.Button>
                                    <Panel.Button onClick={this.handleCancelAddDevice.bind(this)}>{__('取消')}</Panel.Button>
                                </Panel.Footer>
                            </Panel>
                        </Dialog> :
                        null
                }
                {deviceIsExist ?
                    <MessageDialog onConfirm={this.handleCancelTip.bind(this)}>
                        {__('该设备已经存在，无法再添加')}
                    </MessageDialog> :
                    null
                }
            </div >
        );
    }
}
