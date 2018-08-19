import * as React from 'react';
import * as classnames from 'classnames';
import { map } from 'lodash';
import { shrinkText } from '../../util/formatters/formatters';
import Dialog from '../../ui/Dialog2/ui.desktop';
import Panel from '../../ui/Panel/ui.desktop';
import DataGrid from '../../ui/DataGrid/ui.desktop';
import Select from '../../ui/Select/ui.desktop';
import Text from '../../ui/Text/ui.desktop';
import { getIcon } from '../helper';
import UploadSetCSFBase from './component.base';
import * as styles from './styles.desktop';
import __ from './locale';

export default class UploadSetCSF extends UploadSetCSFBase {
    render() {
        const { csfOptions, files } = this.props;
        const { csflevel } = this.state;
        return (
            <Dialog 
                width={900}
                onClose={this.CancelSetCSF.bind(this)}
                title={__('设置密级')}
            >
                <Panel>
                    <Panel.Main>
                        <span className={styles['tip']}>{__('请将选中的文件批量设置密级为：')}</span>
                        <div className={styles['dropbox']}>
                            <Select
                                className={styles['selsect-csf']}
                                menu={{ width: 120 }}
                                onChange={this.bulkSetCSF.bind(this)}
                                value={csflevel}
                            >
                                {
                                    map(csfOptions, ({ level, text }, index) => {
                                        return (
                                            <Select.Option
                                                value={level}
                                                key={level}
                                                selected={level === csflevel}
                                                className={classnames({ [styles.invisible]: level === 0 })}
                                            >
                                                {text}
                                            </Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                        <div className={styles['datagrid']}>
                            <DataGrid
                                height="300"
                                data={files}
                                select={{ multi: true }}
                                onSelectionChange={this.handleSelectionChange.bind(this)}
                            >
                                <DataGrid.Field
                                    field="name"
                                    label={__('文档名称')}
                                    width={80}
                                    formatter={(name, file) => (
                                        <div title={name}>
                                            <span className={styles['doc-icon']}>{getIcon(file)}</span>
                                            <span>{shrinkText(name, { limit: 40 })}</span>
                                        </div>
                                    )}
                                />
                                <DataGrid.Field
                                    field="relativePath"
                                    label={__('所在路径')}
                                    width={80}
                                    formatter={relativePath => (
                                        <Text>{relativePath}</Text>
                                    )}
                                />
                                <DataGrid.Field
                                    field="csflevel"
                                    label={__('文件密级')}
                                    width={40}
                                    formatter={(csflevel, file) => (
                                        <div onClick={this.stopProagate.bind(this)}>
                                            <Select
                                                className={styles['selsect-csf']}
                                                menu={{ width: 120 }}
                                                onChange={(level) => this.setCSF(level, file)}
                                                value={file.csflevel}
                                            >
                                                {
                                                    map(csfOptions, ({ level, text }, index) => {
                                                        return (
                                                            <Select.Option
                                                                value={level}
                                                                key={level}
                                                                selected={level === file.csflevel}
                                                                className={classnames({ [styles.invisible]: level === 0 })}
                                                            >
                                                                {text}
                                                            </Select.Option>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    )}
                                />
                            </DataGrid>
                        </div>
                    </Panel.Main>
                    <Panel.Footer>
                        <Panel.Button
                            disabled={this.props.files.some(file => file.csflevel === 0)}
                            onClick={this.saveFilesCSF.bind(this)}
                        >{__('确定')}
                        </Panel.Button>
                        <Panel.Button onClick={this.CancelSetCSF.bind(this)}>{__('取消')}</Panel.Button>
                    </Panel.Footer>
                </Panel>
            </Dialog >
        )
    }
}