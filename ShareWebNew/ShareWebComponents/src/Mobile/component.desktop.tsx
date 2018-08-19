import * as React from 'react';
import * as classnames from 'classnames';
import { some, every, map, reduce, filter } from 'lodash';
import { DataGrid } from '@anyshare/sweet-ui';;
import Button from '../../ui/Button/ui.desktop';
import Centered from '../../ui/Centered/ui.desktop';
import IconGroup from '../../ui/IconGroup/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import { formatTime } from '../../util/formatters/formatters';
import DisableConfig from './DisableConfig/component.desktop';
import EraseConfig from './EraseConfig/component.desktop';
import Empty from './Empty/component.desktop';
import MobileBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';
import * as loading from './assets/loading.gif';
import * as disable from './assets/disable.png';
import * as enable from './assets/enable.png';

export default class Mobile extends MobileBase {

    render() {
        let { devicesList, confirmDisableDevices, confirmEraseDevices, selectOpitions } = this.state;

        const Toolbar = ({ data, selection }) => (

            <div className={styles['controll-buttons']}>
                {
                    some(devicesList, o => selectOpitions[o.udid] === true) ?
                        <Button
                            icon={'\uf027'}
                            onClick={this.eraseDevicesList.bind(this, filter(data, o => selectOpitions[o.udid] === true))}
                            className={styles['button-wrap']}
                        >
                            {__('数据擦除')}
                        </Button>
                        :
                        null
                }
                {
                    some(filter(data, o => selectOpitions[o.udid] === true), device => { return device.disableflag === 0 }) ?
                        <Button
                            icon={'\uf030'}
                            onClick={this.disableDevicesList.bind(this, filter(data, o => selectOpitions[o.udid] === true && o.disableflag === 0))}
                            className={styles['button-wrap']}
                        >
                            {__('禁用设备')}
                        </Button>
                        :
                        null
                }
                {
                    some(filter(data, o => selectOpitions[o.udid] === true), device => { return device.disableflag === 1 }) ?
                        <Button
                            icon={'\uf06d'}
                            onClick={this.enableDevicesList.bind(this, filter(data, o => selectOpitions[o.udid] === true && o.disableflag === 1))}
                            className={styles['button-wrap']}
                        >
                            {__('启用设备')}
                        </Button>
                        :
                        null
                }
            </div>
        )

        const EmptyComponent = (
            <Empty
            />
        )

        const RefreshingComponent = (
            <Centered>
                <Icon url={loading} size={24} />
            </Centered>
        )

        return (
            <div className={styles['container']} >
                {
                    <DataGrid
                        data={devicesList}
                        enableSelect={true}
                        enableMultiSelect={true}
                        DataGridToolbar={{
                            enableSelectAll: true
                        }}
                        ToolbarComponent={Toolbar}
                        onSelectionChange={this.handleSelectedList.bind(this)}
                        selection={this.state.selection}
                        EmptyComponent={EmptyComponent}
                        refreshing={this.state.isLoading}
                        RefreshingComponent={RefreshingComponent}
                        rowHoverClassName={styles['hover-action']}
                        height={'100%'}
                        columns={[
                            {
                                title: __('设备名称'),
                                key: 'name',
                                width: '20%',
                                renderCell: (name, record) =>
                                    (
                                        <div className={styles['devicename-wrap']}>
                                            <div className={styles['icon-wrap']}>
                                                <Icon
                                                    url={record['disableflag'] === 0 ? enable : disable}
                                                />
                                            </div>
                                            <Text>
                                                {name}
                                            </Text>

                                            <div className={styles['icongroup']}>
                                                <IconGroup
                                                    onClick={e => this.handleIconClick(e, record)}
                                                >
                                                    <IconGroup.Item
                                                        code={'\uf027'}
                                                        size={16}
                                                        title={__('数据擦除')}
                                                        className={classnames(styles['action-icon'], { [styles['actived']]: selectOpitions[record.udid] === true })}
                                                        onClick={this.handleClickErase.bind(this, record)}
                                                    />
                                                    {
                                                        record['disableflag'] === 0 ?
                                                            <IconGroup.Item
                                                                code={'\uf030'}
                                                                size={16}
                                                                title={__('禁用设备')}
                                                                className={classnames(styles['action-icon'], { [styles['actived']]: selectOpitions[record.udid] === true })}
                                                                onClick={this.handleClickDisabled.bind(this, record.udid)}
                                                            />
                                                            :
                                                            <IconGroup.Item
                                                                code={'\uf06d'}
                                                                size={16}
                                                                title={__('启用设备')}
                                                                className={classnames(styles['action-icon'], { [styles['actived']]: selectOpitions[record.udid] === true })}
                                                                onClick={this.handleClickEnable.bind(this, record.udid)}
                                                            />
                                                    }
                                                </IconGroup>
                                            </div>
                                        </div>
                                    )
                            },
                            {
                                title: __('设备类型'),
                                key: 'devicetype',
                                width: '10%',
                                renderCell: (devicetype, record) => (
                                    <div>
                                        <Text>{devicetype}</Text>
                                    </div>
                                )
                            },
                            {
                                title: __('设备识别码'),
                                key: 'udid',
                                width: '20%',
                                renderCell: (udid, record) => (
                                    <div>
                                        <Text>{udid}</Text>
                                    </div>
                                )
                            },
                            {
                                title: __('IP地址'),
                                key: 'lastloginip',
                                width: '15%',
                                renderCell: (lastloginip, record) => (
                                    <div>
                                        <Text>{lastloginip}</Text>
                                    </div>
                                )
                            },
                            {
                                title: __('最后登录时间'),
                                key: 'lastlogintime',
                                width: '20%',
                                renderCell: (lastlogintime, record) => (
                                    <div>
                                        <Text>{formatTime(record['lastlogintime'] / 1000, 'yyyy/MM/dd HH:mm:ss')}</Text>
                                    </div>
                                )
                            },
                            {
                                title: __('缓存状态'),
                                key: 'eraseflag',
                                width: '15%',
                                renderCell: (eraseflag, record) => (
                                    <div>
                                        <Text>{record['eraseflag'] === 1 ? __('正在请求擦除...') : record['lasterasetime'] ? formatTime(record['lasterasetime'] / 1000, 'yyyy/MM/dd HH:mm:ss') + __('擦除成功') : __('正常')}</Text>
                                    </div>
                                )
                            }
                        ]}
                    />
                }
                {
                    confirmDisableDevices.length === 0 ?
                        null
                        :
                        <DisableConfig
                            onDisableConfirm={this.onDisableConfirm.bind(this, confirmDisableDevices)}
                            onDisableCancle={this.onDisableCancle.bind(this)}
                        />
                }
                {
                    confirmEraseDevices.length === 0 ?
                        null :
                        <EraseConfig
                            onEraseConfirm={this.onEraseConfirm.bind(this, confirmEraseDevices)}
                            onEraseCancle={this.onEraseCancle.bind(this)}
                        />
                }
            </ div>
        )
    }
}