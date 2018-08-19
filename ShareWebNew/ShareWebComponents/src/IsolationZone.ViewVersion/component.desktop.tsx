import * as React from 'react';
import * as classnames from 'classnames';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import { decorateText } from '../../util/formatters/formatters';
import { getIcon } from '../helper';
import ViewVersionDialogBase from './component.base';
import * as styles from './styles.desktop.css';
import __ from './locale';


export default class ViewVersionDialog extends ViewVersionDialogBase {

    render() {

        return (
            <Dialog 
                width={800}
                title={decorateText(this.props.currentDoc['name'], { limit: 100 })}
                onClose={() => { this.props.onCloseDialog(); }}
            >
                <Panel>
                    <Panel.Main >
                        <DataGrid
                            height={400}
                            data={this.props.versionDocs}
                            className={classnames(styles['data-grid'])}
                            strap={true}
                        >
                            <DataGrid.Field
                                label={__('历史文件名称')}
                                field="name"
                                width="220"
                                formatter={(name, versionDoc) => {
                                    return (
                                        <div
                                            className={classnames(styles['field-name'])}

                                        >
                                            {/* 历史版本文件返回参数内没有size，默认size为1，这样就可以显示图标了 */}
                                            {getIcon({ name: versionDoc['name'], size: 1 }, { size: 32 })}
                                            <span
                                                className={classnames(styles['field-name-span'])}
                                                title={name}
                                                onClick={() => { this.props.onClickHistoryFileName(this.props.currentDoc, versionDoc); }}
                                            >
                                                {
                                                    decorateText(name, { limit: 25 })
                                                }
                                            </span>
                                        </div>
                                    )
                                }}
                            />
                            <DataGrid.Field
                                label={__('修改者')}
                                field="modifier"
                                width="80"
                                formatter={(modifier) => {
                                    return (
                                        <div title={modifier}>
                                            {
                                                decorateText(modifier, { limit: 8 })
                                            }
                                        </div>
                                    )
                                }}
                            />
                            <DataGrid.Field
                                label={__('修改时间')}
                                field="modified"
                                width="100"
                                formatter={(modified, versionDoc) => {
                                    return (
                                        <div >
                                            {
                                                this.convertToDate(versionDoc)
                                            }
                                        </div>
                                    )
                                }}
                            />
                            <DataGrid.Field
                                label={__('隔离原因')}
                                field="reason"
                                width="130"
                                formatter={(reason) => {
                                    return (
                                        <div title={reason}>
                                            {
                                                decorateText(reason, { limit: 15 })
                                            }
                                        </div>
                                    )
                                }}
                            />
                        </DataGrid>
                    </Panel.Main>
                </Panel>
            </Dialog>
        )
    }
}