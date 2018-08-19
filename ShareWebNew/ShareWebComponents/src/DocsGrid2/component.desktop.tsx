import * as React from 'react';
import * as classnames from 'classnames';
import { assign, fill } from 'lodash';
import { formatSize, formatTime } from '../../util/formatters/formatters';
import { getViewName } from '../../core/entrydoc/entrydoc';
import { docname, isDir } from '../../core/docs/docs';
import { formatType } from '../../core/extension/extension';
import { getErrorMessage } from '../../core/errcode/errcode';
import Crumbs from '../../ui/Crumbs/ui.desktop';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import LinkChip from '../../ui/LinkChip/ui.desktop';
import MessageDialog from '../../ui/MessageDialog/ui.desktop';
import { getIcon } from '../helper';
import DocsGridBase from './component.base';
import Icon from '../../ui/Icon/ui.desktop'
import * as styles from './styles.desktop.css';
import * as emptyDocImg from './assets/images/empty-doc.png'
import __ from './locale';

export default class DocsGrid extends DocsGridBase implements DocsGrid {
    render() {
        return (
            <div className={styles['container']} style={{ height: this.props.height }}>
                <div className={styles['crumbs']}>
                    <Crumbs
                        crumbs={this.state.crumbs}
                        formatter={crumb => docname(crumb)}
                        onChange={crumbs => this.back(crumbs)}
                    />
                </div>
                <div className={styles['docs']}>
                    <DataGrid
                        height={'100%'}
                        data={this.state.docs}
                        onDblClickRow={this.open.bind(this)}
                        getDefaultSelection={this.props.getDefaultSelection.bind(this)}
                        onSelectionChange={this.fireSelectionChangeEvent.bind(this)}
                        select={{
                            multi: true
                        }}
                    >
                        <DataGrid.Field
                            field="name"
                            label={__('文档名称')}
                            width="100"
                            formatter={(name, record) => (
                                <div className={styles['cell-name']}>
                                    {
                                        getIcon(record)
                                    }
                                    <LinkChip
                                        className={classnames(styles['docname'], { [styles['dir']]: isDir(record) })}
                                        onClick={this.open.bind(this, record)}
                                        title={docname(record)}
                                    >
                                        {
                                            record.view_type ? getViewName(record) : docname(record)
                                        }
                                    </LinkChip>
                                </div>
                            )}
                        />
                        <DataGrid.Field
                            field="typename"
                            label={__('类型')}
                            width="25"
                            formatter={(doctype, record) => formatType(record)}
                        />
                        <DataGrid.Field
                            field="size"
                            label={__('大小')}
                            width="25"
                            formatter={(size, record) => {
                                switch (true) {
                                    case record.size === -1 && record._size === undefined:
                                        return '---';

                                    case record.size === -1 && record._size !== undefined:
                                        return formatSize(record._size);

                                    case record.size !== -1:
                                        return formatSize(record.size);

                                    default:
                                        return '';
                                }
                            }}
                        />
                        <DataGrid.Field
                            field="modified"
                            label={__('修改时间')}
                            width="50"
                            formatter={(modified,record) => record.client_mtime ? formatTime(record.client_mtime / 1000) : formatTime(record.modified / 1000)}
                        />
                    </DataGrid>
                    {
                        this.state.docs.length === 0 ?
                            <div className={styles['empty-msg']}>
                                <Icon url={emptyDocImg} size={64} />
                                <div>
                                    {__('当前文件夹是空的，可以通过网页上传，或者安装客户端同步文件')}
                                </div>
                            </div> : null
                    }
                </div>
                {
                    this.state.error ?
                        <MessageDialog onConfirm={() => this.setState({ error: DocsGridBase.Status.OK })}>
                            {
                                getErrorMessage(this.state.error)
                            }
                        </MessageDialog> :
                        null
                }
            </div>
        )
    }
}