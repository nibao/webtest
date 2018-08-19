import * as React from 'react';
import * as classnames from 'classnames';
import Icon from '../../../ui/Icon/ui.desktop';
import UIIcon from '../../../ui/UIIcon/ui.desktop';
import Button from '../../../ui/Button/ui.desktop';
import Centered from '../../../ui/Centered/ui.desktop';
import Text from '../../../ui/Text/ui.desktop'
import ErrorDialog from '../../../ui/ErrorDialog/ui.desktop'
import DropBox from '../../../ui/DropBox/ui.desktop'
import Menu from '../../../ui/Menu/ui.desktop'
import Select from '../../../ui/Select/ui.desktop'
import { formatTime, formatSize } from '../../../util/formatters/formatters';
import '../../../gen-js/ECMSManager_types';
import { DataGrid } from '@anyshare/sweet-ui';
import LicenseConfigBase from './component.base';
import AddConfig from './AddConfig/component.view'
import DeleteConfig from './DeleteConfig/component.view';
import ViewQRConfig from './ViewQRConfig/component.view';
import ActiveConfig from './ActiveConfig/component.view'
import AddThirdOpitionConfig from './AddThirdOpitionConfig/component.view'
import { ModelOpitions, Type } from './helper';
import * as styles from './styles.view.css';
import * as loading from './assets/loading.gif';
import __ from './locale';

export default class LicenseConfig extends LicenseConfigBase {

