import * as React from 'react'
import DocWatermarkScopeBase from './component.base'
import ToolBar from '../../ui/ToolBar/ui.desktop'
import DataGrid from '../../ui/DataGrid/ui.desktop'
import SearchBox from '../../ui/SearchBox/ui.desktop'
import UIIcon from '../../ui/UIIcon/ui.desktop'
import Text from '../../ui/Text/ui.desktop'
import DocLibSelector from '../DocLibSelector/component.view'
import Select from '../../ui/Select/ui.desktop'
import { getTypeNameByDocType } from '../../core/entrydoc/entrydoc'
import __ from './locale'
import * as styles from './styles.desktop.css'

const EntryDocNames = {
    userdoc: __('所有个人文档'),
    groupdoc: __('所有群组文档'),
    customdoc: __('所有文档库'),
    archivedoc: __('所有归档库')
}

export default class DocWatermarkScope extends DocWatermarkScopeBase {
    render() {
        const { page, watermarkInfos, key, adding, count } = this.state
        return (
            <div className={styles['container']}>
                <div className={styles['text']}>{__('添加至以下列表中的文档显示水印：')}</div>
                <ToolBar>
                    <ToolBar.Button icon={'\uf018'} onClick={this.addLibs.bind(this)}>{__('添加范围')}</ToolBar.Button>
                    <div className={styles['search-box']}>
                        <SearchBox
                            placeholder={__('搜索')}
                            value={key}
                            onChange={this.handleSearchKeyChange.bind(this)}
                        />
                    </div>
                </ToolBar>
                <div className={styles['grid']}>
                    <DataGrid
                        data={watermarkInfos}
                        height={400}
                        paginator={{ total: count, page, limit: this.PageSize }}
                        locator={() => -1}
                        rowHoverClass={styles['row']}
                        onPageChange={this.handlePageChange.bind(this)}
                    >
                        <DataGrid.Field
                            field="objName"
                            label={__('文档范围')}
                            width={100}
                            formatter={(objName, obj) => (
                                <Text>
                                    {['1', '2', '3', '4', '5'].indexOf(obj.objId) === -1 ? objName : EntryDocNames[objName]}
                                </Text>
                            )}
                        />
                        <DataGrid.Field
                            field="objType"
                            label={__('类型')}
                            width={50}
                            formatter={objType => (<Text>{getTypeNameByDocType(objType)} </Text>)}
                        />
                        <DataGrid.Field
                            label={__('水印策略')}
                            field="watermarkType"
                            width={100}
                            formatter={(watermarkType, obj) => (
                                <Select value={watermarkType} onChange={type => this.updateWatermarkDoc(obj, type)}>
                                    <Select.Option value={3}>{__('预览水印/下载水印')}</Select.Option>
                                    <Select.Option value={2}>{__('下载水印')}</Select.Option>
                                    <Select.Option value={1}>{__('预览水印')}</Select.Option>
                                    <Select.Option value={0}>{__('无水印')}</Select.Option>
                                </Select>
                            )}
                        />
                        <DataGrid.Field
                            field="objId"
                            label={__('操作')}
                            width={20}
                            formatter={(objId, obj) => (
                                ['1', '2', '3', '4', '5'].indexOf(objId) === -1 ?
                                    <UIIcon
                                        className={styles['delete']}
                                        size="16"
                                        code={'\uf013'}
                                        color={'#9a9a9a'}
                                        onClick={() => this.deleteWatermarkDoc(obj)}
                                    /> :
                                    '---'
                            )}
                        />
                    </DataGrid>
                </div>
                {
                    adding ?
                        <DocLibSelector
                            onConfirmSelectDocLib={adding.confirm}
                            onCancelSelectDocLib={adding.cancel}
                        /> :
                        null
                }
            </div>
        )
    }
}