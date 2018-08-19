import * as React from 'react';
import { assign } from 'lodash';
import { formatTimeRelative } from '../../util/formatters/formatters';
import { getViewName } from '../../core/entrydoc/entrydoc';
import { docname } from '../../core/docs/docs';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import LinkChip from '../../ui/LinkChip/ui.desktop';
import Icon from '../../ui/Icon/ui.desktop';
import FontIcon from '../../ui/FontIcon/ui.desktop';
import { getIcon } from '../helper';
import JournalListBase from './component.base';
import * as styles from './styles.desktop.css';
import * as titleIcon from './assets/images/title-icon.png'
import * as loading from './assets/images/loading.gif'
import * as download from './assets/images/download.png';
import __ from './locale';

export default class JournalList extends JournalListBase implements JournalList {
    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['header']}>
                    <Icon url={titleIcon} size={16}></Icon>
                    <label className={styles['title']}>{__('发布期刊')}</label>
                </div>

                {
                    this.state.loading ? (
                        <div>
                            <img className={styles['loading']} src={loading} />
                        </div>
                    ) : this.state.data.length ? (
                            <div className={styles['docs']}>
                                <DataGrid
                                    height={'100%'}
                                    headless={true}
                                    data={this.state.data}
                                    rowHoverClass={styles['highlight']}
                                >
                                    <DataGrid.Field
                                        field="name"
                                        width="80"
                                        formatter={(name, record) => (
                                            <div className={styles['cell-name']}>
                                                <div className={styles['dot']}>.</div>
                                                {
                                                    getIcon( assign(record, {isdir: false}), {size: 21} )
                                                }
                                                <LinkChip
                                                    className={styles['docname']}
                                                    onClick={() => this.props.preview(record)}
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
                                        field="name"
                                        width="8"
                                        className={styles['download-icon']}
                                        formatter={(name, record) => (
                                            <FontIcon
                                                font={'AnyShare'}
                                                size="14"
                                                code={'\uf02a'}
                                                fallback={download}
                                                onClick={() => this.download(record)} />
                                        )}
                                    />

                                    <DataGrid.Field
                                        field="modified"
                                        width="40"
                                        align="right"
                                        className={styles['time-cell']}
                                        formatter={modified => formatTimeRelative(modified / 1000)}
                                    />
                                    
                                </DataGrid>
                            </div>
                        ) : (
                            <div className={styles['empty']}>{__('暂无内容')}</div>
                        )
                }
                
                <div ref="download-file"></div>
            </div>
        )
    }
}