import * as React from 'react';
import { assign } from 'lodash';
import * as classnames from 'classnames';
import { formatSize, formatTime } from '../../util/formatters/formatters';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import LinkChip from '../../ui/LinkChip/ui.desktop';
import { getIcon } from '../helper';
import DocsGridBase from './component.base';

import * as styles from './styles.desktop.css';
import __ from './locale';

export default class DocsGrid extends DocsGridBase implements DocsGrid {
    render() {
        return (
            <DataGrid
                className={styles['docsgrid']}
                data={this.state.docs}
                onDblClickRow={this.open}
                select={{
                    multi: true
                }}
                >
                <DataGrid.Field
                    field="name"
                    label={__('文档名称')}
                    width="200"
                    formatter={(name, record) => (
                        <div className={styles['name']}>
                            {
                                getIcon(record)
                            }
                            <LinkChip
                                className={styles['docname']}
                                onClick={() => this.open(record)}
                                title={record.name || record.docname}
                                >
                                <span>{record.name || record.docname}</span>
                            </LinkChip>
                        </div>
                    )}
                    />
                <DataGrid.Field
                    field="typename"
                    label={__('类型')}
                    width="100px"
                    />
                <DataGrid.Field
                    field="size"
                    label={__('大小')}
                    width="100px"
                    formatter={function (size, record) {
                        switch (true) {
                            case record.size === -1 && record._size === undefined:
                                return <span>---</span>;

                            case record.size === -1 && record._size !== undefined:
                                return formatSize(record._size);

                            case record.size !== -1:
                                return formatSize(record.size);

                            default:
                                return '';
                        }
                    } }
                    />
                <DataGrid.Field
                    field="modified"
                    label={__('修改时间')}
                    width="100px"
                    formatter={(modified) => formatTime(modified / 1000)}
                    />
            </DataGrid>
        )
    }
}