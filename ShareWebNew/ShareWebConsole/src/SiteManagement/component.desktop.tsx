import * as React from 'react';
import * as classnames from 'classnames';
import { map, isNaN } from 'lodash';
import { ProgressBar, SwitchButton2, ConfirmDialog, Button, UIIcon, Icon, ProgressCircle, InlineButton, Centered, MessageDialog } from '../../ui/ui.desktop';
import { DataGrid } from '@anyshare/sweet-ui'
import { formatSize, decorateText } from '../../util/formatters/formatters';
import SetNodes from './SetNodes/component.desktop';
import Config from './Config/component.desktop';
import SiteManagementBase from './component.base';
import __ from './locale';
import * as styles from './styles.desktop.css';
import * as main from './assets/main.png';
import * as loading from './assets/loading.gif';
import * as sub from './assets/sub.png';

export default class SiteManagement extends SiteManagementBase {

    render() {
        let { dbNodeInfos, multisiteEnabled, localSite, sites, addingSite, editingSite, removingSite, appIp, OSSInfo, isLoading } = this.state

        const RefreshingComponent = (
            <Centered>
                <Icon url={loading} size={24} />
            </Centered>
        )

        const Toolbar = () => (
            <div className={styles['info-header']}>
                <span className={styles['header-font']}>
                    {__('多站点模式开关：')}
                </span>
                <div className={styles['header-switchButton']}>
                    <SwitchButton2
                        active={multisiteEnabled}
                        onChange={() => this.setMultipleSite(multisiteEnabled)}
                        disabled={isLoading || (localSite && localSite.type === ncTSiteType.NCT_SITE_TYPE_SLAVE)}
                    />
                </div>
                <div className={styles['header-button']}>
                    <Button
                        icon={'\uf018'}
                        onClick={this.onAddClick.bind(this)}
                        disabled={(localSite && localSite.type === ncTSiteType.NCT_SITE_TYPE_SLAVE) || multisiteEnabled === false}
                        theme={'dark'}
                    >
                        {__('添加分站点')}
                    </Button>
                </div>
            </div >
        )

        return (
            <div className={styles['container']}>
                {
                    (dbNodeInfos && dbNodeInfos.length === 0 ?
                        <SetNodes
                            doRedirectServers={this.props.doRedirectServers}
                        />
                        :
                        <DataGrid
                            data={sites}
                            enableSelect={true}
                            enableMultiSelect={false}
                            ToolbarComponent={Toolbar}
                            onSelectionChange={this.handleSelectedList.bind(this)}
                            selection={this.state.selection}
                            refreshing={isLoading}
                            RefreshingComponent={RefreshingComponent}
                            height={'100%'}
                            columns={[
                                {
                                    title: __('站点名'),
                                    key: 'name',
                                    width: '15%',
                                    renderCell: (name, record) => (
                                        <div className={styles['table-row-sitename']}>
                                            <Icon
                                                url={record['type'] === ncTSiteType.NCT_SITE_TYPE_MASTER ? main : sub}
                                                size={16}
                                            />
                                            <span className={styles['list-content-text']} title={record['name']}>
                                                {record.name}
                                            </span>
                                        </div>
                                    )
                                },
                                {
                                    title: __('站点类型'),
                                    key: 'type',
                                    width: '10%',
                                    renderCell: (type, record) => (
                                        <div className={styles['table-row-sites']}>
                                            {this.formatterType(type)}
                                        </div>
                                    )
                                },
                                {
                                    title: __('访问地址'),
                                    key: 'ip',
                                    width: '15%'
                                },
                                {
                                    title: __('站点密钥'),
                                    width: '10%',
                                    key: 'siteKey',
                                    renderCell: (siteKey, record) => (
                                        <div className={styles['table-row-sitekey']}>
                                            {siteKey}
                                        </div>
                                    )
                                },
                                {
                                    title: __('连接状态'),
                                    key: 'linkStatus',
                                    width: '10%',
                                    renderCell: (linkStatus, record) => (
                                        <div className={styles['table-row-sites']}>
                                            {this.formatterOnLineStatus(linkStatus, record)}
                                        </div>
                                    )
                                },
                                {
                                    title: __('存储空间'),
                                    width: '20%',
                                    key: 'usedSpace',
                                    renderCell: (usedSpace, record) => (
                                        //站点离线显示为---
                                        record && record.linkStatus === 0 && record.type !== ncTSiteType.NCT_SITE_TYPE_MASTER ? '---'
                                            :
                                            //第三方存储且获取不到完整数据则显示未知
                                            ((isNaN(usedSpace) && !usedSpace) || (isNaN(record['totalSpace']) || (usedSpace === 0 && record['totalSpace'] === 0)) && !record['totalSpace']) && OSSInfo && OSSInfo.provider ?
                                                __('未知')
                                                :
                                                <ProgressBar
                                                    value={this.getRate(usedSpace, record['totalSpace'])}
                                                    renderValue={(value) => this.getQuotaText(usedSpace, record['totalSpace'])}
                                                />
                                    )
                                },
                                {
                                    title: __('操作'),
                                    width: '20%',
                                    renderCell: (type, record) => (
                                        <div className={styles['table-row-sites']}>
                                            <div className={styles['form-sites']}>
                                                <div className={styles['edit']}>
                                                    <InlineButton
                                                        code={'\uf085'}
                                                        onClick={e => this.onEditeClick(e, record)}
                                                        disabled={(localSite && localSite.type === ncTSiteType.NCT_SITE_TYPE_SLAVE) || record['linkStatus'] == 0}
                                                        title={__('编辑站点')}
                                                    />
                                                </div>
                                                {
                                                    (localSite && localSite.type !== ncTSiteType.NCT_SITE_TYPE_MASTER) || record['type'] === ncTSiteType.NCT_SITE_TYPE_MASTER
                                                        ? null
                                                        :
                                                        <div className={styles['remove']}>
                                                            <InlineButton
                                                                code={'\uf075'}
                                                                onClick={e => this.onDeleteClick(e, record)}
                                                                title={__('移除分站点')}
                                                            />
                                                        </div>
                                                }

                                            </div>
                                        </div>
                                    )
                                }
                            ]}
                        />
                    )
                }
                {
                    this.state.errorHardwareType ?
                        <MessageDialog
                            onConfirm={this.onErrorHardwareTypeConfirm.bind(this)}>
                            {
                                __('本站点的型号不支持作为总站点。')
                            }
                        </MessageDialog>
                        :
                        null
                }
                {
                    this.state.showToggleSiteDialog ?
                        <ConfirmDialog
                            onConfirm={!multisiteEnabled ? () => this.setMultipleSiteStatus(multisiteEnabled) : () => this.setMultipleSiteStatus(multisiteEnabled, this.state.sites)}
                            onCancel={this.closeSiteDialog.bind(this)}
                        >
                            {
                                !multisiteEnabled ? __('开启多站点模式后，本站点将自动变更为分布式部署体系中的总站点。您确定要执行此操作吗？')
                                    : __('关闭多站点模式后，将自动移除所有的分站点，并导致这些站点中的数据无法访问。您确定要执行此操作吗？')
                            }
                        </ConfirmDialog>
                        :
                        null
                }
                {
                    removingSite ?
                        <ConfirmDialog
                            onConfirm={this.deleteSite.bind(this, removingSite)}
                            onCancel={this.closeDeleteDialog.bind(this)}
                        >
                            {__('移除该分站点，将导致站点中的数据无法访问。您确定要执行此操作吗？')}
                        </ConfirmDialog>
                        :
                        null
                }
                {
                    addingSite || editingSite ?
                        <Config
                            site={editingSite ? editingSite : null}
                            onSiteConfigSuccess={this.onSiteConfigSuccess.bind(this)}
                            onSiteConfigCancel={this.onSiteConfigCancel.bind(this)}
                            appIp={appIp}
                        />
                        : null
                }
                {
                    this.state.isClosing ?
                        <ProgressCircle
                            detail={__('正在关闭，请稍候......')}
                        />
                        :
                        null
                }
                {
                    this.state.removing ?
                        <ProgressCircle
                            detail={__('正在移除分站点，请稍候......')}
                        />
                        :
                        null
                }
            </div >
        )
    }

