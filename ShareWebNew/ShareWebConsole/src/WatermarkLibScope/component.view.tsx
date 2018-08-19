import * as React from 'react';
import * as classnames from 'classnames';
import CheckBoxOption from '../../ui/CheckBoxOption/ui.desktop';
import SearchBox from '../../ui/SearchBox/ui.desktop';
import ToolBar from '../../ui/ToolBar/ui.desktop';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import DocLibSelector from '../DocLibSelector/component.view';
import WatermarkLibScopeBase from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';


export default class WatermarkLibScope extends WatermarkLibScopeBase {

    render() {
        return (
            <div className={styles['container']}>
                <CheckBoxOption
                    onChange={this.setDownloadWatermarkForAllStatus.bind(this)}
                    checked={this.state.downloadWatermarkForAllStatus}
                >{__('允许所有文档库显示固化水印')}</CheckBoxOption>
                <div className={styles['text']}>{__('添加至以下列表中的文档显示固化水印：')}</div>
                {
                    this.renderDataGrid()
                }
                {
                    this.state.addDocLibStatus ?
                        this.renderAddDocLib()
                        : null
                }
            </div>
        )
    }

    renderDataGrid() {
        const { downloadWatermarkDocList, count, page, searchKey, downloadWatermarkForAllStatus, inFetching } = this.state;
        return (
            <div className={classnames({ [styles['disabled']]: downloadWatermarkForAllStatus })}>
                <ToolBar>
                    <ToolBar.Button icon={'\uf018'} onClick={this.activateAddDocLib.bind(this)} disabled={downloadWatermarkForAllStatus}>
                        {__('添加范围')}
                    </ToolBar.Button>
                    <div className={styles['search-box']}>
                        <SearchBox
                            placeholder={__('搜索')}
                            value={searchKey}
                            disabled={downloadWatermarkForAllStatus}
                            onChange={this.changeSearchKey.bind(this)}
                            loader={this.searchDownloadWatermarkDocInfo.bind(this)}
                            onFetch={this.setLoadingStatus.bind(this)}
                            onLoad={data => { this.loadSearchResult(data) }}
                        />
                    </div>
                </ToolBar>
                <div className={classnames({ [styles['on-fetch']]: inFetching })}>
                    <DataGrid
                        height={400}
                        data={downloadWatermarkDocList}
                        paginator={{ total: count, page, limit: this.DEFAULT_PAGESIZE }}
                        onPageChange={(page, limit) => this.handlePageChange(page, limit)}
                    >
                        <DataGrid.Field
                            field="objName"
                            label={__('文档范围')}
                            width={150}
                            formatter={(objName, lib) => (
                                <Text>
                                    {objName}
                                </Text>
                            )}
                        />
                        <DataGrid.Field
                            field="objType"
                            label={__('类型')}
                            width={80}
                            formatter={(objType, lib) => (
                                <Text>
                                    {__('文档库')}
                                </Text>
                            )}
                        />
                        <DataGrid.Field
                            field="objId"
                            label={__('操作')}
                            width={50}
                            formatter={(objId, lib) => (
                                <UIIcon
                                    className={styles['delete']}
                                    size="16"
                                    code={'\uf013'}
                                    onClick={() => this.deleteDownloadWatermarkDoc(objId, lib)}
                                />
                            )}
                        />
                    </DataGrid>
                </div>
            </div>

        )
    }

    renderAddDocLib() {
        return (
            <DocLibSelector
                docLibs={[0]}
                onConfirmSelectDocLib={this.handleSubmitDocLib.bind(this)}
                onCancelSelectDocLib={this.handleCancelAddDocLib.bind(this)}
            />
        )
    }
}