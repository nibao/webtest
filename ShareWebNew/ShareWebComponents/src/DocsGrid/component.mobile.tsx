import * as React from 'react';
import { assign } from 'lodash';
import * as classnames from 'classnames';
import { getViewName, isTopView } from '../../core/entrydoc/entrydoc';
import { docname, isDir } from '../../core/docs/docs';
import { formatSize, formatTime } from '../../util/formatters/formatters';
import Icon from '../../ui/Icon/ui.mobile';
import FlexBox from '../../ui/FlexBox/ui.mobile';
import Crumbs from '../../ui/Crumbs/ui.mobile';
import DataGrid from '../../ui/DataGrid/ui.mobile';
import LinkChip from '../../ui/LinkChip/ui.mobile';
import { ClassName } from '../../ui/helper';
import ErrorDialog from '../../ui/ErrorDialog/ui.mobile';
import { getMobileIcon } from '../helper';
import DocsGridBase from './component.base';

import * as styles from './styles.mobile.css';
import __ from './locale';

import * as enter from './assets/enter.mobile.png';

export default class DocsGrid extends DocsGridBase implements DocsGrid {
    render() {
        return (
            <div className={styles['container']}>
                <div className={classnames(styles['navigator'], ClassName.BackgroundColor)}>
                    <Crumbs
                        crumbs={this.state.path}
                        formatter={(crumb) => isTopView(crumb) ? getViewName(crumb) : docname(crumb)}
                        onChange={() => this.back(this.state.path.slice(0, this.state.path.length - 1))}
                    />
                </div>
                <div className={styles['main']}>
                    <DataGrid
                        className={styles['docsgrid']}
                        data={this.state.docs}
                        onClickRow={this.open}
                        select={false}
                    >
                        <DataGrid.Field
                            field="name"
                            label={__('文档名称')}
                            width="200"
                            formatter={(name, record) => (
                                <div className={styles['record']}>
                                    <div className={styles['icon']}>
                                        {
                                            getMobileIcon(record)
                                        }
                                    </div>
                                    <div className={classnames(styles['docinfo'], { [styles['dir']]: isDir(record) })}>
                                        <div className={styles['name']}>
                                            {
                                                record.view_type ? getViewName(record) : docname(record)
                                            }
                                        </div>
                                        {
                                            !isDir(record) ?
                                                <div>
                                                    <FlexBox>
                                                        <FlexBox.Item align="bottom left">
                                                            {
                                                                <span className={styles['meta']}>{formatTime(record.modified / 1000)}</span>
                                                            }
                                                        </FlexBox.Item>
                                                        <FlexBox.Item align="bottom right">
                                                            {
                                                                <span className={styles['meta']}>{isDir(record) ? '' : formatSize(record.size)}</span>
                                                            }
                                                        </FlexBox.Item>
                                                    </FlexBox>
                                                </div>
                                                : null
                                        }
                                    </div>
                                    <div className={styles['action']}>
                                        {
                                            isDir(record) ? <Icon className={styles['enter']} size=".5rem" url={enter} /> : null
                                        }
                                    </div>
                                </div>
                            )}
                        />
                    </DataGrid>
                </div>
                {
                    (status => {
                        switch (status) {
                            case DocsGridBase.Status.NO_PERMISSION:
                                return (
                                    <ErrorDialog onConfirm={this.resetError.bind(this)}>
                                        {
                                            __('无法预览该文件,您的访问权限不足')
                                        }
                                    </ErrorDialog>
                                )
                            case DocsGridBase.Status.FILE_NOT_EXIST:
                                return (
                                    <ErrorDialog onConfirm={this.resetError.bind(this)}>
                                        {
                                            __('无法预览该文件,该文件已不存在')
                                        }
                                    </ErrorDialog>
                                )
                            default:
                                return null
                        }
                    })(this.state.status)
                }
            </div>
        )
    }
}