    render() {

        const { devinfo, data, isLoading, selectIndex, addConfig, deleteLicense, viewQR, deleteErrorID, activeLicense, addThirdOpitionConfig, errorMsg } = this.state;

        const RefreshingComponent = (
            <Centered>
                <Icon url={loading} size={24} />
            </Centered>
        )

        const Toolbar = ({ data, selection }) => (

            <div>
                <Button
                    icon={'\uf018'}
                    onClick={this.addAuthorizationCode.bind(this)}
                    className={styles['toolbar-button']}
                >
                    {__('添加授权码')}
                </Button>

                <Button
                    icon={'\uf0d3'}
                    onClick={this.activeAuthorizationCode.bind(this, selection)}
                    disabled={!selection || selection.length === 0 || selection.status !== ncTLicenseStatus.NCT_LS_NOTACTIVE || selection.type === Type.ThirdpartyOpition}
                    className={styles['toolbar-button']}
                >
                    {__('激活授权码')}
                </Button>

                <Button
                    icon={'\uf046'}
                    onClick={this.deleteAuthorizationCode.bind(this, selection)}
                    className={styles['toolbar-button']}
                    disabled={!selection || selection.length === 0 || selection.type === Type.ThirdpartyOpition}
                >
                    {__('删除授权码')}
                </Button>

                <Button
                    icon={'\uf053'}
                    onClick={this.viewMachineCode.bind(this)}
                    className={styles['toolbar-button']}
                >
                    {__('查看机器码')}
                </Button>

                <div className={styles['drop-box']}>
                    <DropBox
                        active={true}
                        icon={'\uf0d4'}
                        formatter={() => __('第三方选件')}
                        width={'auto'}
                    >
                        <Menu>
                            {
                                <Select.Option onSelect={this.viewThirdPartyOption.bind(this)}>
                                    {
                                        <Text>
                                            {
                                                __('添加文档自动分析选件')
                                            }
                                        </Text>
                                    }
                                </Select.Option>
                            }

                        </Menu>
                    </DropBox>
                </div>
            </div>
        )

        const RowExtraComponent = ({ index, record }) => (
            <div className={styles['extra']}>
                <div className={styles['item']}>
                    {__('序列号：')}
                    {record.value ? record.value : '---'}
                </div>
                <div className={styles['item']}>
                    {__('激活时间：')}{record.activeTime === -2 ? '---' : record.activeTime === -1 ? __('无限制') : formatTime(record.activeTime * 1000, 'yyyy/MM/dd')}
                    <span className={styles['endTime']}>
                        {__('过期时间：')}{record.endTime === -2 ? '---' : record.endTime === -1 ? __('无限制') : formatTime(record.endTime * 1000, 'yyyy/MM/dd')}
                    </span>
                </div>
            </div>
        )

        return (
            <div className={styles['license']} >
                <div className={styles['data-grid']}>
                    <DataGrid
                        data={data}
                        enableSelect={true}
                        enableMultiSelect={false}
                        onSelectionChange={this.handleSelectedList.bind(this)}
                        selection={this.state.selection}
                        ToolbarComponent={Toolbar}
                        refreshing={isLoading}
                        RefreshingComponent={RefreshingComponent}
                        height={'100%'}
                        RowExtraComponent={RowExtraComponent}
                        showRowExtraOf={selectIndex}
                        columns={
                            [
                                {
                                    title: __('授权码'),
                                    key: 'model',
                                    width: '25%',
                                    renderCell: (model, record) =>
                                        (
                                            <div className={styles['model-wrap']}>
                                                <div className={styles['icon-wrap']}>
                                                    <UIIcon
                                                        code={data.indexOf(record) === selectIndex ? '\uf04c' : '\uf04e'}
                                                        size={20}
                                                    />
                                                </div>
                                                <Text>
                                                    {ModelOpitions[model]}
                                                </Text>
                                            </div>
                                        )
                                },
                                {
                                    title: __('类型'),
                                    key: 'type',
                                    width: '10%',
                                    renderCell: (type, record) => (
                                        <div>
                                            <Text>{this.typeFormatter(type)}</Text>
                                        </div>
                                    )
                                },
                                {
                                    title: __('节点授权'),
                                    key: 'authNodeNum',
                                    width: '10%',
                                    renderCell: (authNodeNum, record) => (
                                        <div>
                                            <Text>{this.nodeNumFormatter(authNodeNum, record)}</Text>
                                        </div>
                                    )
                                },
                                {
                                    title: __('用户授权'),
                                    key: 'authUserNum',
                                    width: '10%',
                                    renderCell: (authUserNum, record) => (
                                        <div>
                                            <Text>{this.userNumFormatter(authUserNum, record)}</Text>
                                        </div>
                                    )
                                },
                                {
                                    title: __('容量授权'),
                                    key: 'authCapacity',
                                    width: '15%',
                                    renderCell: (authCapacity, record) => (
                                        <div>
                                            <Text>{!authCapacity || authCapacity === -2 ? '---' : authCapacity === -1 ? __('无限制') : formatSize(authCapacity)}</Text>
                                        </div>
                                    )
                                },
                                {
                                    title: __('有效期'),
                                    key: 'expiredDay',
                                    width: '15%',
                                    renderCell: (expiredDay, record) => (
                                        <div>
                                            <Text>{this.expiredDayFormatter(expiredDay, record)}</Text>
                                        </div>
                                    )
                                },
                                {
                                    title: __('激活状态'),
                                    key: 'status',
                                    width: '15%',
                                    renderCell: (status, record) => (
                                        <div>
                                            <Text>{this.statusFormatter(status)}</Text>
                                        </div>
                                    )
                                }
                            ]}
                    />
                </div>
                < div className={styles['footer']} >
                    <div className={styles['footer-item']}>
                        {__('产品型号：')}{devinfo.hardwareType}
                    </div>
                    <div className={styles['footer-item']}>
                        {__('节点授权总数：')}
                        <span className={devinfo.usedNodeNum !== -1 && devinfo.authNodeNum !== -1 && devinfo.usedNodeNum > devinfo.authNodeNum ? styles['red'] : null}>{devinfo.usedNodeNum} {'/'} {devinfo.authNodeNum === -1 ? __('无限制') : devinfo.authNodeNum}</span>
                    </div>
                    <div className={styles['footer-item']}>
                        {__('用户授权总数：')}
                        <span className={devinfo.usedUserNum !== -1 && devinfo.authUserNum !== -1 && devinfo.usedUserNum > devinfo.authUserNum ? styles['red'] : null}>{devinfo.usedUserNum} {'/'} {devinfo.authUserNum === -1 ? __('无限制') : devinfo.authUserNum}</span>
                    </div>
                    <div className={styles['footer-item']}>
                        {__('总容量授权：')} {!devinfo.authCapacity || devinfo.authCapacity === -2 ? '---' : devinfo.authCapacity === -1 ? __('无限制') : formatSize(devinfo.authCapacity)}
                    </div>
                    <div className={styles['footer-item']}>
                        {__('有效期至：')} {devinfo.endTime === -2 ? '---' : devinfo.endTime === -1 ? __('无限制') : formatTime(devinfo.endTime * 1000, 'yyyy/MM/dd')}
                    </div>
                </div >
                {
                    errorMsg ?
                        <ErrorDialog
                            onConfirm={this.onErrorConfirm.bind(this)}
                        >
                            {errorMsg}
                        </ErrorDialog>
                        :
                        null
                }
                {
                    addConfig ?
                        <AddConfig
                            oAddCancel={this.oAddCancel.bind(this)}
                            onAddLicenseSuccess={this.onAddLicenseSuccess.bind(this)}
                        />
                        :
                        null
                }
                {
                    deleteLicense ?
                        <DeleteConfig
                            deleteLicense={deleteLicense}
                            onDeleteConfirm={this.onDeleteConfirm.bind(this, deleteLicense)}
                            onDeleteCancel={this.onDeleteCancel.bind(this)}
                        />
                        :
                        null
                }
                {
                    activeLicense ?
                        <ActiveConfig
                            activeLicense={activeLicense}
                            machineCode={devinfo.machineCode}
                            onActiveSuccess={this.onActiveSuccess.bind(this)}
                            onActiveCancel={this.onActiveCancel.bind(this)}
                        />
                        :
                        null
                }
                {
                    viewQR ?
                        <ViewQRConfig
                            machineCode={devinfo.machineCode}
                            onViewQRCancel={this.onViewQRCancel.bind(this)}
                        />
                        :
                        null
                }
                {
                    deleteErrorID ?
                        <ErrorDialog
                            onConfirm={this.onDeleteErrorConfirm.bind(this)}
                        >
                            {__('无法删除授权码')}
                        </ErrorDialog>
                        :
                        null
                }
                {
                    addThirdOpitionConfig ?
                        <AddThirdOpitionConfig
                            oAddThirdOpitionSuccess={this.oAddThirdOpitionSuccess.bind(this)}
                            oAddThirdOpitionCancel={this.oAddThirdOpitionCancel.bind(this)}
                        />
                        :
                        null
                }
            </ div >
        )
    }

