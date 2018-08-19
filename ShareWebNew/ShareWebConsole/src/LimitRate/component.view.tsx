import * as React from 'react';
import * as classnames from 'classnames';
import { CheckBox, Select, Text, DataGrid, SearchBox, UIIcon, ToolBar, Icon } from '../../ui/ui.desktop';
import LimitRateUserConfig from './LimitRateUserConfig/component.view';
import LimitRateUserGroupConfig from './LimitRateUserGroupConfig/component.view';
import ErrorMessage from './ErrorMessage/component.view';
import LimitRateBase from './component.base';
import { LimitRateType } from './helper';
import __ from './locale';
import * as styles from './styles.view';
import * as loadingIcon from './assets/loading.gif';

export default class LimitRate extends LimitRateBase {
    render() {
        const {
            limitRateType,
            limitRateStatus,
            showLimitRateConfigDialog,
            searchKey,
            limitRateInfo,
            count,
            page,
            errorInfo,
            loading
         } = this.state;
        return (
            <div>
                <CheckBox
                    onChange={limitState => this.handleLimitStateChange(limitState)}
                    checked={limitRateStatus}
                />
                <span
                    className={classnames(styles['text'])}
                    onClick={this.changeLimitState}
                >
                    {
                        limitRateType === LimitRateType.LimitUser ?
                            __('限制以下各个')
                            :
                            __('限制以下每个')
                    }
                </span>
                <div className={styles['select-margin']}>
                    <Select
                        className={styles['limit-type']}
                        menu={{ width: 100, maxHeight: 130 }}
                        onChange={type => this.changeLimitType(type)}
                        value={limitRateType}
                        disabled={!limitRateStatus}
                    >
                        <Select.Option
                            value={LimitRateType.LimitUser}
                            selected={limitRateType === LimitRateType.LimitUser}
                        >
                            {__('用户')}
                        </Select.Option>
                        <Select.Option
                            value={LimitRateType.LimitUserGroup}
                            selected={limitRateType === LimitRateType.LimitUserGroup}
                        >
                            {__('部门')}
                        </Select.Option>
                    </Select>
                </div>
                <span
                    className={styles['text']}
                    onClick={this.changeLimitState}
                >
                    {
                        limitRateType === LimitRateType.LimitUser ?
                            __('进行文件传输时的个人最大网速')
                            :
                            __('进行文件传输时的总体最大网速')
                    }
                </span>
                <div className={styles['discription-text']}>
                    {
                        limitRateType === LimitRateType.LimitUser ?
                            __('同时设置多个用户代表对每个用户分别限制，设置部门即代表对该部门下的每个用户分别限制')
                            :
                            __('可以对任意一个用户或部门进行限制，同一个部门内的用户在总体限制的前提下可动态使用其带宽资源')
                    }
                </div>
                <ToolBar>
                    <ToolBar.Button
                        icon={'\uf018'}
                        onClick={this.addLimitRateInfo}
                        disabled={!limitRateStatus || loading}
                    >
                        {__('添加')}
                    </ToolBar.Button>
                    <SearchBox
                        className={styles['search-box']}
                        placeholder={__('搜索')}
                        value={searchKey}
                        onChange={this.changeSearchKey}
                        loader={this.searchLimitRateInfo}
                        onLoad={data => { this.loadSearchResult(data) }}
                        disabled={!limitRateStatus}
                    />
                </ToolBar>
                <div className={styles['datagrid-area']}>
                    {
                        loading ?
                            <div className={styles['loading-container']}>
                                <div className={styles['loading-area']}>
                                    <Icon url={loadingIcon} />
                                    <div className={styles['loading-message']}>{__('正在加载，请稍候......')}</div>
                                </div>
                            </div>
                            : null
                    }
                    <DataGrid
                        className={classnames({ [styles['disable-status']]: !limitRateStatus })}
                        height={435}
                        data={limitRateInfo}
                        strap={true}
                        paginator={{ total: count, page, limit: this.DefaultPageSize }}
                        onPageChange={(page, ) => this.handlePageChange(page)}
                    >
                        <DataGrid.Field
                            field="id"
                            label={limitRateType === LimitRateType.LimitUser ? __('用户') : __('部门')}
                            width={150}
                            formatter={(id, record) => (
                                <Text>
                                    {
                                        this.makeUsersName(record)
                                    }
                                </Text>
                            )}
                        />
                        <DataGrid.Field
                            field="id"
                            label={limitRateType === LimitRateType.LimitUser ? __('个人最大传输速度') : __('总体最大传输速度')}
                            width={150}
                            formatter={(id, record) => (
                                <Text>
                                    {
                                        __('上传：${uploadRate}，下载：${downloadRate}', {
                                            'uploadRate': record.uploadRate === -1 ? __('不限制') : `${record.uploadRate}KB/s`,
                                            'downloadRate': record.downloadRate === -1 ? __('不限制') : `${record.downloadRate}KB/s`
                                        })
                                    }
                                </Text>
                            )}
                        />
                        <DataGrid.Field
                            field="id"
                            label={__('操作')}
                            width={50}
                            formatter={(id, record) => (
                                <div>
                                    <UIIcon
                                        className={styles['operation']}
                                        title={__('编辑')}
                                        size="16"
                                        code={'\uf01c'}
                                        color={'#999'}
                                        disabled={!limitRateStatus}
                                        onClick={() => this.editLimitRateInfo(record)}
                                    />
                                    <UIIcon
                                        className={styles['operation']}
                                        title={__('删除')}
                                        size="16"
                                        code={'\uf013'}
                                        color={'#999'}
                                        disabled={!limitRateStatus}
                                        onClick={() => this.deleteLimitRateInfo(record)}
                                    />
                                </div>
                            )}
                        />
                    </DataGrid>
                </div>
                {
                    showLimitRateConfigDialog ?
                        limitRateType === LimitRateType.LimitUser ?
                            <LimitRateUserConfig
                                editLimitRateInfo={this.limitRateInEdit}
                                onConfirmLimitRateConfig={this.handleConfirmLimitRateConfig}
                                onCancelLimitRateConfig={this.handleCancelLimitRateConfig}
                            />
                            :
                            <LimitRateUserGroupConfig
                                editLimitRateInfo={this.limitRateInEdit}
                                onConfirmLimitRateConfig={this.handleConfirmLimitRateConfig}
                                onCancelLimitRateConfig={this.handleCancelLimitRateConfig}
                            />
                        : null
                }
                {
                    errorInfo ?
                        <ErrorMessage
                            errorInfo={errorInfo}
                            onConfirmErrMsg={this.confirmErrMsg}
                        />
                        : null
                }
            </div>
        )
    }
}