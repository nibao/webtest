import * as React from 'react';
import * as classnames from 'classnames';
import { downloadFile } from '../../core/docretain/docretain'
import { getCsflevelText } from '../../core/permission/permission'
import { formatTime } from '../../util/formatters/formatters'
import SearchBox from '../../ui/SearchBox/ui.desktop';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import ToolBar from '../../ui/ToolBar/ui.desktop';
import UIIcon from '../../ui/UIIcon/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop'
import Text from '../../ui/Text/ui.desktop';
import FlexBox from '../../ui/FlexBox/ui.desktop'
import ViewVersion from './ViewVersion/component.view';
import DocRetainBase from './component.base';
import * as styles from './styles.view';
import __ from './locale';
import * as loading from './assets/images/loading.gif'

export default class DocRetain extends DocRetainBase {
    render() {
        const { current, results, paginator, value, searchingNow } = this.state;

        return (
            <div className={styles['container']}>
                <div className={styles['toolbar']}>
                    <ToolBar>
                        <div style={{ float: 'right' }}>
                            <SearchBox placeholder={__('搜索文件名')}
                                value={value}
                                loader={this.search.bind(this)}
                                onLoad={this.handleLoad.bind(this)}
                                style={{ width: 150 }}
                                onChange={this.handleChange.bind(this)}
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
                                            <div className={styles['loading-message']}>{__('正在搜索，请稍候...')}</div>
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
                    select={true}
                    paginator={paginator}
                    onPageChange={this.handlePageChange.bind(this)}
                    >
                    <DataGrid.Field
                        field="attribute"
                        width="120"
                        label={__('文件名')}
                        formatter={(attribute) => (
                            <Text className={styles['text']}>{attribute.name}</Text>
                        )}
                        />
                    <DataGrid.Field
                        field="attribute"
                        width="96"
                        label={__('密级')}
                        formatter={(attribute) => (
                            <Text className={styles['text']}>{getCsflevelText(attribute.csfLevel, this.csfLevelEnum)}</Text>
                        )}
                        />
                    <DataGrid.Field
                        field="attribute"
                        width="90"
                        label={__('创建者')}
                        formatter={(attribute) => (
                            <Text className={classnames(styles['text'], styles['margin'])}>{attribute.creator}</Text>
                        )}
                        />
                    <DataGrid.Field
                        field="attribute"
                        width="120"
                        label={__('创建时间')}
                        formatter={(attribute) => (
                            <Text className={styles['text']}>{formatTime(attribute.createTime / 1000, 'yyyy/MM/dd HH:mm')}</Text>
                        )}
                        />
                    <DataGrid.Field
                        field="metadata"
                        width="90"
                        label={__('修改者')}
                        formatter={(metadata) => (
                            <Text className={classnames(styles['text'], styles['margin'])}>{metadata.editor}</Text>
                        )}
                        />
                    <DataGrid.Field
                        field="metadata"
                        width="120"
                        label={__('修改时间')}
                        formatter={(metadata) => (
                            <Text className={styles['text']}>{formatTime(metadata.modified / 1000, 'yyyy/MM/dd HH:mm')}</Text>
                        )}
                        />
                    <DataGrid.Field
                        field="path"
                        width="200"
                        label={__('所在位置')}
                        formatter={(path, record) => (
                            <Text className={styles['text']}>
                                {
                                    record.retained
                                        ? __('系统回收区(原位置:') + this.prefix + path + ')'
                                        : this.prefix + path
                                }
                            </Text>
                        )}
                        />
                    <DataGrid.Field
                        field="metadata"
                        width="80"
                        label={__('操作')}
                        formatter={(metadata, record) => (
                            <div className={styles['margin']}>
                                <UIIcon
                                    title={__('查看版本')}
                                    size={16}
                                    code={'\uf067'}
                                    onClick={() => this.viewVersion(record)}
                                    />
                                <UIIcon
                                    className={styles['icon']}
                                    title={__('下载')}
                                    size={16}
                                    code={'\uf02a'}
                                    onClick={() => downloadFile({
                                        docId: record.docId,
                                        rev: metadata.rev,
                                        name: record.attribute.name,
                                        prefix: this.prefix,
                                        useHttps: this.useHttps,
                                        reqHost: this.reqHost,
                                        modifiedTime: metadata.modified,
                                        path: record.path,
                                        retained: record.retained
                                    })}
                                    />
                            </div>
                        )}
                        />
                </DataGrid>
                {
                    current
                        ? <ViewVersion
                            prefix={this.prefix}
                            current={current}
                            useHttps={this.useHttps}
                            reqHost={this.reqHost}
                            onClose={() => this.setState({ current: undefined })}
                            />
                        : null
                }
            </div>
        )
    }

}
