import * as React from 'react'
import BindingQueryBase, { SearchField, deviceType } from './component.base'
import ToolBar from '../../ui/ToolBar/ui.desktop'
import AutoComplete from '../../ui/AutoComplete/ui.desktop'
import AutoCompleteList from '../../ui/AutoCompleteList/ui.desktop'
import DataGrid from '../../ui/DataGrid/ui.desktop'
import Select from '../../ui/Select/ui.desktop'
import FlexBox from '../../ui/FlexBox/ui.desktop'
import * as classnames from 'classnames'
import __ from './locale'
import * as styles from './styles.view.css'

export default class BindingQuery extends BindingQueryBase {
    render() {
        let { netInfos, deviceInfos, searchResults, searchField, searchKey } = this.state
        return (
            <div className={ styles['container'] }>
                <div>
                    <label className={ styles['tip'] }>{ __('输入访问者或文档库名称，查询该访问者或文档库最终的绑定信息') }</label>
                </div>
                <div className={ styles['info-header'] }>
                    <ToolBar>
                        <FlexBox>
                            <FlexBox.Item width={ 230 }>
                                <Select onChange={ this.handleChangeSearchField.bind(this) } value={ searchField }>
                                    <Select.Option selected={ searchField === SearchField.User } value={ SearchField.User }>
                                        { __('访问者') }
                                    </Select.Option>
                                    <Select.Option selected={ searchField === SearchField.CustomLib } value={ SearchField.CustomLib }>
                                        { __('文档库') }
                                    </Select.Option>
                                    <Select.Option selected={ searchField === SearchField.ArchiveLib } value={ SearchField.ArchiveLib }>
                                        { __('归档库') }
                                    </Select.Option>
                                </Select>
                            </FlexBox.Item>
                            <FlexBox.Item>
                                <AutoComplete
                                    ref="auto-complete"
                                    value={ searchKey }
                                    width="100%"
                                    placeholder={ __('请输入访问者或文档库名称') }
                                    missingMessage={ __('没有找到符合条件的结果') }
                                    onChange={ this.handleSearchChange.bind(this) }
                                    loader={ this.loaders[searchField] }
                                    onLoad={ this.handleSearchLoaded.bind(this) }
                                    onEnter={ this.handleEnter.bind(this) }
                                >
                                    {
                                        searchResults && searchResults.length ? (
                                            <AutoCompleteList>
                                                {
                                                    searchResults.map(item => {
                                                        switch (searchField) {
                                                            case SearchField.User:
                                                                return (
                                                                    <AutoCompleteList.Item>
                                                                        <a href="javascript:void(0);" className={ styles['search-item'] } onClick={ () => this.queryUser(item) }>
                                                                            { item.name || item.displayName || item.departmentName }
                                                                        </a>
                                                                    </AutoCompleteList.Item>
                                                                )
                                                            case SearchField.ArchiveLib:
                                                            case SearchField.CustomLib:
                                                                return (
                                                                    <AutoCompleteList.Item>
                                                                        <a href="javascript:void(0);" className={ styles['search-item'] } onClick={ () => this.queryLib(item) }>
                                                                            { item.name }
                                                                        </a>
                                                                    </AutoCompleteList.Item>
                                                                )
                                                        }
                                                    })
                                                }
                                            </AutoCompleteList>
                                        ) : null
                                    }
                                </AutoComplete>
                            </FlexBox.Item>
                        </FlexBox>
                    </ToolBar>
                </div >
                <div>
                    <div className={ classnames(styles['fl'], styles['net-container']) }>
                        <div className={ styles['net-wrapper'] }>
                            <DataGrid data={ netInfos } height="450" className={ styles['data-grid'] }>
                                <DataGrid.Field
                                    label={ __('IP地址') }
                                    field="ip"
                                />
                                <DataGrid.Field
                                    label={ __('子网掩码') }
                                    field="subNetMask"
                                />
                            </DataGrid>
                        </div>
                    </div>
                    <div className={ classnames(styles['fr'], styles['device-container']) }>
                        <div className={ styles['device-wrapper'] }>
                            <DataGrid data={ deviceInfos } height="450" className={ styles['data-grid'] }>
                                <DataGrid.Field
                                    label={ __('设备识别码') }
                                    field="udid"
                                />
                                <DataGrid.Field
                                    label={ __('设备类型') }
                                    field="osType"
                                    formatter={ osType => deviceType[osType] }
                                />
                                <DataGrid.Field
                                    label={ __('状态') }
                                    field="bindFlag"
                                    formatter={ bindFlag => bindFlag ? __('绑定') : __('解绑') }
                                />
                            </DataGrid>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}