    /**
     * 获取百分比
     */
    getRate(usedSpace, totalSpace) {
        return usedSpace === 0 && totalSpace === 0 ? 0 : isNaN(usedSpace / totalSpace) ? 0 : usedSpace / totalSpace
    }

    /**
     * 获取进度文字百分比
     */
    getQuotaText(usedSpace, totalSpace) {
        let text = "";
        if (usedSpace < 0) {
            text = '--';
        } else {
            text = formatSize(usedSpace)
        }
        text += '/';
        if (totalSpace < 0) {
            return text += '--'
        } else {
            return text += formatSize(totalSpace)
        }
    }

    formatterType(type) {
        if (Number(type) === ncTSiteType.NCT_SITE_TYPE_NORMAL) {
            return __('普通站点')
        } else if (Number(type) === ncTSiteType.NCT_SITE_TYPE_MASTER) {
            return __('总站点')
        }
        else {
            return __('分站点')
        }
    }

    formatterOnLineStatus(onlineStatus, site) {
        if (onlineStatus === 1 && site && site.type !== ncTSiteType.NCT_SITE_TYPE_MASTER) {
            return <span className={styles['status-online']}>{__('在线')}</span>
        } else if (onlineStatus === 0 && site && site.type !== ncTSiteType.NCT_SITE_TYPE_MASTER) {
            return <span className={styles['status-offline']}>{__('离线')}</span>
        } else {
            return '---'
        }
    }

}