    /**
   * 格式化类型
* @param type {string} 类型值
        */
    private typeFormatter(type: Type) {
        switch (type) {
            case Type.Base:
                return __('基本件');

            case Type.Test:
                return __('测试授权');

            case Type.UserAgent:
            case Type.ExcelUserAgent:
                return __('用户代理');

            case Type.NodeAgent:
                return __('节点代理');

            case Type.UpgrateAgent:
                return __('升级代理');

            case Type.ThirdpartyOpition:
                return __('第三方选件');

            case Type.Opition:
                return __('选件');

            default:
                return __('基本件');
        }
    }

    /**
     * 节点授权数
     * @param authNodeNum
     * @param rowData
     * @private
     */
    private nodeNumFormatter(authNodeNum, rowData) {
        var nodesDesc = authNodeNum === -1 ? __('无限制') : __('${nodesNum}个节点', { nodesNum: authNodeNum })
        if (rowData.type === 'base' || rowData.type === 'test' || rowData.type === Type.NodeAgent) {
            return nodesDesc;
        } else {
            return '---';
        }
    }

    /**
     * 用户授权数
     * @param value
     * @param rowData
     * @private
     */
    protected userNumFormatter(authUserNum, rowData) {
        var usersDesc = authUserNum === -1 ? __('无限制') : __('${usersNum}个用户', { usersNum: authUserNum });
        if (rowData.type === Type.Base || rowData.type === Type.Test || rowData.type === Type.UserAgent) {
            return usersDesc;
        } else {
            return '---'
        }
    }

    /**
     * 有效期格式化
     * @param expiredDay
     * @param rowData
     */
    private expiredDayFormatter(expiredDay, rowData) {
        return expiredDay === -2 ? '---' : expiredDay === -1 ? __('无限制') : expiredDay + __('天');
    }

    /**
     * 状态格式化
     * @param value {int} 当前状态值
     */
    private statusFormatter(status) {
        switch (status) {
            case ncTLicenseStatus.NCT_LS_NOTACTIVE:
                return <span style={{ color: 'gray' }}> {__('未激活')}</span >
            case ncTLicenseStatus.NCT_LS_HASACTIVE:
                return <span style={{ color: 'green' }}>{__('已激活')}</span>
            case ncTLicenseStatus.NCT_LS_HASEXPIRED:
                return <span style={{ color: 'red' }}> {__('已过期')}</span>
            case ncTLicenseStatus.NCT_LS_HASLAPSED:
                return <span style={{ color: 'red' }}>{__('已失效')}</span>
            default:
                return <span style={{ color: 'gray' }}> {__('未激活')}</span >
        }
    };
}
