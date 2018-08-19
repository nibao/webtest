import * as React from 'react'
import * as classnames from 'classnames'
import { OperationOps } from '../../core/log/log';
import { formatTime } from '../../util/formatters/formatters'
import ToolBar from '../../ui/ToolBar/ui.desktop';
import SearchBox from '../../ui/SearchBox/ui.desktop'
import DataGrid from '../../ui/DataGrid/ui.desktop'
import UIIcon from '../../ui/UIIcon/ui.desktop'
import FlexBox from '../../ui/FlexBox/ui.desktop'
import Icon from '../../ui/Icon/ui.desktop'
import Text from '../../ui/Text/ui.desktop'
import FileInfo from './FileInfo/component.view'
import LinkShareRetainFilesBase from './component.base'
import * as styles from './styles.view.css'
import * as loading from './assets/images/loading.gif'
import __ from './locale'

/**
 * 获取opType对应的类型,下载 or 预览
 */
function getOpTypeString(opType: number): string {
    switch (opType) {
        case OperationOps.DOWNLOAD: {
            return __('下载')
        }

        case OperationOps.PREVIEW: {
            return __('预览')
        }

        default: {
            return ''
        }
    }
}

export default class LinkShareRetainFiles extends LinkShareRetainFilesBase {
    render() {
        const { searchingNow, results, paginator, fileInfo, value } = this.state

        return (
            <div>
                <div className={styles['toolbar']}>
                    <ToolBar>
                        <div style={{ float: 'right' }}>
                            <SearchBox
                                placeholder={__('搜索文件名')}
                                width={150}
                                value={value}
                                loader={this.search.bind(this)}
                                onLoad={this.handleLoad.bind(this)}
                                onChange={this.handleValueChange.bind(this)}
                                />
                        </div>
                    </ToolBar>
                </div>
                {
                    searchingNow
                        ? (
                            <div className={styles['loading']}>
                                <FlexBox>
                                    <FlexBox.Item align={'center middle'}>
                                        <div className={styles['loading-box']} >
                                            <Icon url={loading} />
                                            <div className={styles['loading-message']}>{__('正在加载，请稍候......')}</div>
                                        </div>
                                    </FlexBox.Item>
                                </FlexBox>
                            </div>
                        )
                        : null
                }
                <DataGrid
                    className={searchingNow ? styles['searching'] : styles['search-end']}
                    height={500}
                    data={results}
                    paginator={paginator}
                    onPageChange={this.handlePageChange.bind(this)}
                    >
                    <DataGrid.Field
                        field="fileName"
                        width="170"
                        label={__('文件名称')}
                        formatter={(fileName, record) => (
                            <div className={styles['text-icon']}>
                                <Text className={classnames(styles['text'], styles['text-width'])}>{fileName}</Text>
                                <UIIcon
                                    className={styles['icon']}
                                    title={__('下载')}
                                    size={16}
                                    code={'\uf02a'}
                                    onClick={() => this.downloadFile(record)}
                                    />
                            </div>
                        )}
                        />
                    <DataGrid.Field
                        field="rev"
                        width="150"
                        label={__('版本ID')}
                        formatter={(rev, record) => (
                            <Text className={styles['text']}>{rev}</Text>
                        )}
                        />
                    <DataGrid.Field
                        field="ip"
                        width="100"
                        label={__('访问IP')}
                        formatter={(ip, record) => (
                            <Text className={classnames(styles['text'], styles['margin'])}>{ip}</Text>
                        )}
                        />
                    <DataGrid.Field
                        field="date"
                        width="126"
                        label={__('访问时间')}
                        formatter={(date, record) => (
                            <Text className={styles['text']}>{formatTime(date / 1000, 'yyyy/MM/dd HH:mm:ss')}</Text>
                        )}
                        />
                    <DataGrid.Field
                        field="opType"
                        width="70"
                        label={__('操作类型')}
                        formatter={(opType, record) => (
                            <Text className={classnames(styles['text'], styles['margin'])}>{getOpTypeString(opType)}</Text>
                        )}
                        />
                    <DataGrid.Field
                        field="filePath"
                        width="170"
                        label={__('文件路径')}
                        formatter={(filePath, record) => (
                            <Text className={styles['text']}>{this.prefix + filePath}</Text>
                        )}
                        />
                    <DataGrid.Field
                        field="id"
                        width="70"
                        label={__('详细信息')}
                        formatter={(id, record) => (
                            <a
                                className={styles['detail']}
                                href="javascript:void(0)"
                                title={__('查看详情')}
                                onClick={() => this.viewFileInfo(id)}
                                >
                                {__('查看详情')}
                            </a>
                        )}
                        />
                </DataGrid>
                {
                    fileInfo
                        ? <FileInfo
                            fileInfo={fileInfo}
                            onClose={() => this.setState({ fileInfo: null })} />
                        : null
                }
            </div>
        )
    }
}