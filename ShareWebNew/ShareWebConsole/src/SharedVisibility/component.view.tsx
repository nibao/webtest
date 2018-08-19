import * as React from 'react'
import * as classnames from 'classnames'
import session from '../../util/session/session';
import UIIcon from '../../ui/UIIcon/ui.desktop'
import Text from '../../ui/Text/ui.desktop'
import CheckBox from '../../ui/CheckBox/ui.desktop'
import Select from '../../ui/Select/ui.desktop'
import Button from '../../ui/Button/ui.desktop';
import DataGrid from '../../ui/DataGrid/ui.desktop'
import ToolBar from '../../ui/ToolBar/ui.desktop'
import SearchBox from '../../ui/SearchBox/ui.desktop'
import OrganizationPicker from '../OrganizationPicker/component.view';
import { NodeType } from '../OrganizationTree/helper';
import SharedVisibilityBase from './component.base';
import { SearchField, ShowField } from './component.base';
import __ from './locale'
import * as styles from './styles.view'

export default class SharedVisibility extends SharedVisibilityBase {

    render() {
        const {hideUserStatus, hideOrgStatus, value, departments, showOrganizationPicker, exactSearch, searchRange, searchResults, changed } = this.state

        return (
            <div>
                <div className={styles['select-box']}>
                    <span className={styles['share-text']}>
                        {__('用户共享时，允许')}
                    </span>
                    <div className={styles['select']}>
                        <Select
                            value={exactSearch}
                            width={ 90 }
                            menu={{ width: 90, maxHeight: 130 }}
                            onChange = {this.handleChangeMethod.bind(this)}
                        >
                            <Select.Option selected={exactSearch === false} value={false}>{__('模糊')}</Select.Option>
                            <Select.Option selected={exactSearch === true} value={true}>{__('精确')}</Select.Option>
                        </Select>
                    </div> 
                    <span className={styles['share-text']}>
                        {__('搜索')}
                    </span> 
                    <div className={styles['select']}>
                        <Select
                            value={searchRange}
                            width={ 180 }
                            menu={{ width: 180, maxHeight: 130 }}
                            onChange={this.handleChangeSearch.bind(this)}
                        >
                            <Select.Option selected={searchRange === SearchField.UserName} value={SearchField.UserName}>{__('用户名')}</Select.Option>
                            <Select.Option selected={searchRange === SearchField.ShowName} value={SearchField.ShowName}>{__('显示名')}</Select.Option>
                            <Select.Option selected={searchRange === SearchField.AllUsers} value={SearchField.AllUsers}>{__('用户名/显示名')}</Select.Option>
                        </Select>
                    </div>   
                    <span className={styles['share-text']}>
                        {__('信息，搜索结果显示')}
                    </span>
                    <div className={styles['select']}>
                        <Select
                            value={searchResults}
                            width={ 180 }
                            menu={{ width: 180, maxHeight: 130 }}
                            onChange={this.handleChangeShowField.bind(this)}
                        >
                            <Select.Option selected={searchResults === ShowField.ShowName} value={ShowField.ShowName}>{__('显示名')}</Select.Option>
                            <Select.Option selected={searchResults === ShowField.AllUsers} value={ShowField.AllUsers}>{__('用户名/显示名')}</Select.Option>
                        </Select>
                    </div>               
                </div>
                <div className={styles['footer']}>
                    {
                        changed ?
                            <div>
                                <span className={styles['button-wrapper']}>
                                    <Button onClick={this.handleSave.bind(this)}>{__('保存')}</Button>
                                </span>
                                <span className={styles['button-wrapper']}>
                                    <Button onClick={this.handleCancel.bind(this)}>{__('取消')}</Button>
                                </span>
                            </div>
                            : null
                    }
                </div>
                <div className={styles['check-box']}>
                    <label>
                        <CheckBox
                            checked={hideUserStatus}
                            onChange={(checked) => this.setHideUserStatus(checked)}
                            />
                        <span className={styles['hide-text']}>{__('屏蔽组织结构用户成员信息')}</span>
                        <span className={styles['shadow-text']}>{__('（任何用户进行共享时不显示组织结构中的用户成员信息）')}</span>
                    </label>
                </div>
                <div className={styles['check-box']}>
                    <label>
                        <CheckBox
                            checked={hideOrgStatus}
                            onChange={(checked) => this.setHideOrgStatus(checked)}
                            />
                        <span className={styles['hide-text']}>{__('屏蔽组织结构信息')}</span>
                        <span className={styles['shadow-text']}>{__('（以下列表部门的用户进行共享时不显示组织结构）')}</span>
                    </label>
                </div>
                <div className={classnames({ [styles['disabled']]: !hideOrgStatus })}>
                    <div className={styles['info-header']}>
                        <ToolBar>
                            <ToolBar.Button
                                icon={'\uf018'}
                                onClick={() => this.setState({ showOrganizationPicker: true })}
                                disabled={!hideOrgStatus}
                                >
                                {__('添加部门')}
                            </ToolBar.Button>
                            <div style={{ float: 'right' }}>
                                <SearchBox
                                    placeholder={__('搜索')}
                                    disabled={!hideOrgStatus}
                                    value={value}
                                    loader={this.loader.bind(this)}
                                    onLoad={this.handleLoad.bind(this)}
                                    onChange={this.handleValueChange.bind(this)}
                                    />
                            </div>
                        </ToolBar>
                    </div>
                    <DataGrid
                        height={400}
                        data={departments}
                        >
                        <DataGrid.Field
                            field="departmentName"
                            width="400"
                            label={__('部门名称')}
                            formatter={(departmentName) => (
                                <Text className={styles['text']}>
                                    {departmentName}
                                </Text>
                            )}
                            />
                        <DataGrid.Field
                            field="departmentId"
                            width="100"
                            label={__('操作')}
                            formatter={(departmentId, record) => (
                                <UIIcon
                                    className={styles['icon']}
                                    size={16}
                                    code={'\uf013'}
                                    onClick={() => this.deleteDepartment(record)}
                                    disabled={!hideOrgStatus}
                                    />
                            )}
                            />
                    </DataGrid>
                </div>
                {
                    showOrganizationPicker ?
                        <OrganizationPicker
                            userid={session.get('userid')}
                            convererOut={({id, name}) => ({ departmentId: id, departmentName: name })}
                            selectType={[NodeType.DEPARTMENT, NodeType.ORGANIZATION]}
                            onCancel={() => this.setState({ showOrganizationPicker: false })}
                            onConfirm={departments => this.addDepartment(departments)}
                            title={__('添加部门')}
                            data={[]}
                            />
                        :
                        null
                }
            </div>
        )
    }
}